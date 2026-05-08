# Naija USD Hustle — Autonomous Content System

Niche: **USD-earning side hustles for Nigerians**.

A self-running content site + email list. Claude researches, writes, edits, and repurposes. You approve a weekly batch (~30–60 min/week). Revenue stacks: display ads, affiliates, digital product, sponsored posts. All payouts route to a Nigerian Naira bank account via Payoneer / Wise / Selar.

## Repo layout

```
.
├── orchestrator/         Claude Agent SDK pipeline (TypeScript)
│   ├── src/
│   │   ├── orchestrator.ts        Main weekly pipeline
│   │   ├── agents/                Sub-agents (research, write, edit, repurpose)
│   │   └── lib/                   Shared client, caching, state
│   └── package.json
├── skills/               Reusable Claude Skills
│   ├── pillar-post/
│   ├── comparison-post/
│   ├── how-to-post/
│   ├── newsletter/
│   └── tweet-thread/
├── site/                 Astro static site (Cloudflare Pages)
│   ├── src/
│   └── astro.config.mjs
├── .github/workflows/    Weekly cron + deploy
├── style-guide.md        Brand voice
├── topics-backlog.md     Keyword seed list
└── SETUP.md              One-time setup runbook (accounts, keys, deploy)
```

## Weekly flow

1. **Mon 06:00 WAT** — GitHub Action triggers orchestrator.
2. Orchestrator runs sub-agents in parallel:
   - Keyword research (WebSearch, picks 5 unaddressed topics from backlog).
   - Competitor scrape (WebFetch top 10 SERP results per topic).
   - Article drafts (Batch API, 50% off — 5 × 1500-word articles).
   - SEO editor (schema, internal links, alt text, meta).
   - Repurpose (newsletter digest + 5 tweet threads + 1 LinkedIn post).
3. Commits markdown to `site/src/content/posts/` and queue files to `out/`.
4. Opens a draft PR titled `Weekly content batch — YYYY-MM-DD`.
5. **You** spend 30–60 min adding 2–3 sentences of personal commentary per post and merge.
6. Cloudflare Pages deploys on merge. Email + social are scheduled via Buttondown + Typefully.

## Quick start

See [`SETUP.md`](./SETUP.md) for the full runbook. TL;DR:

```bash
# 1. Install
cd orchestrator && npm install
cd ../site && npm install

# 2. Set ANTHROPIC_API_KEY in .env
cp orchestrator/.env.example orchestrator/.env

# 3. Dry-run the pipeline
cd orchestrator && npm run dev -- --dry-run

# 4. First real run (generates 5 articles into site/src/content/posts/)
npm run weekly
```

## Economics

| Month | Articles | Traffic | Net (USD) |
|---:|---:|---:|---:|
| 1–3   | 60–90  | <500   | ~$0 (investment phase)   |
| 4–6   | 150    | 2–5k   | $20–80                   |
| 7–9   | 220    | 8–15k  | $100–300                 |
| 10–12 | 300    | 20–40k | $300–800                 |

API spend is the dominant cost (~$15–30/month at this volume with Batch + caching). Domain $10/year. Hosting $0 (Cloudflare Pages free tier).
