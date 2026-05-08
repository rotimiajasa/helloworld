# Setup Runbook

One-time tasks to take this from repo → live, monetized site. Budget: 1 weekend.

## 1. Accounts to create (all free to start)

### Payment rails (do these FIRST so revenue can flow when it arrives)

| Account | Purpose | Notes |
|---|---|---|
| **Payoneer** | Receives Ezoic, AdSense (in some cases), most affiliate networks | Sign up at payoneer.com, link your Nigerian bank (GTBank/Access/Zenith all work). KYC takes 1–3 days. |
| **Wise** | USD/EUR/GBP receiving + cheap NGN conversion | Open a "Wise Account" — gives you a US ACH routing number. |
| **Selar.co** | Sells digital product, pays NGN next-day to your Nigerian bank | Nigerian platform. No VAT headache. |
| **Paystack** (optional) | If you ever charge Naira directly | Native Nigerian Stripe-equivalent. |

### Tooling

| Service | Why | Cost |
|---|---|---|
| **Cloudflare** | DNS + Pages hosting | Free |
| **GitHub** | Repo + Actions cron | Free |
| **Anthropic Console** | Claude API key | Pay-as-you-go |
| **Namecheap / Porkbun** | Domain | $10/year |
| **Buttondown** | Email list (free <100 subs) | Free → $9/mo |
| **Typefully** (optional) | Schedules tweet threads | Free tier |
| **Plausible** or GA4 | Analytics | Free (GA4) |

### Monetization (apply when ready)

| Network | Apply when | Payout to |
|---|---|---|
| **Ezoic** | 0+ pageviews (no traffic minimum since 2022) | Payoneer / PayPal |
| **Mediavine** | 50k sessions/mo (later) | Payoneer / PayPal |
| **Amazon Associates** (US) | Day 1 | Gift card → resell, or Payoneer |
| **Jumia KOL** | Day 1 | NGN bank direct |
| **Konga Affiliate** | Day 1 | NGN bank direct |
| **Hostinger Affiliate** | Day 1 | PayPal / bank |
| **Deriv / Exness IB** | Day 1 (high RPM in this niche) | Wire / crypto |
| **Fiverr Affiliates (CPA)** | Day 1 | Payoneer |

## 2. Domain & hosting

```bash
# After buying domain at Namecheap:
# 1. In Cloudflare, add the domain (free plan).
# 2. Point Namecheap nameservers to Cloudflare's.
# 3. In Cloudflare Pages: connect this GitHub repo.
#    - Build command: cd site && npm install && npm run build
#    - Build output:  site/dist
#    - Root directory: /
```

## 3. Secrets

Create `orchestrator/.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
SERP_PROVIDER=brave            # or 'serpapi' or 'tavily'
SERP_API_KEY=...               # optional but improves keyword research
SITE_URL=https://yourdomain.com
DRY_RUN=false
```

Add the same as **GitHub Actions secrets** (Settings → Secrets → Actions):

- `ANTHROPIC_API_KEY`
- `SERP_API_KEY`

## 4. Personalize the brand

1. Edit `style-guide.md` — change voice, add 2–3 paragraphs of YOUR voice samples (paste from a WhatsApp message, a tweet you wrote, anything). Claude clones tone from these.
2. Edit `topics-backlog.md` — add/remove topics. Aim for 50+ seeds.
3. Edit `site/src/consts.ts` — site title, author name, social handles.
4. Hand-write 3–5 seed articles (~800 words each) in `site/src/content/posts/`. **This is the only real manual writing.** Examples to write:
   - "How I withdrew my first $100 from Upwork to GTBank in 2026"
   - "Payoneer vs Wise vs Geegpay for Nigerian freelancers — real numbers"
   - "5 USD skills you can learn in 30 days with zero capital"

## 5. First run

```bash
cd orchestrator
npm install
npm run dev -- --dry-run     # prints plan, makes no API calls beyond research
npm run weekly                # real run, ~$2–4 in API spend
```

The script writes 5 markdown files to `site/src/content/posts/` and opens a draft PR.

## 6. Schedule

The GitHub Action in `.github/workflows/weekly-publish.yml` runs **Mondays 06:00 UTC** (07:00 WAT). Edit the cron line if you want a different time.

## 7. Apply for ads & affiliates

- **Day 0**: apply to Amazon, Jumia, Konga, Hostinger, Deriv, Fiverr.
- **Day 14** (after ~20 articles published): apply to Ezoic.
- Insert affiliate links via Claude — the `seo-editor` sub-agent reads `affiliates.json` and inserts contextual links automatically.

## 8. Sell a digital product (month 2+)

When you have ~20 articles and an email list of 100+:

1. Use Claude to compile your best content + new material into a 30-page PDF: *"The Naira-Proof Income Playbook — 12 USD-earning paths for Nigerians, ranked by realistic monthly $".*
2. Upload to **Selar.co**, price ₦4,500 (~$3).
3. Add a banner CTA on every article + email footer.
4. Selar pays directly to your Nigerian bank next-day.

## 9. What to watch

- **Anthropic Console → Usage**: set a hard monthly cap ($50 to start).
- **Cloudflare Analytics**: traffic trend.
- **Search Console**: index coverage, query impressions.
- **Buttondown**: subscriber growth.

## Risks & mitigations

- **Google AI penalty** → every post must include 2–3 sentences of YOUR commentary. The PR template enforces this with a checkbox.
- **Niche saturation** → once profitable, clone pipeline to a second niche (the orchestrator is parametric on niche).
- **Payout rail closed** → maintain Payoneer + Wise + Selar in parallel.
