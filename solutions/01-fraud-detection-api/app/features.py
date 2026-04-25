"""Feature extraction for fraud scoring.

Features were chosen against the 2025 NIBSS fraud landscape — the dominant
techniques are social engineering, account-takeover -> rapid drain, and
mule-account funnelling. These features are designed to surface those
patterns inline without needing a graph DB.
"""

from __future__ import annotations

import time
from dataclasses import dataclass

from .models import Transaction
from .storage import Event, RollingStore


@dataclass
class FeatureVector:
    amount_kobo: int
    is_new_beneficiary: int
    sender_kyc_tier: int
    sender_txn_count_5m: int
    sender_txn_count_1h: int
    sender_amount_sum_1h: int
    distinct_beneficiaries_1h: int
    device_account_count_24h: int
    geo_change_5m: int
    night_hour: int
    high_velocity_amount_ratio: float
    known_mule_beneficiary: int

    def as_array(self) -> list[float]:
        return [
            float(self.amount_kobo) / 1_000_000.0,  # millions of NGN
            float(self.is_new_beneficiary),
            float(self.sender_kyc_tier),
            float(self.sender_txn_count_5m),
            float(self.sender_txn_count_1h),
            float(self.sender_amount_sum_1h) / 1_000_000.0,
            float(self.distinct_beneficiaries_1h),
            float(self.device_account_count_24h),
            float(self.geo_change_5m),
            float(self.night_hour),
            float(self.high_velocity_amount_ratio),
            float(self.known_mule_beneficiary),
        ]

    @staticmethod
    def feature_names() -> list[str]:
        return [
            "amount_m_ngn",
            "is_new_beneficiary",
            "sender_kyc_tier",
            "sender_txn_count_5m",
            "sender_txn_count_1h",
            "sender_amount_sum_1h_m_ngn",
            "distinct_beneficiaries_1h",
            "device_account_count_24h",
            "geo_change_5m",
            "night_hour",
            "high_velocity_amount_ratio",
            "known_mule_beneficiary",
        ]


def extract(txn: Transaction, store: RollingStore) -> FeatureVector:
    sender_5m = store.recent("account", txn.sender_account, 5 * 60)
    sender_1h = store.recent("account", txn.sender_account, 60 * 60)

    distinct_benefs_1h = len({e.beneficiary_account for e in sender_1h})
    sender_amount_sum_1h = sum(e.amount_kobo for e in sender_1h)

    device_24h_accounts = 0
    if txn.device_id:
        device_events = store.recent("device", txn.device_id, 24 * 3600)
        device_24h_accounts = len({e.beneficiary_account for e in device_events})

    geo_change = 0
    if txn.geo_state and sender_5m:
        last_geos = {e.geo_state for e in sender_5m if e.geo_state}
        if last_geos and txn.geo_state not in last_geos:
            geo_change = 1

    hour = txn.timestamp.hour
    night_hour = 1 if hour >= 23 or hour < 5 else 0

    avg_amount = (
        sum(e.amount_kobo for e in sender_1h) / len(sender_1h) if sender_1h else 0
    )
    velocity_ratio = (txn.amount_kobo / avg_amount) if avg_amount > 0 else 0.0

    return FeatureVector(
        amount_kobo=txn.amount_kobo,
        is_new_beneficiary=int(txn.is_new_beneficiary),
        sender_kyc_tier=txn.sender_kyc_tier,
        sender_txn_count_5m=len(sender_5m),
        sender_txn_count_1h=len(sender_1h),
        sender_amount_sum_1h=sender_amount_sum_1h,
        distinct_beneficiaries_1h=distinct_benefs_1h,
        device_account_count_24h=device_24h_accounts,
        geo_change_5m=geo_change,
        night_hour=night_hour,
        high_velocity_amount_ratio=round(velocity_ratio, 3),
        known_mule_beneficiary=int(store.is_known_mule(txn.beneficiary_account)),
    )


def remember(txn: Transaction, store: RollingStore) -> None:
    e = Event(
        ts=time.time(),
        amount_kobo=txn.amount_kobo,
        geo_state=txn.geo_state,
        beneficiary_account=txn.beneficiary_account,
        is_new_beneficiary=txn.is_new_beneficiary,
    )
    store.add("account", txn.sender_account, e)
    if txn.device_id:
        store.add("device", txn.device_id, e)
    if txn.ip_address:
        store.add("ip", txn.ip_address, e)
