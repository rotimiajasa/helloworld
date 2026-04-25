from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.main import app
from app.models import Transaction


client = TestClient(app)


def _txn(**overrides):
    base = dict(
        txn_id="TXN0001",
        timestamp=datetime.now(timezone.utc).isoformat(),
        amount_kobo=10_000_00,  # NGN 10,000
        channel="mobile",
        sender_account="0123456789",
        beneficiary_account="9876543210",
        beneficiary_bank_code="058",
        device_id="dev-1",
        ip_address="102.89.1.1",
        geo_state="Lagos",
        is_new_beneficiary=False,
        sender_kyc_tier=2,
    )
    base.update(overrides)
    return base


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_low_risk_baseline_allows():
    r = client.post("/v1/score", json=_txn())
    assert r.status_code == 200
    body = r.json()
    assert body["action"] == "allow"
    assert body["risk_score"] < 50


def test_known_mule_blocks():
    mule = "1111111111"
    r0 = client.post("/v1/feedback/mule", params={"account": mule})
    assert r0.status_code == 200

    r = client.post(
        "/v1/score",
        json=_txn(
            txn_id="TXN0002",
            beneficiary_account=mule,
            is_new_beneficiary=True,
            amount_kobo=5_000_000_00,
        ),
    )
    assert r.status_code == 200
    body = r.json()
    assert body["action"] == "block"
    assert "BENEFICIARY_KNOWN_MULE" in body["reason_codes"]


def test_velocity_drain_pattern_steps_up_or_blocks():
    # Simulate ATO drain: 8 rapid transfers to new beneficiaries at night.
    now = datetime.now(timezone.utc).replace(hour=2)
    last_action = None
    for i in range(8):
        ts = (now + timedelta(seconds=i * 10)).isoformat()
        r = client.post(
            "/v1/score",
            json=_txn(
                txn_id=f"TXN-DRAIN-{i}",
                timestamp=ts,
                beneficiary_account=f"22222222{i:02d}",
                is_new_beneficiary=True,
                amount_kobo=200_000_00,
                sender_account="9999999999",
                device_id="ato-device",
            ),
        )
        last_action = r.json()["action"]
    assert last_action in ("step_up", "block")


def test_validation_rejects_letters_in_account():
    bad = _txn(sender_account="ABCDEFGHIJ")
    r = client.post("/v1/score", json=bad)
    assert r.status_code == 422
