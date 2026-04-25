"""Credit scoring: gradient-boosted PD model + reason-code generation.

Trained on synthetic data shaped to plausible Nigerian MSME defaults so
the demo runs out of the box. Replace `_train_synthetic` with your own
labelled portfolio for production.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

from .features import FeatureVector
from .models import CreditApplication, Decision, ReasonCode

MODEL_VERSION = "sme-pd-2026.04"


@dataclass
class ScoringResult:
    pd_12m: float
    score: int
    reasons: list[ReasonCode]


def _train_synthetic(seed: int = 7) -> GradientBoostingClassifier:
    rng = np.random.default_rng(seed)
    n = 6000
    base_default = 0.18

    business_age = rng.gamma(3, 12, n)
    employees = rng.gamma(1.5, 2, n)
    req_amt = rng.gamma(2, 0.7, n)
    req_tenor = rng.choice([3, 6, 9, 12, 18, 24], n)
    monthly_credit = rng.gamma(2, 0.4, n) + 0.05
    monthly_debit = monthly_credit * rng.uniform(0.5, 1.05, n)
    avg_balance = monthly_credit * rng.uniform(0.05, 0.4, n)
    min_balance = avg_balance * rng.uniform(-0.2, 0.5, n)
    bounce_rate = rng.beta(1, 30, n) * 5
    inflow_div = rng.beta(2, 2, n)
    pos_volume = monthly_credit * rng.uniform(0, 0.6, n)
    pos_days = rng.uniform(0, 28, n)
    dsr = req_amt / np.maximum(0.1, req_tenor) / np.maximum(0.1, monthly_credit)
    dsr = np.clip(dsr, 0, 2)
    has_dpd = (rng.random(n) < 0.12).astype(int)
    sector_risk = rng.uniform(0.3, 0.65, n)
    inv_app = (rng.random(n) < 0.25).astype(int)
    supplier_credit = (rng.random(n) < 0.18).astype(int)

    # Synthesize a default-probability signal then sample.
    logit = (
        -1.5
        + 1.8 * dsr
        + 1.2 * has_dpd
        + 1.5 * bounce_rate
        + 1.6 * sector_risk
        - 0.6 * inflow_div
        - 0.02 * business_age
        - 0.4 * inv_app
        - 0.3 * supplier_credit
        + 0.6 * (req_amt / np.maximum(0.05, monthly_credit) > 4).astype(float)
        - 0.05 * pos_days
    )
    pd = 1 / (1 + np.exp(-logit))
    pd = np.clip(pd * (base_default / pd.mean()), 0.001, 0.95)
    y = (rng.random(n) < pd).astype(int)

    X = np.stack(
        [
            business_age,
            employees,
            req_amt,
            req_tenor.astype(float),
            monthly_credit,
            monthly_debit,
            avg_balance,
            min_balance,
            bounce_rate,
            inflow_div,
            pos_volume,
            pos_days,
            dsr,
            has_dpd,
            sector_risk,
            inv_app,
            supplier_credit,
        ],
        axis=1,
    )
    clf = GradientBoostingClassifier(
        n_estimators=180, max_depth=3, learning_rate=0.06, random_state=seed
    )
    clf.fit(X, y)
    return clf


_MODEL: GradientBoostingClassifier | None = None


def _get_model() -> GradientBoostingClassifier:
    global _MODEL
    if _MODEL is None:
        _MODEL = _train_synthetic()
    return _MODEL


def _pd_to_score(pd: float) -> int:
    """Map PD to a 300–850 FICO-ish score for lender UX."""
    pd = max(0.001, min(0.999, pd))
    odds = (1 - pd) / pd
    score = 600 + 60 * math.log(odds, 2)
    return int(max(300, min(850, round(score))))


def _reason_codes(fv: FeatureVector) -> list[ReasonCode]:
    out: list[ReasonCode] = []
    if fv.has_dpd:
        out.append(
            ReasonCode(
                code="EXISTING_DPD",
                impact="negative",
                detail="Borrower has at least one existing obligation past due.",
            )
        )
    if fv.debt_service_ratio > 0.5:
        out.append(
            ReasonCode(
                code="HIGH_DEBT_SERVICE_RATIO",
                impact="negative",
                detail=f"DSR of {fv.debt_service_ratio:.2f} exceeds 0.50 threshold.",
            )
        )
    if fv.bounce_rate > 0.5:
        out.append(
            ReasonCode(
                code="FREQUENT_BOUNCED_DEBITS",
                impact="negative",
                detail="Bounce rate on bank statement is elevated.",
            )
        )
    if fv.business_age_months >= 24:
        out.append(
            ReasonCode(
                code="ESTABLISHED_BUSINESS",
                impact="positive",
                detail=f"Business operating for {int(fv.business_age_months)} months.",
            )
        )
    if fv.cash_inflow_diversity >= 0.5:
        out.append(
            ReasonCode(
                code="DIVERSIFIED_INFLOWS",
                impact="positive",
                detail="Revenue spread across many distinct payers.",
            )
        )
    if fv.pos_active_days >= 20:
        out.append(
            ReasonCode(
                code="ACTIVE_POS_OPERATIONS",
                impact="positive",
                detail="POS terminal active most days of the month.",
            )
        )
    if fv.supplier_credit:
        out.append(
            ReasonCode(
                code="SUPPLIER_CREDIT_VOUCHED",
                impact="positive",
                detail="Borrower already receives supplier credit.",
            )
        )
    if not out:
        out.append(
            ReasonCode(
                code="THIN_FILE", impact="negative",
                detail="Limited data; manual review recommended.",
            )
        )
    return out


def score_application(app: CreditApplication, fv: FeatureVector) -> ScoringResult:
    model = _get_model()
    pd = float(model.predict_proba(np.array([fv.as_array()]))[0, 1])
    score = _pd_to_score(pd)
    return ScoringResult(pd_12m=pd, score=score, reasons=_reason_codes(fv))


def recommend_terms(
    app: CreditApplication, pd: float
) -> tuple[int, int, int, Decision]:
    """Risk-based pricing: cap amount and tenor against capacity."""
    monthly_credit_kobo = (
        app.statement.total_credits_kobo / max(1, app.statement.months_observed)
    )
    # Cap monthly repayment at 25% of monthly inflow.
    cap_monthly_repayment = int(0.25 * monthly_credit_kobo)
    requested_monthly = (
        app.requested_amount_kobo / max(1, app.requested_tenor_months)
    )

    if pd >= 0.40:
        return 0, 0, 0, Decision.DECLINE
    if pd >= 0.20:
        decision = Decision.REVIEW
    else:
        decision = Decision.APPROVE

    if requested_monthly <= cap_monthly_repayment:
        amt = app.requested_amount_kobo
        tenor = app.requested_tenor_months
        repayment = int(requested_monthly)
    else:
        # Scale amount down to fit affordability.
        tenor = app.requested_tenor_months
        amt = cap_monthly_repayment * tenor
        repayment = cap_monthly_repayment

    return amt, tenor, repayment, decision
