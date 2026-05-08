import { client, MODELS, cachedSystem, styleGuide } from "../lib/claude.js";
import type { DraftedArticle } from "./article-writer.js";

export type RepurposedBatch = {
  newsletter: string;
  tweetThreads: string[];
  linkedinPost: string;
};

export async function repurpose(
  drafts: DraftedArticle[],
  siteUrl: string,
): Promise<RepurposedBatch> {
  const sg = await styleGuide();
  const summaries = drafts.map((d) => ({
    slug: d.slug,
    title: d.title,
    description: d.description,
    excerpt: d.markdown.slice(0, 1500),
    url: `${siteUrl}/posts/${d.slug}`,
  }));

  const [newsletter, threads, linkedin] = await Promise.all([
    one(
      sg,
      `Write a 400-600 word email newsletter that covers all ${drafts.length} new articles. Friendly, no hype. End with a short CTA to forward to a friend who's looking for USD income. Use plain text, no HTML. Include the URLs.

Articles:
${JSON.stringify(summaries, null, 2)}`,
    ),
    Promise.all(
      summaries.map((s) =>
        one(
          sg,
          `Write a Twitter/X thread (5-8 tweets, each <= 270 chars) that teases this article without giving everything away. Last tweet links to: ${s.url}.

Article:
${JSON.stringify(s, null, 2)}`,
        ),
      ),
    ),
    one(
      sg,
      `Write ONE LinkedIn post (180-220 words) framing the most interesting insight across all ${drafts.length} articles for a Nigerian professional audience. End with a soft CTA.

Articles:
${JSON.stringify(summaries, null, 2)}`,
    ),
  ]);

  return { newsletter, tweetThreads: threads, linkedinPost: linkedin };
}

async function one(sg: string, prompt: string): Promise<string> {
  const r = await client().messages.create({
    model: MODELS.editor,
    max_tokens: 2048,
    system: cachedSystem(sg),
    messages: [{ role: "user", content: prompt }],
  });
  return r.content.map((x) => (x.type === "text" ? x.text : "")).join("");
}
