import { client, MODELS, cachedSystem, styleGuide, affiliates } from "../lib/claude.js";
import type { CompetitorBrief } from "./competitor-analysis.js";

export type DraftedArticle = {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  markdown: string;
  frontmatterExtras: Record<string, unknown>;
};

const TYPE_TO_SKILL: Record<string, string> = {
  pillar: "pillar-post",
  comparison: "comparison-post",
  "how-to": "how-to-post",
  listicle: "pillar-post",
  review: "comparison-post",
  news: "pillar-post",
};

export async function draftArticles(
  briefs: CompetitorBrief[],
): Promise<DraftedArticle[]> {
  const sg = await styleGuide();
  return Promise.all(briefs.map((b) => draftOne(b, sg)));
}

async function draftOne(b: CompetitorBrief, sg: string): Promise<DraftedArticle> {
  const aff = await affiliates();
  const skill = TYPE_TO_SKILL[b.topic.type] ?? "pillar-post";

  const affiliateHint =
    b.topic.affiliate && aff[b.topic.affiliate]
      ? `Primary affiliate to mention naturally (NOT in first 200 words): ${JSON.stringify(aff[b.topic.affiliate])}`
      : "No specific affiliate for this post.";

  const prompt = `Write a complete article using the "${skill}" skill conventions.

TITLE: ${b.topic.title}
PRIMARY KEYWORD: ${b.topic.primaryKeyword}
SECONDARY KEYWORDS: ${b.topic.secondaryKeywords.join(", ")}
INTENT: ${b.topic.intent}

OUTLINE TO FOLLOW (you may improve it):
${b.outline}

GAPS TO EXPLOIT VS. COMPETITORS:
${b.gapsToExploit.map((g) => "- " + g).join("\n")}

REAL DATA POINTS TO WEAVE IN (with sources):
${b.realDataPoints.map((p) => "- " + p).join("\n")}

${affiliateHint}

Output STRICT format:
---FRONTMATTER---
title: "..."
description: "...max 155 chars..."
primaryKeyword: "..."
secondaryKeywords: ["...", "..."]
publishedAt: "${new Date().toISOString().slice(0, 10)}"
type: "${b.topic.type}"
draft: true
needsHumanCommentary: true
---BODY---
<the full markdown article, 1200-2000 words, leaving 2-3 [YOUR-STORY] placeholders>`;

  const r = await client().messages.create({
    model: MODELS.writer,
    max_tokens: 8192,
    system: cachedSystem(sg),
    messages: [{ role: "user", content: prompt }],
  });

  const text = r.content.map((x) => (x.type === "text" ? x.text : "")).join("");
  const fmMatch = text.match(/---FRONTMATTER---\s*([\s\S]*?)---BODY---\s*([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error(`Writer returned malformed output for ${b.topic.slug}`);
  }
  const frontmatterText = fmMatch[1].trim();
  const body = fmMatch[2].trim();

  const parsedFm = parseSimpleYaml(frontmatterText);
  return {
    slug: b.topic.slug,
    title: String(parsedFm.title ?? b.topic.title),
    description: String(parsedFm.description ?? ""),
    primaryKeyword: String(parsedFm.primaryKeyword ?? b.topic.primaryKeyword),
    markdown: body,
    frontmatterExtras: parsedFm,
  };
}

function parseSimpleYaml(s: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const line of s.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_]+)\s*:\s*(.+)$/);
    if (!m) continue;
    const k = m[1];
    let v: any = m[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v
        .slice(1, -1)
        .split(",")
        .map((x: string) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (/^["'].*["']$/.test(v)) {
      v = v.slice(1, -1);
    } else if (v === "true" || v === "false") {
      v = v === "true";
    }
    out[k] = v;
  }
  return out;
}
