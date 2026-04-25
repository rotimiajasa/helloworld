# Naija SME Credit Scoring API

Alternative-data credit scoring for Nigerian MSMEs. Submit a credit
application with a 6-month bank/POS statement summary; receive a
12-month probability of default, a 300–850 lender-friendly score, a
decision (`approve` / `review` / `decline`), and risk-based recommended
terms.

## Why

- **$32.2B unmet MSME credit demand** in Nigeria (IFC).
- **Fewer than 5%** of Nigerian MSMEs have access to bank credit (World
  Bank).
- The **$500M World Bank FINCLUDE** facility (Dec 2025) explicitly funds
  AI-enabled appraisal modernisation for participating lenders.

Most MSMEs don't have audited financials but have rich digital
footprints: POS volumes via Moniepoint/OPay, mobile-money flows, bank
statement aggregation via Mono/Okra/Stitch. This API converts that
footprint into a defensible credit decision with auditable reason codes.

## Architecture

```
   ┌─────────────────────┐  POST /v1/score   ┌────────────────────────────┐
   │ Loan Origination /  ├──────────────────▶│ Credit Scoring API          │
   │ Mobile App          │                   │  - feature engineering      │
   │ (Mono/Okra pull)    │◀──────────────────┤  - PD model (gboost)        │
   └─────────────────────┘  PD + decision    │  - reason codes             │
                                             │  - affordability cap        │
                                             └────────────────────────────┘
```

## Quickstart

```bash
cd solutions/02-sme-credit-scoring
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8001
```

Swagger UI: <http://localhost:8001/docs>.

```bash
pytest
```

```bash
docker compose up --build
```

## Contract

`POST /v1/score` accepts a `CreditApplication` and returns:

```json
{
  "application_id": "APP-001",
  "pd_12m": 0.072,
  "score": 712,
  "decision": "approve",
  "recommended_amount_kobo": 50000000,
  "recommended_tenor_months": 6,
  "monthly_repayment_kobo": 8333333,
  "reason_codes": [
    {"code": "ESTABLISHED_BUSINESS", "impact": "positive", "detail": "..."},
    {"code": "DIVERSIFIED_INFLOWS", "impact": "positive", "detail": "..."}
  ],
  "model_version": "sme-pd-2026.04"
}
```

## Decisioning rules

- `pd >= 0.40` → **decline**.
- `0.20 <= pd < 0.40` → **review** (push to loan officer).
- `pd < 0.20` → **approve**.
- Monthly repayment capped at **25% of monthly inflow** (affordability).
- Amount automatically scaled down if request exceeds capacity.

## Production deployment notes

- **Statement aggregation**: integrate with Mono / Okra / Stitch SDK in
  the originating app; POST the aggregated summary here.
- **CBN consumer credit disclosure**: the `reason_codes` array is
  designed to satisfy adverse-action-notice content requirements; map
  codes 1:1 to your customer-facing letter.
- **Model retraining**: keep a labelled portfolio table; retrain monthly
  on the previous 18 months. Track AUC, KS, and PSI.
- **Bias monitoring**: watch decision rates by state and sector.
- **Audit log**: every decision and its features should be persisted for
  7 years.

## Pricing model (suggested)

- Per-decision: ₦150–₦400.
- Volume tiers from ₦2M/month minimum.
- Premium tier: dedicated retraining on the lender's own portfolio.
