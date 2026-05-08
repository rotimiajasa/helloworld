/**
 * Generates the next week's posts for ONE client.
 *
 * Run: npm run client-week -- --client <slug> --posts 4
 *
 * Inputs:  clients/<slug>/{style-guide.md, story-bank.md, opinions.md, brief.md}
 *          clients/<slug>/posted.md   (running log of what's gone live)
 *
 * Outputs: clients/<slug>/posts/YYYY-WW/draft-N.md  (one file per post)
 *          clients/<slug>/posts/YYYY-WW/index.md   (overview to send client)
 */
import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { client, MODELS, cachedSystem, textOf, extractJson, SYSTEM_ROOT } from "./lib/claude.js";

const ARG = (k: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

async function main() {
  const slug = ARG("client");
  const n = Number(ARG("posts") ?? 4);
  if (!slug) {
    console.error("Usage: npm run client-week -- --client <slug> --posts 4");
    process.exit(1);
  }

  const dir = resolve(SYSTEM_ROOT, "clients", slug);
  const styleGuide = await readOpt(resolve(dir, "style-guide.md"));
  if (!styleGuide) {
    console.error(`Run voice-extract first: npm run voice-extract -- --client ${slug}`);
    process.exit(1);
  }
  const [stories, opinions, brief, posted] = await Promise.all([
    readOpt(resolve(dir, "story-bank.md")),
    readOpt(resolve(dir, "opinions.md")),
    readOpt(resolve(dir, "brief.md")),
    readOpt(resolve(dir, "posted.md")),
  ]);

  const week = isoWeek();
  const wkDir = resolve(dir, "posts", week);
  await mkdir(wkDir, { recursive: true });

  console.log(`[client-week] planning ${n} posts for ${slug} (${week})…`);

  // 1. Plan: pick angles, types, and order — diversifying across formats.
  const plan = await planWeek(n, { styleGuide, stories, opinions, brief, posted });

  // 2. Write all posts in parallel with best-of-3 strategy.
  console.log(`[client-week] drafting ${plan.length} posts (best-of-3 each)…`);
  const drafts = await Promise.all(
    plan.map((item, i) => writeBestOfThree(item, i + 1, { styleGuide, stories, opinions })),
  );

  // 3. Write files
  for (let i = 0; i < drafts.length; i++) {
    await writeFile(resolve(wkDir, `draft-${i + 1}.md`), drafts[i].markdown);
  }

  const indexMd = `# Week ${week} drafts — ${slug}

Approve, reject, or edit each. Reply to this with which numbers to publish (e.g., "1, 3, 4 — edit 4: change opener").

${drafts
  .map(
    (d, i) =>
      `## Draft ${i + 1}: ${d.angle}

**Type**: ${d.type}  ·  **Hook**: ${d.hook}

\`\`\`
${d.markdown}
\`\`\`

_Why this should work_: ${d.rationale}

---
`,
  )
  .join("\n")}
`;
  await writeFile(resolve(wkDir, "index.md"), indexMd);

  console.log(`[client-week] done. ${drafts.length} drafts in clients/${slug}/posts/${week}/`);
}

type PlanItem = { angle: string; type: string; sourceTag: string };

async function planWeek(
  n: number,
  ctx: { styleGuide: string; stories: string | null; opinions: string | null; brief: string | null; posted: string | null },
): Promise<PlanItem[]> {
  const r = await client().messages.create({
    model: MODELS.fast,
    max_tokens: 2048,
    system: cachedSystem(
      `You plan weekly LinkedIn content for a single client. Diversify post types so the week feels varied.
Style guide:\n${ctx.styleGuide}`,
    ),
    messages: [
      {
        role: "user",
        content: `Pick ${n} angles for this week. Distribution rule: across ${n} posts, roughly:
- 1-2 STORY posts (from story-bank)
- 1 OPINION post (from opinions, prefer risk 1-3)
- 1 LIST/HOW-TO post (practical value)
- 0-1 ASK post (question to drive comments)

Don't repeat anything in posted log.

STORY BANK:
${ctx.stories ?? "(none — flag this)"}

OPINIONS:
${ctx.opinions ?? "(none — flag this)"}

BRIEF:
${ctx.brief ?? ""}

ALREADY POSTED:
${ctx.posted ?? "(nothing yet)"}

Return JSON only: { "items": [ { "angle": "string ≤ 90 chars", "type": "story|opinion|list|how-to|ask", "sourceTag": "story title or opinion or n/a" } ] }`,
      },
    ],
  });
  const json = extractJson<{ items: PlanItem[] }>(textOf(r));
  return json.items.slice(0, n);
}

type Draft = { angle: string; type: string; hook: string; markdown: string; rationale: string };

async function writeBestOfThree(
  item: PlanItem,
  idx: number,
  ctx: { styleGuide: string; stories: string | null; opinions: string | null },
): Promise<Draft> {
  const system = `You are an expert LinkedIn ghostwriter. Write in the client's voice exactly.

CLIENT STYLE GUIDE:
${ctx.styleGuide}

STORY BANK (use as raw material if angle is a story):
${ctx.stories ?? "(empty)"}

OPINIONS (use as raw material if angle is an opinion):
${ctx.opinions ?? "(empty)"}

LinkedIn post rules:
- 1100-1300 characters preferred (sweet spot for reach).
- Hook is the FIRST 2 lines — must stop scroll. No "Just had an interesting thought…"
- Whitespace between every 1-2 sentences.
- One idea per post.
- End with a soft question or open hook to drive comments (NOT "thoughts?").
- No hashtags or 1-2 max.
- No emojis unless the style guide allows them.`;

  const user = `Write 3 distinct drafts for this angle, then pick the best.

ANGLE: ${item.angle}
TYPE: ${item.type}
SOURCE TAG: ${item.sourceTag}

Return strict JSON:
{
  "drafts": [ { "hook": "...", "markdown": "..." }, { ... }, { ... } ],
  "best_index": 0|1|2,
  "rationale": "one sentence on why this draft beats the other two"
}`;

  const r = await client().messages.create({
    model: MODELS.smart,
    max_tokens: 4096,
    system: cachedSystem(system),
    messages: [{ role: "user", content: user }],
  });
  const j = extractJson<{ drafts: { hook: string; markdown: string }[]; best_index: number; rationale: string }>(textOf(r));
  const best = j.drafts[j.best_index] ?? j.drafts[0];
  return {
    angle: item.angle,
    type: item.type,
    hook: best.hook,
    markdown: best.markdown,
    rationale: j.rationale,
  };
}

async function readOpt(p: string): Promise<string | null> {
  return existsSync(p) ? readFile(p, "utf8") : null;
}

function isoWeek(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

main().catch((e) => {
  console.error("[client-week] failed:", e);
  process.exit(1);
});
