"""Hybrid scoring: weighted rules + a gradient-boosted classifier.

The classifier is trained on synthetic data at module load so the demo
runs out of the box. In production, replace `_train_synthetic` with a
nightly job that pulls labelled events (via the /feedback endpoint) and
retrains, then versions and reloads the model atomically.
"""

from __future__ import annotations

import math
import os
from dataclasses import dataclass

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

from .features import FeatureVector

MODEL_VERSION = "fraud-hybrid-2026.04"


@dataclass
class ScoringResult:
    risk_score: int
    reason_codes: list[str]


def _train_synthetic(seed: int = 42) -> GradientBoostingClassifier:
    """Train a baseline model on plausible Nigerian-fraud-shaped data.

    Patterns seeded:
      * fraud rings drain accounts at night (23:00-05:00)
      * fraud ring transactions go to many distinct beneficiaries fast
      * one device touching many accounts => mule farming
      * amount >> account average => account takeover drain
      * known-mule beneficiary => near-certain fraud
    """
    rng = np.random.default_rng(seed)
    n = 8000
    fraud_rate = 0.03

    is_fraud = rng.random(n) < fraud_rate
    amount_m_ngn = np.where(
        is_fraud,
        rng.gamma(2.0, 1.5, n),
        rng.gamma(1.2, 0.4, n),
    )
    is_new_beneficiary = np.where(
        is_fraud,
        rng.random(n) < 0.85,
        rng.random(n) < 0.15,
    ).astype(int)
    kyc_tier = rng.choice([1, 2, 3], n, p=[0.5, 0.35, 0.15])

    sender_count_5m = np.where(
        is_fraud,
        rng.poisson(4, n),
        rng.poisson(0.4, n),
    )
    sender_count_1h = sender_count_5m + np.where(
        is_fraud, rng.poisson(8, n), rng.poisson(1, n)
    )
    sender_sum_1h = sender_count_1h * (amount_m_ngn * 0.7 + 0.1)
    distinct_benefs = np.where(
        is_fraud,
        rng.poisson(5, n),
        rng.poisson(0.5, n),
    )
    device_accts = np.where(
        is_fraud,
        rng.poisson(3, n),
        rng.poisson(0.2, n),
    )
    geo_change = np.where(is_fraud, rng.random(n) < 0.4, rng.random(n) < 0.05).astype(
        int
    )
    night = np.where(is_fraud, rng.random(n) < 0.55, rng.random(n) < 0.18).astype(int)
    velocity_ratio = np.where(
        is_fraud,
        rng.gamma(3, 2.0, n),
        rng.gamma(1, 0.4, n),
    )
    known_mule = np.where(is_fraud, rng.random(n) < 0.15, np.zeros(n)).astype(int)

    X = np.stack(
        [
            amount_m_ngn,
            is_new_beneficiary,
            kyc_tier,
            sender_count_5m,
            sender_count_1h,
            sender_sum_1h,
            distinct_benefs,
            device_accts,
            geo_change,
            night,
            velocity_ratio,
            known_mule,
        ],
        axis=1,
    )
    y = is_fraud.astype(int)

    clf = GradientBoostingClassifier(
        n_estimators=120, max_depth=3, learning_rate=0.1, random_state=seed
    )
    clf.fit(X, y)
    return clf


_MODEL: GradientBoostingClassifier | None = None


def _get_model() -> GradientBoostingClassifier:
    global _MODEL
    if _MODEL is None:
        _MODEL = _train_synthetic()
    return _MODEL


def _rule_overlay(fv: FeatureVector) -> tuple[int, list[str]]:
    """Hard rules layered on top of the model. These exist to (a) catch
    edge cases the ML may miss with sparse data, and (b) give analysts
    auditable reason codes."""
    bumps: list[tuple[int, str]] = []
    if fv.known_mule_beneficiary:
        bumps.append((60, "BENEFICIARY_KNOWN_MULE"))
    if fv.distinct_beneficiaries_1h >= 6:
        bumps.append((25, "MANY_DISTINCT_BENEFICIARIES_1H"))
    if fv.device_account_count_24h >= 5:
        bumps.append((20, "DEVICE_TOUCHING_MANY_ACCOUNTS"))
    if fv.geo_change_5m and fv.amount_kobo >= 50_000_00:
        bumps.append((15, "GEO_IMPOSSIBILITY_HIGH_AMOUNT"))
    if fv.high_velocity_amount_ratio >= 8 and fv.is_new_beneficiary:
        bumps.append((20, "AMOUNT_SPIKE_NEW_BENEFICIARY"))
    if fv.night_hour and fv.amount_kobo >= 1_000_000_00:
        bumps.append((10, "LARGE_NIGHT_TRANSFER"))

    total = sum(b for b, _ in bumps)
    return total, [code for _, code in bumps]


def score(fv: FeatureVector) -> ScoringResult:
    model = _get_model()
    proba = float(model.predict_proba(np.array([fv.as_array()]))[0, 1])
    base = int(round(proba * 100))

    overlay_bump, overlay_codes = _rule_overlay(fv)
    risk = min(100, base + overlay_bump)

    reason_codes = list(overlay_codes)
    if base >= 50 and "MODEL_HIGH_RISK_PATTERN" not in reason_codes:
        reason_codes.append("MODEL_HIGH_RISK_PATTERN")
    if not reason_codes and risk < 20:
        reason_codes.append("LOW_RISK_BASELINE")

    return ScoringResult(risk_score=risk, reason_codes=reason_codes)
