import { client, MODELS, cachedSystem, styleGuide } from "../lib/claude.js";
import { serp, fetchPageText } from "../lib/serp.js";
import type { ResearchedTopic } from "./keyword-research.js";

export type CompetitorBrief = {
  topic: ResearchedTopic;
  outline: string;
  gapsToExploit: string[];
  realDataPoints: string[];
};

/**
 * For each topic: scrape top-10 SERP, extract structure & gaps, return a
 * brief Claude can use to write a clearly better article.
 */
export async function analyzeCompetitors(
  topics: ResearchedTopic[],
): Promise<CompetitorBrief[]> {
  const sg = await styleGuide();
  return Promise.all(topics.map((t) => one(t, sg)));
}

async function one(topic: ResearchedTopic, sg: string): Promise<CompetitorBrief> {
  const results = await serp(topic.primaryKeyword, 10);
  const pages = await Promise.all(
    results.slice(0, 6).map(async (r) => ({
      url: r.url,
      title: r.title,
      text: await fetchPageText(r.url),
    })),
  );

  const prompt = `Topic: "${topic.title}"
Primary keyword: "${topic.primaryKeyword}"

I scraped the top SERP results (truncated to 8k chars each). Produce a brief that
will let me write an article that DEMONSTRABLY beats them. Return JSON only:

{
  "outline": "H2/H3 markdown outline, 8-15 sections",
  "gapsToExploit": ["specific gap 1", "..."],
  "realDataPoints": ["specific number/fact to include with source URL", "..."]
}

Competitors:
${pages.map((p, i) => `--- Result ${i + 1}: ${p.title} (${p.url}) ---\n${p.text}`).join("\n\n")}`;

  const r = await client().messages.create({
    model: MODELS.research,
    max_tokens: 4096,
    system: cachedSystem(sg),
    messages: [{ role: "user", content: prompt }],
  });

  const text = r.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

  return {
    topic,
    outline: json.outline ?? "",
    gapsToExploit: json.gapsToExploit ?? [],
    realDataPoints: json.realDataPoints ?? [],
  };
}
