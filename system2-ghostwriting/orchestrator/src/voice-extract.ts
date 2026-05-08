/**
 * Ingests a client's onboarding interview transcript + voice samples and
 * produces a per-client style guide, story bank, and opinions list.
 *
 * Run: npm run voice-extract -- --client <slug>
 *
 * Inputs:  clients/<slug>/interview.md   (raw transcript, mandatory)
 *          clients/<slug>/voice-samples.md  (optional extra writing samples)
 *          clients/<slug>/brief.md       (ICP/goals/taboo, optional)
 *
 * Outputs: clients/<slug>/style-guide.md
 *          clients/<slug>/story-bank.md
 *          clients/<slug>/opinions.md
 */
import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { client, MODELS, cachedSystem, textOf, SYSTEM_ROOT } from "./lib/claude.js";

const ARG = (k: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

async function main() {
  const slug = ARG("client");
  if (!slug) {
    console.error("Usage: npm run voice-extract -- --client <slug>");
    process.exit(1);
  }
  const dir = resolve(SYSTEM_ROOT, "clients", slug);
  if (!existsSync(dir)) {
    console.error(`Client folder not found: ${dir}`);
    process.exit(1);
  }
  await mkdir(dir, { recursive: true });

  const interview = await readOpt(resolve(dir, "interview.md"));
  if (!interview) {
    console.error(`Need clients/${slug}/interview.md (the transcript). See templates/voice-interview-questions.md.`);
    process.exit(1);
  }
  const voice = await readOpt(resolve(dir, "voice-samples.md"));
  const brief = await readOpt(resolve(dir, "brief.md"));

  const ctx = `INTERVIEW TRANSCRIPT:
${interview}

${voice ? `EXISTING VOICE SAMPLES:\n${voice}\n` : ""}
${brief ? `CLIENT BRIEF:\n${brief}\n` : ""}`;

  console.log(`[voice-extract] generating style-guide.md, story-bank.md, opinions.md…`);
  const [styleGuide, stories, opinions] = await Promise.all([
    one(
      "style-guide",
      `Produce a per-client STYLE GUIDE in markdown. Sections:
- Tone & cadence (3-6 specific rules)
- Sentence structure (typical length, rhythm patterns from their actual speech)
- Vocabulary they use often (10-20 words/phrases)
- Vocabulary they NEVER use (banned words)
- Pet peeves / hot buttons
- Self-deprecation? Humor? How political? How personal?
- Taboo topics (from brief or interview)
- Posting cadence rules (weekday vs weekend, times)
- Voice anti-patterns (whose style they DON'T want to sound like)

Be specific. Quote them where possible. This file is the single source of truth for every post Claude writes for them.`,
      ctx,
    ),
    one(
      "story-bank",
      `Extract every concrete STORY they told in the interview. For each:
- Title (10-12 words)
- One-sentence summary
- The full story in 3-6 sentences (rephrased in markdown but FAITHFUL to facts)
- 2-3 thematic tags
- Possible angles for posts (3 ideas)

Aim for 8-15 stories. Stories are the most valuable raw material — they convert 5x better than opinion posts. Format as markdown with H2 per story.`,
      ctx,
    ),
    one(
      "opinions",
      `Extract every contrarian or sharp OPINION they expressed. For each:
- The opinion in their words (quote if possible)
- The conventional view they're rejecting
- Why this opinion is post-worthy (likely engagement)
- Risk level (1=safe, 5=could anger people they care about)

Aim for 8-15 opinions. Format as markdown with H2 per opinion.`,
      ctx,
    ),
  ]);

  await writeFile(resolve(dir, "style-guide.md"), styleGuide);
  await writeFile(resolve(dir, "story-bank.md"), stories);
  await writeFile(resolve(dir, "opinions.md"), opinions);
  console.log(`[voice-extract] done. Review files in clients/${slug}/`);
}

async function readOpt(p: string): Promise<string | null> {
  return existsSync(p) ? readFile(p, "utf8") : null;
}

async function one(label: string, instruction: string, ctx: string): Promise<string> {
  const r = await client().messages.create({
    model: MODELS.smart,
    max_tokens: 8192,
    system: cachedSystem(
      "You are a senior ghostwriter analyzing a recorded onboarding interview to extract material for a new client. Be specific, quote actual phrases, never invent. If something is missing or unclear, say so explicitly with a [TODO: ask client] marker.",
    ),
    messages: [{ role: "user", content: `${instruction}\n\n${ctx}` }],
  });
  return textOf(r);
}

main().catch((e) => {
  console.error("[voice-extract] failed:", e);
  process.exit(1);
});
