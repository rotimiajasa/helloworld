# Cold DM Template

The orchestrator personalizes this template per prospect. The placeholders in `{{...}}` are filled by Claude after analyzing the prospect's recent posts.

---

## Variant A — "Specific compliment + clean ask" (default, ~9% reply rate)

> Hey {{first_name}} — your post on {{specific_topic_from_recent_post}} stuck with me, especially the part about {{specific_detail}}. Really resonated.
>
> I run a small ghostwriting service for African B2B founders — Claude-augmented, but the voice is yours. I noticed you post {{posting_frequency_observation}}. Would 5 well-written posts a week (in your voice, you approve everything) free up your week without losing your own thinking?
>
> Happy to send a sample written in your voice — no pitch, just to see if the quality bar matches yours. {{open_question}}?

## Variant B — "Pain hook" (use for active posters)

> {{first_name}} — quick one. You posted {{N}} times last month and the {{specific_post}} one hit {{impressions}}+ impressions. The rest averaged {{avg}} — pretty common pattern, the inconsistency kills compounding.
>
> I help founders like you run a 5×/week LinkedIn cadence in their actual voice (we record one interview, then ghostwrite from your transcripts/Loom rants). 2 of my clients went from {{before}} to {{after}} in 8 weeks.
>
> If you're curious: {{calendly_link}} — or just reply "send sample" and I'll write 1 post in your voice as a no-pitch demo.

## Variant C — "Shared context" (use when there's a real connection)

> {{first_name}} — saw we both follow {{mutual_connection_or_topic}} and your {{recent_company_milestone}} caught my eye, congrats.
>
> I run an AI-augmented LinkedIn ghostwriting service for African founders. {{specific_observation_about_their_content}}. If you ever want a second pair of hands on content (cheaper than the alternative — having to write it yourself), I'd love to chat. No pitch — happy to share what 8 weeks of consistent posting did for {{client_example}} as proof.

---

## Rules the orchestrator follows

1. **One specific reference** per DM — drawn from a post in their last 60 days. NEVER generic.
2. **No "hope this finds you well"** or any other LinkedIn-default opener.
3. **No links in first DM** unless asked. Link goes in second message.
4. **Soft ask** — "would you like a sample" beats "want to hop on a call."
5. **Length: 70–120 words.** Anything longer reads like a sales pitch.
6. **End with an open question** when possible — not a closed yes/no.
7. **Lowercase first letter of greeting** (e.g. "hey {{first_name}}") — reads less corporate.

## Voice notes (high-conversion variant)

For top 5 daily prospects, the orchestrator will draft a **30–45 second voice note script** instead. Voice notes have ~3× the reply rate of text DMs because few people send them. You record (1 take, no editing), send.
