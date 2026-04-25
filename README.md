# AI for Nigeria — research, MVPs, and buyer map

A self-contained package covering:

1. **Research** on five high-impact problems in Nigeria solvable with AI
   — `docs/research-report.md`
2. **Three working MVP prototypes** for the top-prioritised problems —
   `solutions/01-...`, `solutions/02-...`, `solutions/03-...`
3. **A buyer outreach list** of public company channels for each
   solution — `docs/buyers-outreach-list.md`

## At a glance

| # | Problem | Solution shipped | Path |
|---|---------|------------------|------|
| 1 | Digital payment fraud (₦25.85B 2025 losses, NIBSS) | Real-time AI fraud-scoring API | `solutions/01-fraud-detection-api/` |
| 2 | $32.2B MSME credit gap (IFC); FINCLUDE buys AI appraisal | Alt-data PD scoring API | `solutions/02-sme-credit-scoring/` |
| 3 | 1:10,000 extension agent : farmer ratio | Multilingual WhatsApp/USSD agronomist (Claude Opus 4.7) | `solutions/03-farmer-ai-agronomist/` |
| 4 | Healthcare diagnostic gap | Designed; not built (regulatory load) | `docs/research-report.md` |
| 5 | Education / WAEC-JAMB learning poverty | Designed; not built (CAC moat first) | `docs/research-report.md` |

## How to read

Start with `docs/research-report.md` to see the problem framing and
why these five were chosen. Each `solutions/NN-.../README.md` has its
own quickstart, architecture, deployment notes, and suggested pricing.

## How to run

Each solution is a Python 3.11 FastAPI service with `pytest` tests and
a `Dockerfile` + `docker-compose.yml`. From any solution folder:

```bash
pip install -e ".[dev]"
pytest                   # all green
uvicorn app.main:app --reload
# or
docker compose up --build
```

Solution 3 (the agronomist) requires `ANTHROPIC_API_KEY` for live
calls; the test suite runs without one (the Anthropic client is mocked).

## Honest scope notes

- "Ready to ship" here means **working MVP prototypes** — runnable
  code, valid contracts, tests, deploy paths. They are not
  ops-hardened SaaS platforms.
- Before each solution touches production traffic at a Nigerian bank,
  lender, or agritech, you need: security audit, load test,
  observability, regulatory sign-off (CBN, NDPR, NAFDAC where
  applicable), and a real labelled dataset for retraining the
  classifiers (the demo models are trained on plausible synthetic
  data so the code runs out of the box).
- Buyer contacts in `docs/buyers-outreach-list.md` are *publicly
  listed* corporate channels only. No fabricated personal contacts.
  Re-verify before sending outreach.

## Branch

All work lives on `claude/ai-nigeria-research-O2g72`.
