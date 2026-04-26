# Live Deployment Guide — Minimum Spend

Three independent FastAPI services. Each can be deployed on its own; you
do not need to run all three at once. Start with whichever solution you
want to pilot first.

---

## Cost summary (monthly)

| Item | Solution 1 (Fraud) | Solution 2 (Credit) | Solution 3 (Agronomist) |
|---|---|---|---|
| VPS / PaaS | $5 | $5 | $5 |
| Anthropic API | — | — | ~$10–30 (see note) |
| WhatsApp channel | — | — | $0 (Meta free tier ≤1 k conv) |
| USSD bearer | — | — | ~₦0.40–₦0.80 / session (AT) |
| SSL/CDN | $0 (Cloudflare free) | $0 | $0 |
| Monitoring | $0 (UptimeRobot free) | $0 | $0 |
| **Minimum total** | **~$5/mo** | **~$5/mo** | **~$15–40/mo** |

Anthropic note: prompt caching means most per-query cost is the ~6 KB
knowledge block cache *read* (~$0.30/million tokens) not a full cache
*write* ($3.75/million tokens). At 1 000 farmer queries/day the variable
cost is roughly $0.30/day once the cache is warm.

---

## Prerequisites (all solutions)

1. **Git** installed on your laptop.
2. **Docker + Docker Compose** installed locally for building images.
3. A free account on the PaaS of your choice (Railway or Render — both
   have $5/mo entry tiers that cover a single-container app).
4. A domain name is optional; every platform gives you a free subdomain
   (`yourapp.railway.app`, `yourapp.onrender.com`).

---

## Part 1 — Deploy Solution 1 (Fraud Detection API)

No external API keys are required. The model trains on synthetic data at
startup — the first request takes ~3 s while scikit-learn fits the GBM;
every subsequent request is <50 ms.

### Option A — Railway (recommended, $5/mo hobby plan)

```bash
# 1. Install the Railway CLI
npm install -g @railway/cli          # or: brew install railway

# 2. Log in
railway login

# 3. From the repo root, initialise a new project
cd solutions/01-fraud-detection-api
railway init                         # choose "Empty project", give it a name

# 4. Set the optional API key (skip if you want the endpoint open for now)
railway variables set FRAUD_API_KEY=change-me-strong-secret

# 5. Deploy — Railway detects the Dockerfile automatically
railway up
```

Railway prints a public URL like `https://fraud-api-production.up.railway.app`.
Test it:

```bash
curl https://<your-subdomain>.up.railway.app/health
```

Expected:
```json
{"status":"ok","model":"gradient-boosting-v1"}
```

### Option B — Render (free tier → paid $7/mo)

Render's free tier spins down after 15 min of inactivity (cold start ~30 s).
For a pilot that's fine; upgrade to the $7/mo "Starter" plan for always-on.

1. Push the repo to GitHub (it already is on `claude/ai-nigeria-research-O2g72`).
2. Go to <https://render.com> → **New** → **Web Service**.
3. Connect the GitHub repo; set **Root Directory** to
   `solutions/01-fraud-detection-api`.
4. Render detects the Dockerfile. Leave defaults.
5. Add environment variable `FRAUD_API_KEY` under **Environment**.
6. Click **Create Web Service**.

### Pointing a custom domain (optional)

Add a `CNAME` record in Cloudflare pointing your subdomain to the
platform-provided hostname. Enable **Proxied** to get free SSL and DDoS
protection.

---

## Part 2 — Deploy Solution 2 (SME Credit Scoring API)

Identical steps to Solution 1. Swap directory and variable name.

```bash
cd solutions/02-sme-credit-scoring
railway init
railway variables set CREDIT_API_KEY=change-me-strong-secret
railway up
```

Test:
```bash
curl https://<your-subdomain>.up.railway.app/health
```

```json
{"status":"ok","model":"gradient-boosting-pd-v1"}
```

Score a borrower:
```bash
curl -s -X POST https://<your-subdomain>.up.railway.app/v1/score \
  -H "Content-Type: application/json" \
  -H "X-API-Key: change-me-strong-secret" \
  -d '{
    "business_name": "Adekunle Stores",
    "sector": "TRADE",
    "years_in_business": 5,
    "requested_amount_kobo": 100000000,
    "requested_tenure_months": 12,
    "bank_statement": {
      "months_covered": 12,
      "avg_monthly_credit_kobo": 12000000,
      "avg_monthly_debit_kobo": 9500000,
      "bounce_count": 0,
      "salary_credit_count": 0
    },
    "existing_obligations_monthly_kobo": 0,
    "dpd_history_max": 0
  }' | python3 -m json.tool
```

---

## Part 3 — Deploy Solution 3 (Farmer AI Agronomist)

This solution calls the Anthropic API at runtime. You need an
`ANTHROPIC_API_KEY` from <https://console.anthropic.com>.

### Step 1 — Get your Anthropic API key

1. Sign up / log in at <https://console.anthropic.com>.
2. Go to **API Keys** → **Create Key**.
3. Copy the key (starts with `sk-ant-`). Store it in a password manager —
   you cannot view it again.
4. Add credits: $20 is enough for a multi-week pilot at low volume.

### Step 2 — Deploy to Railway

```bash
cd solutions/03-farmer-ai-agronomist
railway init
railway variables set ANTHROPIC_API_KEY=sk-ant-your-key-here
railway variables set AGRO_API_KEY=change-me-strong-secret   # optional
railway up
```

Test:
```bash
curl https://<your-subdomain>.up.railway.app/health
```

```json
{"status":"ok","model":"claude-opus-4-7"}
```

