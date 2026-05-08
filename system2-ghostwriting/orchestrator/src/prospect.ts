/**
 * Daily prospect outreach batch.
 *
 * Input: prospects/inbox.csv  (export from Sales Nav OR a manual list)
 *        Columns: name,linkedin_url,headline,company,recent_post_url,recent_post_text
 *
 * Output: prospects/outbox/YYYY-MM-DD.md  — DMs ready to copy/send
 *         prospects/sent.csv              — log of who's been DM'd
 *
 * Run:    npm run prospect -- --count 15
 */
import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { client, MODELS, cachedSystem, loadFile, textOf, extractJson, SYSTEM_ROOT } from "./lib/claude.js";

type Prospect = {
  name: string;
  linkedin_url: string;
  headline: string;
  company: string;
  recent_post_url: string;
  recent_post_text: string;
};

const ARG = (k: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

async function main() {
  const cap = Number(ARG("count") ?? process.env.DM_DAILY_CAP ?? 15);
  const inbox = resolve(SYSTEM_ROOT, "prospects/inbox.csv");
  const sentPath = resolve(SYSTEM_ROOT, "prospects/sent.csv");
  const outDir = resolve(SYSTEM_ROOT, "prospects/outbox");
  await mkdir(outDir, { recursive: true });

  if (!existsSync(inbox)) {
    console.error(`Missing ${inbox}. See prospects/README.md.`);
    process.exit(1);
  }

  const csv = await readFile(inbox, "utf8");
  const all: Prospect[] = parse(csv, { columns: true, skip_empty_lines: true });
  const sentSet = await loadSent(sentPath);

  const queue = all.filter((p) => !sentSet.has(p.linkedin_url)).slice(0, cap);
  if (queue.length === 0) {
    console.log("No fresh prospects in inbox. Top up prospects/inbox.csv.");
    return;
  }

  console.log(`[prospect] drafting ${queue.length} DMs…`);
  const [icp, dmTpl, voice] = await Promise.all([
    loadFile("icp.md"),
    loadFile("templates/cold-dm.md"),
    loadFileOrEmpty("voice-samples.md"),
  ]);

  const drafts = await Promise.all(queue.map((p) => draft(p, icp, dmTpl, voice)));

  const date = new Date().toISOString().slice(0, 10);
  const outPath = resolve(outDir, `${date}.md`);
  const md = drafts
    .map(
      (d) => `## ${d.prospect.name} — ${d.prospect.company}\n${d.prospect.linkedin_url}\n\n**Variant**: ${d.variant}\n**Confidence**: ${d.confidence}\n\n> ${d.dm.split("\n").join("\n> ")}\n`,
    )
    .join("\n---\n\n");
  await writeFile(outPath, md);

  // Log as sent (you'll move them out of inbox manually after sending)
  const sentRows = drafts.map((d) => `${d.prospect.linkedin_url},${date},${d.variant}\n`).join("");
  await writeFile(sentPath, (existsSync(sentPath) ? "" : "linkedin_url,date,variant\n") + sentRows, {
    flag: existsSync(sentPath) ? "a" : "w",
  });

  console.log(`[prospect] wrote ${drafts.length} DMs to ${outPath}`);
  console.log(`           review, send manually, then top up prospects/inbox.csv tomorrow.`);
}

async function loadSent(path: string): Promise<Set<string>> {
  if (!existsSync(path)) return new Set();
  const csv = await readFile(path, "utf8");
  const rows = parse(csv, { columns: true, skip_empty_lines: true }) as { linkedin_url: string }[];
  return new Set(rows.map((r) => r.linkedin_url));
}

async function loadFileOrEmpty(rel: string): Promise<string> {
  try {
    return await loadFile(rel);
  } catch {
    return "";
  }
}

type Draft = {
  prospect: Prospect;
  variant: "A" | "B" | "C";
  confidence: number;
  dm: string;
};

async function draft(
  p: Prospect,
  icp: string,
  dmTpl: string,
  voice: string,
): Promise<Draft> {
  const system = `You are an expert outbound copywriter. Write ONE personalized cold DM following the rules in the template. Pick the variant that fits best.

ICP doc:
${icp}

DM template & rules:
${dmTpl}

${voice ? `Sender voice samples (match this tone):\n${voice}\n` : ""}`;

  const user = `Prospect:
- Name: ${p.name}
- Headline: ${p.headline}
- Company: ${p.company}
- Recent post URL: ${p.recent_post_url}
- Recent post text:
"""
${p.recent_post_text}
"""

Return strict JSON:
{ "variant": "A"|"B"|"C", "confidence": 0-100, "dm": "the message text, 70-120 words" }`;

  const r = await client().messages.create({
    model: MODELS.fast,
    max_tokens: 1024,
    system: cachedSystem(system),
    messages: [{ role: "user", content: user }],
  });
  const json = extractJson<{ variant: "A" | "B" | "C"; confidence: number; dm: string }>(textOf(r));
  return { prospect: p, ...json };
}

main().catch((e) => {
  console.error("[prospect] failed:", e);
  process.exit(1);
});
