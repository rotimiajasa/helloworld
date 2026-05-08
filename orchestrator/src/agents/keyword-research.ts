import { client, MODELS, cachedSystem, styleGuide } from "../lib/claude.js";
import { serp } from "../lib/serp.js";
import { loadBacklog, BacklogTopic } from "../lib/backlog.js";
import { loadState, isCovered } from "../lib/state.js";

export type ResearchedTopic = BacklogTopic & {
  primaryKeyword: string;
  secondaryKeywords: string[];
  serpTitles: string[];
  rationale: string;
};

/**
 * Picks N topics from the backlog that are (a) not already covered
 * and (b) score highest on Claude's judgement of low-competition + high-intent.
 */
export async function researchTopics(n: number): Promise<ResearchedTopic[]> {
  const [backlog, state, sg] = await Promise.all([loadBacklog(), loadState(), styleGuide()]);
  const candidates = backlog.filter((b) => !isCovered(state, b.slug)).slice(0, 30);
  if (candidates.length === 0) {
    throw new Error("Backlog exhausted — add more topics to topics-backlog.md");
  }

  // Pull SERP data for the first 15 to give Claude something concrete to score on.
  const serpData = await Promise.all(
    candidates.slice(0, 15).map(async (c) => ({
      slug: c.slug,
      results: await serp(c.title, 5),
    })),
  );

  const prompt = `You are picking the ${n} best articles to write THIS WEEK from a backlog.

Score each candidate on:
- Search intent strength (commercial > informational > navigational)
- Competition softness (thin/spammy SERP results = good for us)
- Affiliate revenue potential
- Naira-relevance (must specifically help Nigerian readers earn USD)

Return JSON only, no prose:
{ "picks": [
  { "slug": "...", "primaryKeyword": "...", "secondaryKeywords": ["..."], "rationale": "..." }
] }

Backlog candidates (with SERP samples):
${JSON.stringify(
  candidates.map((c) => ({
    ...c,
    serp: serpData.find((s) => s.slug === c.slug)?.results.slice(0, 5) ?? [],
  })),
  null,
  2,
)}`;

  const r = await client().messages.create({
    model: MODELS.research,
    max_tokens: 4096,
    system: cachedSystem(sg),
    messages: [{ role: "user", content: prompt }],
  });

  const text = r.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
  const picks = (json.picks ?? []).slice(0, n);

  return picks.map((p: any) => {
    const c = candidates.find((x) => x.slug === p.slug)!;
    return {
      ...c,
      primaryKeyword: p.primaryKeyword,
      secondaryKeywords: p.secondaryKeywords ?? [],
      serpTitles:
        serpData.find((s) => s.slug === p.slug)?.results.map((r) => r.title) ?? [],
      rationale: p.rationale,
    };
  });
}
