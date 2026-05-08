---
name: tweet-thread
description: 5–8 tweet thread that teases an article on Twitter/X.
---

# Tweet Thread

## Format

- Tweet 1 (the hook, ≤ 270 chars): a counterintuitive claim, a real ₦ number, or "I withdrew my first $X from Y — here's exactly how".
- Tweets 2–N: bite-sized value. ONE idea per tweet. Use line breaks. No threadboi emoji ladders (1/, 2/, 3/).
- Final tweet: link to the article + soft CTA ("If this was useful, the full breakdown is here: {{url}}").

## Rules

- Plain language. No "🚀 Mind-blown 🤯".
- Specifics > generalities. "Geegpay charges 1.5%" beats "fintechs have fees".
- One genuine personal sentence required (you'll fill this in during human pass — leave a [YOUR-STORY] placeholder).
- No more than ONE link in the entire thread (last tweet only — Twitter penalizes external links earlier in the thread).
- Don't tag accounts unless directly relevant.

## Output format

Return tweets separated by `---` so the scheduler can split them:

```
Tweet 1 text…
---
Tweet 2 text…
---
…
```
