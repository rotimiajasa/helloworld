from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _good_app(**overrides):
    base = {
        "application_id": "APP-001",
        "business_name": "Mama Funke Provisions",
        "bvn_hash": "deadbeefcafe",
        "sector": "retail",
        "state": "Lagos",
        "business_age_months": 36,
        "employees": 4,
        "requested_amount_kobo": 50_000_000,  # NGN 500,000
        "requested_tenor_months": 6,
        "statement": {
            "months_observed": 6,
            "total_credits_kobo": 9_000_000_000,
            "total_debits_kobo": 8_400_000_000,
            "avg_monthly_balance_kobo": 200_000_000,
            "min_monthly_balance_kobo": 50_000_000,
            "bounced_debits_count": 1,
            "distinct_inflow_payers": 38,
            "pos_terminal_volume_kobo": 3_500_000_000,
            "pos_active_days_per_month": 26,
        },
        "existing_obligations": [],
        "has_inventory_app": True,
        "has_supplier_credit": True,
    }
    base.update(overrides)
    return base


def _bad_app(**overrides):
    base = _good_app(
        application_id="APP-002",
        business_age_months=2,
        employees=0,
        statement={
            "months_observed": 3,
            "total_credits_kobo": 1_500_000_000,
            "total_debits_kobo": 1_650_000_000,
            "avg_monthly_balance_kobo": 5_000_000,
            "min_monthly_balance_kobo": -2_000_000,
            "bounced_debits_count": 9,
            "distinct_inflow_payers": 3,
            "pos_terminal_volume_kobo": 0,
            "pos_active_days_per_month": 0,
        },
        existing_obligations=[
            {
                "lender": "OtherFin",
                "outstanding_kobo": 30_000_000,
                "monthly_repayment_kobo": 8_000_000,
                "days_past_due": 22,
            }
        ],
        has_inventory_app=False,
        has_supplier_credit=False,
        requested_amount_kobo=200_000_000,
        requested_tenor_months=12,
    )
    base.update(overrides)
    return base


def test_health():
    r = client.get("/health")
    assert r.status_code == 200


def test_strong_borrower_approved():
    r = client.post("/v1/score", json=_good_app())
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] in ("approve", "review")
    assert body["score"] >= 600
    assert body["recommended_amount_kobo"] > 0
    codes = [rc["code"] for rc in body["reason_codes"]]
    assert "ESTABLISHED_BUSINESS" in codes


def test_weak_borrower_declined_or_reviewed():
    r = client.post("/v1/score", json=_bad_app())
    assert r.status_code == 200
    body = r.json()
    assert body["decision"] in ("decline", "review")
    codes = [rc["code"] for rc in body["reason_codes"]]
    assert any(c in codes for c in ("EXISTING_DPD", "FREQUENT_BOUNCED_DEBITS",
                                    "HIGH_DEBT_SERVICE_RATIO"))


def test_affordability_caps_amount_when_request_too_large():
    payload = _good_app(
        requested_amount_kobo=100_000_000_000,  # absurd ask
        requested_tenor_months=6,
    )
    r = client.post("/v1/score", json=payload)
    body = r.json()
    if body["decision"] != "decline":
        # Ensure approved/review amount fits 25% of monthly inflow rule.
        monthly_credit = payload["statement"]["total_credits_kobo"] / payload[
            "statement"
        ]["months_observed"]
        cap = 0.25 * monthly_credit
        assert body["monthly_repayment_kobo"] <= cap + 1
