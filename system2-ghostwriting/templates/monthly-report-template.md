# Monthly Report — {{client_name}}, {{month}}

Sent on the 1st of each month. `monthly-report.ts` generates this from LinkedIn export + delivery log. You skim/edit (5 min) and send.

---

Hey {{first_name}} —

Quick read on the month.

## The numbers

| Metric | This month | Last month | Change |
|---|---:|---:|---:|
| Posts published | {{n_posts}} | {{prev_n}} | {{diff}} |
| Total impressions | {{impressions}} | {{prev_impressions}} | {{pct_change}} |
| Total reactions | {{reactions}} | {{prev_reactions}} | {{pct_change}} |
| Total comments | {{comments}} | {{prev_comments}} | {{pct_change}} |
| New followers | {{followers}} | {{prev_followers}} | — |
| Profile views | {{profile_views}} | {{prev_pv}} | {{pct_change}} |
| Inbound DMs (relevant) | {{dms}} | {{prev_dms}} | — |

## Top 3 posts

1. **{{top_post_1_title}}** — {{post_1_impressions}} impressions, {{post_1_comments}} comments. *Why it worked: {{my_take_1}}.*
2. **{{top_post_2_title}}** — {{post_2_impressions}} impressions. *{{my_take_2}}.*
3. **{{top_post_3_title}}** — {{post_3_impressions}} impressions. *{{my_take_3}}.*

## What flopped (and why)

{{lowest_performing_post_title}} — {{flop_impressions}} impressions. My honest read: {{flop_diagnosis}}. Fix for next month: {{fix}}.

## What I'd do next month

Three bets, ranked:

1. **{{bet_1}}** — based on {{evidence_from_data}}.
2. **{{bet_2}}**.
3. **{{bet_3}}**.

If you disagree with any of these, hit reply and we'll reshape. Otherwise I'll proceed.

## Anything you noticed I should know?

(Genuine ask. The best signals come from your inbox, not LinkedIn analytics.)

— {{your_name}}

---

## Internal notes (NOT sent to client)

The orchestrator also generates these for you:
- Cost-per-post (API spend / posts delivered) — track for margin.
- Hours spent on this client this month — track for scope creep.
- Renewal risk score (1–5) based on engagement, response speed, payment promptness.
- Upsell signal: if client engagement is up >50%, propose Pro tier upgrade in next month's report.
