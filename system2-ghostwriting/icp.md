# Ideal Customer Profile (ICP)

The orchestrator's `prospect.ts` filters against these criteria. The tighter the targeting, the higher the reply rate.

## Hard filters (must match all)

- Based in Africa OR diaspora running African-market business.
  - Country priorities: Nigeria, Kenya, South Africa, Ghana, Egypt, Rwanda.
- Role contains: founder / CEO / CTO / COO / head of growth / head of product / VC partner / principal / GP / managing director.
- Company stage: pre-seed → Series B (NOT Series C+, those have agencies).
- Posts on LinkedIn at least once in the last 30 days (proves intent).
- LinkedIn followers between **2,000 and 30,000**.
  - <2k: not enough engagement to make work look good.
  - >30k: likely already has agency or doesn't need help.

## Soft filters (Claude scores each)

- Posts mention business pain we solve (visibility, hiring, fundraising, distribution).
- Recent post engagement is sub-par for their follower count (we can demonstrably help).
- Has a website / company page (signals real business, real money).
- LinkedIn-active in last 7 days.
- English is primary posting language.

## Negative filters (skip)

- Already advertises ghostwriting / content services themselves.
- Title includes "Influencer", "Creator", "LinkedIn Coach" — they're competitors.
- "Open to work" badge active — they don't have budget right now.
- Posts solely promotional ("BUY MY COURSE!!") — won't trust our taste.

## Channels to source prospects

1. **LinkedIn Sales Navigator** (after first client revenue covers it):
   - Filters: location, job title, follower range, industry, recently posted.
   - Export to CSV → feed `prospect.ts`.
2. **Free LinkedIn Search** (start here):
   - Boolean queries by region + role + industry.
3. **YC / Techstars / Antler / FFFA cohorts** — public pages list founders.
4. **AfricArena, Disrupt Africa, Africa Big Deal newsletter** — names mentioned in coverage.
5. **Twitter/X** — African tech founders cross-post to LinkedIn. Search "based in Lagos" / "Nairobi" + "founder."

## Outreach quotas (LinkedIn-safe limits)

- New connection requests: max **15/day** (LinkedIn's soft cap is ~20).
- Cold DMs to existing connections: max **20/day**.
- Comments on prospects' posts: max **15/day** (engage before pitching).
- Voice notes: max **5/day** (high-conversion but time-intensive).

## Conversion benchmarks (track these)

| Metric | Target |
|---|---|
| Connection acceptance rate | >35% |
| DM reply rate | >8% |
| Reply-to-call conversion | >25% |
| Call-to-close conversion | >30% |
| Net new clients per 100 DMs | 1–2 |

If you're below target on any line for 2 consecutive weeks, the orchestrator has a `/diagnose` mode that A/B-tests the failing step.
