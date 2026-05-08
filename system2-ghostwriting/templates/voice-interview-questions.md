# Voice Interview Questions (60 minutes, recorded)

The single most important client interaction. We use the transcript to extract their voice, beliefs, pet peeves, and stories.

**Setup**: Zoom or Loom, recording on. Tell client this is the only structured call we'll do — after this, we work async.

## Round 1 — Identity (8 min)

1. In one sentence, what do you do, and who hires you?
2. Walk me through a typical week — what takes up most of your time?
3. What's a belief you hold about your industry that most people disagree with?
4. What did you do before this? Why did you switch?

## Round 2 — Beliefs & opinions (12 min)

5. What's the most common piece of advice in your space that you think is dead wrong?
6. Tell me about a time you were proven wrong publicly. What did you learn?
7. Who in your industry do you genuinely admire? Why specifically?
8. Who do you think is overrated? (You don't have to name names — describe the type.)
9. What's a hill you'd die on, professionally?

## Round 3 — Stories (15 min)

10. Tell me about your hardest day in the last 12 months. What happened, what did you do?
11. Tell me about a time you closed a deal/hire/customer that everyone else lost.
12. What's a moment when you nearly quit? What kept you going?
13. Tell me about a customer/user who changed how you think about the product.

These stories become 60% of the year's content. Posts written from real stories convert 5× better than opinion posts.

## Round 4 — Audience (8 min)

14. Who's the perfect person to read your LinkedIn?
15. What do they wish they could ask you privately, but won't, because it'd reveal they don't know?
16. What advice do you keep giving the same person, over and over?

## Round 5 — Voice mechanics (10 min)

17. Read me one of your old posts you're proud of. Then say it out loud, in your own words, like you're explaining it to a friend at a bar.
18. What words do you absolutely never use? (Listen for: "leverage", "synergy", "rockstar", "guru", etc.)
19. Are you OK with humor? Self-deprecation? Strong opinions?
20. How religious / political / personal can we go?

## Round 6 — Logistics (5 min)

21. How quickly do you typically check Slack/email? (Sets approval cadence.)
22. Any upcoming events, launches, or milestones I should hear about?
23. Anything I'm missing that I should ask?

## Post-interview (Claude does this)

`voice-extract.ts` ingests the transcript and produces:
- `clients/<slug>/style-guide.md` — voice rules, vocabulary, taboo list.
- `clients/<slug>/story-bank.md` — extracted stories, tagged by theme. This becomes the well we draw from for 6+ months of content.
- `clients/<slug>/opinions.md` — the contrarian takes that become high-engagement posts.