Ask a farming question:
```bash
curl -s -X POST https://<your-subdomain>.up.railway.app/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: change-me-strong-secret" \
  -d '{
    "question": "Abeg, when I suppose plant maize for Lagos?",
    "state": "Lagos",
    "crop": "Maize"
  }' | python3 -m json.tool
```

### Step 3 — Connect WhatsApp (Meta Cloud API, free tier)

Meta Cloud API gives **1 000 free business-initiated conversations per
month**. That is enough for a pilot with a few hundred farmers.

1. Go to <https://developers.facebook.com> → **My Apps** → **Create App**
   → **Business** type.
2. Add the **WhatsApp** product to your app.
3. In **WhatsApp → Getting Started**, note your:
   - **Phone Number ID**
   - **WhatsApp Business Account ID**
   - **Temporary access token** (valid 24 h; replace with a System User
     token for production)
4. Under **Webhooks**, set:
   - **Callback URL**: `https://<your-subdomain>.up.railway.app/v1/whatsapp/webhook`
   - **Verify Token**: any string you choose, e.g. `naija-agro-verify`
5. Add the verify token as an env var:
   ```bash
   railway variables set WA_VERIFY_TOKEN=naija-agro-verify
   ```
   Then update `app/main.py` to check `hub.verify_token` on the `GET`
   webhook verification request (one-time, ~5 lines — see the note in
   the WhatsApp webhook section of the README).
6. Subscribe to the `messages` webhook field.

Farmers can now WhatsApp the test number Meta provides. To get a real
Nigerian number through WhatsApp Business Platform, apply for a permanent
phone number through the Meta dashboard and register it.

### Step 4 — Connect USSD (Africa's Talking)

Africa's Talking (AT) is the lowest-friction USSD provider in Nigeria.
Cost is ₦0.40–₦0.80 per session (billed per 20-second USSD window).

1. Create an account at <https://africastalking.com> (free sandbox included).
2. Go to **USSD** → **Create Channel**.
   - In the sandbox you get a simulated shortcode like `*384*xxx#`.
   - For production, AT applies for a shortcode with a Nigerian telco on
     your behalf (MTN, Airtel, Glo, 9mobile). Takes 2–4 weeks and costs
     ~₦50,000–₦200,000 one-time depending on the telco.
3. Set the **Callback URL** to:
   `https://<your-subdomain>.up.railway.app/v1/ussd`
4. In your AT dashboard, top up airtime credits; USSD billing is deducted
   from this balance.
5. Test in the AT sandbox simulator before going to production.

---

## Part 4 — Shared infrastructure

### SSL / CDN — Cloudflare free tier

All three Railway/Render subdomains already have TLS. If you use a custom
domain:

1. Sign up at <https://cloudflare.com> and add your domain.
2. Point your registrar's nameservers to Cloudflare's.
3. Add a `CNAME` record: `api` → `<platform-subdomain>`, **Proxied**.
4. Cloudflare handles free TLS termination and rate-limiting.

### Uptime monitoring — UptimeRobot free tier

UptimeRobot's free plan monitors up to 50 endpoints every 5 minutes and
sends email/Telegram alerts.

1. Sign up at <https://uptimerobot.com>.
2. Add three monitors, one per `/health` endpoint.
3. Set alert contacts to your email or a Telegram bot.

---

## Part 5 — Secrets management

Never commit `.env` files. Use each platform's dashboard:

| Platform | Where to set secrets |
|---|---|
| Railway | Project → Variables tab |
| Render | Service → Environment tab |

For local development only, copy the template:
```bash
cp .env.example .env   # edit with real values; .gitignore already excludes .env
```

Minimum `.env` per solution:

**Solution 1**
```
FRAUD_API_KEY=replace-with-strong-random-string
```

**Solution 2**
```
CREDIT_API_KEY=replace-with-strong-random-string
```

**Solution 3**
```
ANTHROPIC_API_KEY=sk-ant-...
AGRO_API_KEY=replace-with-strong-random-string
WA_VERIFY_TOKEN=replace-with-your-chosen-token
```

---

## Part 6 — Calling the APIs from a buyer's system

All three services expose standard JSON REST APIs documented at
`/docs` (Swagger UI) on each running instance.

Pass the API key in the header:
```
X-API-Key: your-key-here
```

A buyer's integration engineer can hit `/docs`, generate a client from
the OpenAPI spec (`/openapi.json`), and integrate in an afternoon.

---

## Upgrade path (when you land a paying customer)

| Concern | Minimum fix | Cost |
|---|---|---|
| More RAM (scikit-learn model) | Railway Starter ($20/mo, 8 GB RAM) | $20/mo |
| Persistent fraud history | Add Redis via Railway's Redis plugin | $5–10/mo |
| Per-farmer memory (Solution 3) | Add Postgres via Railway's Postgres plugin | $5/mo |
| Higher USSD throughput | AT enterprise plan; no code changes needed | Contact AT |
| WhatsApp > 1k conv/mo | Meta pay-as-you-go (~$0.008–$0.04 per conv) | Usage-based |
| CBN-compliant on-prem | Docker Compose on a baremetal VPS (Hetzner AX41, €37/mo) | €37/mo |

---

## Quickstart checklist

- [ ] `git clone` the repo and `cd` into it
- [ ] Pick one solution to pilot first
- [ ] Create Railway / Render account
- [ ] Set env vars in the platform dashboard
- [ ] Run `railway up` (or connect GitHub repo in Render)
- [ ] Hit `/health` — confirm 200 OK
- [ ] Send a real test request from the curl examples above
- [ ] Add UptimeRobot monitor on the `/health` URL
- [ ] (Solution 3 only) Wire up Meta Cloud API webhook
- [ ] (Solution 3 only) Set up Africa's Talking USSD sandbox, then apply for a production shortcode
