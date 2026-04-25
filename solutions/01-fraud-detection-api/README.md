# Naija Fraud Detection API

Real-time AI fraud-scoring for Nigerian banks and fintechs. Banks submit
each transaction inline and receive a risk score (0–100), reason codes,
and a recommended action (`allow` / `step_up` / `block`).

## Why

NIBSS reported **₦25.85B** lost to digital payment fraud in Nigeria in
2025, with social engineering and mule funnelling as the dominant
techniques. Most banks still run rule-based engines that miss multi-account
mule farms and ATO drain patterns. This service plugs into the existing
payment flow with sub-100ms inline scoring and a feedback loop for
continuous learning.

## Architecture

```
   ┌──────────────┐    POST /v1/score    ┌──────────────────────┐
   │ Core Banking ├─────────────────────▶│ Fraud Detection API   │
   │  / Switch    │                       │  - feature extraction │
   │              │◀──────────────────────┤  - hybrid scoring     │
   └──────┬───────┘   risk + action       │  - rolling memory     │
          │                                └──────────────────────┘
          │  POST /v1/feedback (label after fact)
          ▼
   nightly retrain  ──▶  versioned model reload
```

Scoring is a hybrid:

1. **Gradient-boosted classifier** trained on transaction features.
2. **Rule overlay** for hard, auditable patterns (known mule, geo
   impossibility, velocity drain).

## Quickstart

```bash
cd solutions/01-fraud-detection-api
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Swagger UI: <http://localhost:8000/docs>.

### Run tests

```bash
pytest
```

### Run with Docker

```bash
docker compose up --build
```

## API

### `POST /v1/score`

Request body: `Transaction` (see `app/models.py`). All amounts in **kobo**.

Response:
```json
{
  "txn_id": "TXN-DEMO-001",
  "risk_score": 12,
  "action": "allow",
  "reason_codes": ["LOW_RISK_BASELINE"],
  "model_version": "fraud-hybrid-2026.04",
  "latency_ms": 4
}
```

### `POST /v1/feedback`

Submit a confirmed-fraud label after the bank's investigation. Used by the
nightly retraining job.

### `POST /v1/feedback/mule?account=...`

Mark a beneficiary account as a known mule. Future inline scores against
that account return `BENEFICIARY_KNOWN_MULE` and block.

## Production deployment notes

- **Data residency**: container can run on-prem inside CBN-compliant
  banking infrastructure. No external network calls in the hot path.
- **State store**: replace `app/storage.py:RollingStore` with Redis.
  Interface is intentionally narrow.
- **Model store**: persist trained model with `joblib.dump`; load on boot.
  Roll forward via blue-green deploy.
- **Auth**: set `FRAUD_API_KEY` env var; clients send `X-Api-Key`. For
  bank-grade prod use mTLS at the ingress.
- **Observability**: add Prometheus middleware (`prometheus-fastapi-
  instrumentator`) and ship logs to your SIEM.
- **Latency target**: p99 < 80ms on a 2-core VM. Hot path is one numpy
  matmul + dict lookups.

## Pricing model (suggested)

- Per-call: ₦0.50–₦2.00 depending on volume tier.
- Minimum: ₦5M/month for tier-1 banks; ₦500k/month for fintechs.
- Block-rebate: percentage credit on confirmed-fraud blocks.
