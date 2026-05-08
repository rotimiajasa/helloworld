# 60-Day Playbook

The exact day-by-day plan to hit ≥$500 MRR by end of week 8.

---

## Pre-flight (1 weekend, 4–6 hours total)

### 1. Set up money rails
- [ ] Open **Wise Business** account (accepts USD ACH/wire). 1 hr.
- [ ] Open **Payoneer** as backup. 30 min.
- [ ] (Optional, can defer to month 2) **Stripe Atlas** US LLC — $500, unlocks Stripe Checkout.

### 2. Build proof
You don't have client portfolio yet, so you ARE the first portfolio.

- [ ] Pick a niche angle (e.g. "I help African B2B founders turn LinkedIn into a pipeline").
- [ ] Run the orchestrator on YOUR own LinkedIn for 7 days — produce 5 strong posts and post them. **This is your portfolio.**
- [ ] Capture screenshots of impressions/comments — you'll send these in DMs.

### 3. Sales infrastructure
- [ ] **Calendly**: 30-min "Discovery Call" link.
- [ ] **Notion or Google Doc** "Service Page": 1-page sell sheet (use `templates/proposal.md` as base).
- [ ] **Stripe Payment Link** (or Wise invoice template) for $299/$499/$899.
- [ ] **Loom** screen-recorder installed for sending personalized 60-second pitches.
- [ ] LinkedIn profile updated: headline says what you do for whom. Banner shows the offer. Featured section pinned with 3 sample posts.

### 4. Build prospect list
- [ ] Use `orchestrator/src/prospect.ts` with Sales Navigator export (or LinkedIn search) to build a list of **200 ICP-fit prospects**. See [`icp.md`](./icp.md).

---

## Week 1: Outbound machine

**Goal**: 100 personalized DMs sent, 5–8 conversations started, 1–2 calls booked.

| Day | What you do (≤1 hr) | What Claude does |
|---|---|---|
| Mon | Approve 20 DM drafts; send. Post your own LinkedIn content. | Generates 20 personalized DMs from prospect list |
| Tue | Send 20 DMs. Reply to any responses. | Drafts 20 fresh DMs + reply suggestions |
| Wed | Send 20 DMs. Engage with prospects' posts (genuine comments). | Drafts comments on their recent posts |
| Thu | Send 20 DMs. 1 discovery call if booked. | DMs + call prep brief |
| Fri | Send 20 DMs. Review week. | DMs + weekly summary |

End-of-week target: 100 DMs out, 8% reply rate (~8 convos), 2 calls booked.

---

## Week 2: First close

**Goal**: Close your first client.

| Day | Activity | Tool |
|---|---|---|
| Mon | Run 2 discovery calls. Send proposals same-day. | `templates/proposal.md` |
| Tue–Thu | Continue outbound (20 DMs/day). Follow up on proposals. | `templates/followup-1.md` |
| Fri | Sign contract, send invoice. Schedule onboarding interview for next week. | Stripe Payment Link |

**If no close by Fri of week 2**: drop price by $100 for first month as a "founding client" rate. This converts 3–4× better and you'll raise to standard on month 4.

---

## Week 3: Onboard + deliver client #1

| Day | Activity |
|---|---|
| Mon | 60-min recorded onboarding interview (use `templates/voice-interview-questions.md`). |
| Tue | Run `voice-extract.ts` on the transcript → generates `clients/<slug>/style-guide.md`. Review. |
| Wed | Run `client-week.ts` → 4 posts. Edit. Send to client for approval (15 min). |
| Thu | Schedule approved posts in Buffer/Typefully for next week. Continue outbound. |
| Fri | Outbound + 1 sales call from week 1's pipeline. |

By Friday: client has 4 posts scheduled, you have 1–2 active proposals.

---

## Week 4: Steady state begins

- 30 min/day on outbound (15 DMs/day).
- 30 min/day on client work (1 client × 4 posts/week).
- 1 sales call/week.

**Goal**: Close client #2 by end of week 6.

---

## Week 5–6: Second client

Same outbound rhythm. Drop "founding client rate" — by now you have ROI screenshots from client #1 to share, which justifies full price.

When client #2 signs:
- Onboarding interview week 6.
- First posts delivered week 7.
- **MRR by end of week 7: ~$598.**

---

## Week 7–8: Compounding

- 1 hr/day budget now feels comfortable across 2 clients.
- Spare time → upsell client #1 from Starter ($299) → Pro ($499) by offering 1 free monthly newsletter as a trial.
- Continue outbound at lower volume (10 DMs/day).

---

## Day-in-the-life (steady state, 2 clients)

```
07:30  ☕  Coffee. Open this repo.
07:35  🤖  Run `prospect.ts` → 10 fresh DMs. Skim, edit, queue.
07:50  ✉️   Send DMs from yesterday's queue (manually, looks human).
08:00  📥  Reply triage: Claude's drafts → approve/send (10 min).
08:10  📝  Run `client-week.ts` for whichever client is up today (per schedule).
       Edit drafts (15 min), send to client for approval.
08:25  ✅  Approve any client-side edits, schedule posts.
08:30  🛑  Done.
```

Once-a-week:
- 30-min sales call.
- 15-min check-in DM with each client.

Once-a-month:
- Run `monthly-report.ts` for each client.
- Send invoices.
- Re-run `voice-extract.ts` if a client's voice has shifted.

---

## When to hire VA (~month 4 at 4+ clients)

A Filipino or Nigerian VA at $300–500/mo can take over:
- Manual DM sending
- Post scheduling
- Reply pasting

This frees you to focus on sales calls + 5–10 client roster scaling.
