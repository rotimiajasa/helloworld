# Naija Farmer AI Agronomist

Multilingual AI extension agent for Nigerian smallholder farmers. Reachable
via WhatsApp, USSD (feature phones), and SMS bridges. Powered by Claude
Opus 4.7 with prompt caching on a distilled Nigerian agronomy knowledge
base, and high-resolution vision for pest/disease diagnosis from a leaf
photo.

## Why

- FAO recommends **1 extension agent per 1,000 farmers**. Nigeria runs
  closer to **1 : 10,000**.
- Smartphone penetration is rising fast — but feature phones still
  dominate in the North, so **USSD/SMS coverage is non-negotiable**.
- Yoruba, Hausa, Igbo, and Pidgin each have tens of millions of
  speakers; English-only assistants miss the majority of farmers.
- Pilot agronomy advisory programs (Brookings, GSMA) report
  **+20–40% yield improvement** with timely localised advice.

## What it does

1. **Text Q&A** — farmers ask in their language; AgroNaija replies in
   the same language. Detection covers English / Pidgin / Yoruba /
   Hausa / Igbo.
2. **Photo diagnosis** — farmer sends a leaf/pest photo via WhatsApp;
   model identifies the most-likely cause and prescribes one clear
   action plus one safety warning.
3. **USSD menu** — feature-phone users dial `*789#` (or any operator
   code), pick a crop and topic, and receive a 160-char response.
4. **WhatsApp webhook** — Twilio-compatible endpoint for the
   smartphone segment.

## Architecture

```
   Farmer (WhatsApp / USSD / SMS)
              │
              ▼
   ┌──────────────────────┐    Anthropic API
   │ FastAPI gateway      │───▶  claude-opus-4-7
   │  - lang detection    │      adaptive thinking,
   │  - USSD state        │      prompt caching on
   │  - WA webhook        │      agronomy KB
   └──────────────────────┘
              │
              ▼
   Per-farmer history (Postgres)   ─ optional, omitted in MVP
```

## Quickstart

```bash
cd solutions/03-farmer-ai-agronomist
pip install -e ".[dev]"
export ANTHROPIC_API_KEY=sk-ant-...
uvicorn app.main:app --reload --port 8002
```

Swagger UI: <http://localhost:8002/docs>.

```bash
pytest      # tests use a mocked Anthropic client; no API key needed
```

```bash
docker compose up --build
```

## Endpoints

### `POST /v1/chat`

Plain text question → answer. Auto-detects language.

```json
{
  "question": "Abeg, my tomato dey die small small. Wetin I go do?",
  "state": "Kaduna",
  "crop": "Tomato"
}
```

### `POST /v1/diagnose`

Image + question → diagnosis. Image is base64.

### `POST /v1/ussd`

Africa's Talking-compatible USSD webhook. Drives the menu state machine
off the cumulative `text` field.

### `POST /v1/whatsapp/webhook`

Twilio-compatible WhatsApp webhook. Returns plain text in the MVP; in
production wrap in TwiML XML.

## Why Claude Opus 4.7

- **Adaptive thinking** keeps reasoning concise on simple queries
  ("when do I plant?") and goes deeper on diagnosis with side-effects
  ("which spray for fall armyworm?").
- **Prompt caching** on the agronomy reference block (the bulk of the
  system prompt) gives ~90% cost reduction once the cache warms — every
  farmer query reads the same ~6KB knowledge dump.
- **High-resolution vision** at 2576px on the long edge captures
  enough leaf detail for pest ID without server-side downscaling.
- **Multilingual quality** is strong on Yoruba, Hausa, Igbo, and
  Nigerian Pidgin without needing a separate translation layer.

## Production deployment notes

- **Per-farmer history**: add a Postgres-backed `messages` table keyed
  by phone-number hash so the agent has memory across turns. This MVP
  is stateless — fine for one-off queries, weak for follow-ups.
- **Knowledge base versioning**: today the KB is a single Python
  string. Move to a vector store keyed off (state, crop) so the system
  prompt only carries relevant facts — saves tokens and improves
  quality.
- **PII / NIN exposure**: never log the Body / phone-number pair
  together; hash on ingestion.
- **Safe-pesticide rails**: add a deny-list pre-check for queries
  asking how to mix banned actives or use medical-grade compounds.
- **Outbound monetisation**: when a farmer asks about an input price,
  return a vendor referral link and rev-share with the input company.
- **WhatsApp (Twilio) production response**: wrap the reply in TwiML
  `<Response><Message>...</Message></Response>` and set
  `Content-Type: text/xml`. The MVP returns plain text for inspection.

## Pricing model (suggested)

- B2B SaaS for agritech operators: ₦2M–₦8M/month per 50k farmers.
- B2B2C with input companies: rev-share on referrals.
- Donor-funded deployments: cost-per-farmer-served, typically
  $0.20–$0.50/farmer/month including SMS/USSD bearer fees.
