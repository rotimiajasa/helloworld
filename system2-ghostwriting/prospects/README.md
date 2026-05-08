# Prospects

Daily outreach pipeline.

## Files

- **`inbox.csv`** — fresh prospects to DM. Columns:
  ```
  name,linkedin_url,headline,company,recent_post_url,recent_post_text
  ```
- **`outbox/YYYY-MM-DD.md`** — generated DMs to send (one file per day). Review, copy, send manually.
- **`sent.csv`** — log of who's been DM'd. Auto-appended.

## Building `inbox.csv`

### Option 1 — LinkedIn Sales Navigator (recommended once revenue covers $80/mo)

1. Build a search with the filters in [`../icp.md`](../icp.md).
2. Export top 50 to CSV via Sales Nav's bulk export.
3. For each row, paste their most recent post text/URL (Sales Nav gives you the link).

### Option 2 — Free LinkedIn (start here)

1. Search by job title + region (e.g. `("CEO" OR "Founder") AND "Lagos"`).
2. Filter by "Posted" → "past week".
3. For each promising match, copy:
   - Their name, LinkedIn URL, headline.
   - Their most recent post URL + first 300 chars of post text.
4. Paste into `inbox.csv`.

Aim to top up `inbox.csv` to ~30 fresh prospects every Sunday evening — that's the week's outreach fuel.

### Option 3 — Apify or PhantomBuster scrapers

Cheaper than Sales Navigator. Pay-per-result. Configure with same filters from `icp.md`. Output to CSV in the format above.

## Daily run

```bash
cd orchestrator
npm run prospect -- --count 15
```

This drafts up to 15 personalized DMs into `prospects/outbox/YYYY-MM-DD.md`. You skim, edit lightly, and send manually from LinkedIn (NOT automated — automated DMs trigger LinkedIn anti-spam).

## Tracking

`sent.csv` has `linkedin_url, date, variant`. Use it to:
- Avoid re-DMing.
- Calculate reply rates per variant (A/B/C) and tune.
