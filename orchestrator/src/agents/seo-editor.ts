import { client, MODELS, cachedSystem, styleGuide, affiliates } from "../lib/claude.js";
import type { DraftedArticle } from "./article-writer.js";
import { loadState } from "../lib/state.js";

export async function editForSeo(drafts: DraftedArticle[]): Promise<DraftedArticle[]> {
  const sg = await styleGuide();
  const state = await loadState();
  const aff = await affiliates();
  const internalLinkPool = state.covered.map((c) => ({
    slug: c.slug,
    title: c.title,
    keyword: c.primaryKeyword,
  }));

  return Promise.all(drafts.map((d) => editOne(d, sg, internalLinkPool, aff)));
}

async function editOne(
  d: DraftedArticle,
  sg: string,
  internalLinks: { slug: string; title: string; keyword: string }[],
  aff: Record<string, any>,
): Promise<DraftedArticle> {
  const prompt = `You are the SEO editor. Improve this article for:
1. Add an FAQPage JSON-LD block at the end (HTML <script> in markdown is fine).
2. Insert at least 3 internal links from the pool below (only if contextually relevant).
3. Insert affiliate links from the catalog where they fit naturally; never in the first 200 words; max 3 distinct affiliates per post.
4. Add alt text to any image syntax.
5. Tighten meta description to <= 155 chars.

Return STRICT format:
---FRONTMATTER---
description: "..."
---BODY---
<edited markdown>

Internal link pool (slug -> title):
${internalLinks.map((l) => `/posts/${l.slug} -> ${l.title}`).join("\n") || "(none yet)"}

Affiliate catalog:
${JSON.stringify(aff, null, 2)}

Original article:
${d.markdown}`;

  const r = await client().messages.create({
    model: MODELS.editor,
    max_tokens: 8192,
    system: cachedSystem(sg),
    messages: [{ role: "user", content: prompt }],
  });

  const text = r.content.map((x) => (x.type === "text" ? x.text : "")).join("");
  const m = text.match(/---FRONTMATTER---\s*([\s\S]*?)---BODY---\s*([\s\S]*)$/);
  if (!m) return d;

  const descMatch = m[1].match(/description:\s*"(.+?)"/);
  return {
    ...d,
    description: descMatch?.[1] ?? d.description,
    markdown: m[2].trim(),
  };
}
