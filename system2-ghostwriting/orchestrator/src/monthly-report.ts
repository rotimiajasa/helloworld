/**
 * Generates the monthly client report from a metrics CSV.
 *
 * Input: clients/<slug>/metrics/YYYY-MM.csv
 *        Columns: date,post_title,impressions,reactions,comments,shares,profile_views_after
 * Optional: clients/<slug>/metrics/YYYY-MM.notes.md  (any context to include)
 *
 * Output: clients/<slug>/reports/YYYY-MM.md
 *
 * Run: npm run monthly-report -- --client <slug> --month 2026-05
 */
import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { client, MODELS, cachedSystem, textOf, SYSTEM_ROOT } from "./lib/claude.js";

const ARG = (k: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

type Row = {
  date: string;
  post_title: string;
  impressions: string;
  reactions: string;
  comments: string;
  shares: string;
  profile_views_after: string;
};

async function main() {
  const slug = ARG("client");
  const month = ARG("month") ?? new Date().toISOString().slice(0, 7);
  if (!slug) {
    console.error("Usage: npm run monthly-report -- --client <slug> --month YYYY-MM");
    process.exit(1);
  }

  const dir = resolve(SYSTEM_ROOT, "clients", slug);
  const csvPath = resolve(dir, "metrics", `${month}.csv`);
  if (!existsSync(csvPath)) {
    console.error(`Missing ${csvPath}`);
    process.exit(1);
  }
  const csv = await readFile(csvPath, "utf8");
  const rows: Row[] = parse(csv, { columns: true, skip_empty_lines: true });
  const notes = (await readOpt(resolve(dir, "metrics", `${month}.notes.md`))) ?? "";
  const tplPath = resolve(SYSTEM_ROOT, "templates/monthly-report-template.md");
  const tpl = await readFile(tplPath, "utf8");

  const summary = summarize(rows);
  const prevMonth = prevYM(month);
  const prevPath = resolve(dir, "metrics", `${prevMonth}.csv`);
  const prevSummary = existsSync(prevPath)
    ? summarize(parse(await readFile(prevPath, "utf8"), { columns: true, skip_empty_lines: true }) as Row[])
    : null;

  const r = await client().messages.create({
    model: MODELS.fast,
    max_tokens: 4096,
    system: cachedSystem(
      `Generate a client-facing monthly LinkedIn performance report by filling in the template. Be honest, specific, and forward-looking. Don't sugar-coat flops; the client respects honesty more than numbers theater.`,
    ),
    messages: [
      {
        role: "user",
        content: `Template:
${tpl}

This month's data:
${JSON.stringify(summary, null, 2)}

Previous month (for comparison, may be null):
${JSON.stringify(prevSummary, null, 2)}

Notes from the human (if any):
${notes}

Fill the template. Output only the final report markdown — no preamble.`,
      },
    ],
  });

  const outDir = resolve(dir, "reports");
  await mkdir(outDir, { recursive: true });
  const outPath = resolve(outDir, `${month}.md`);
  await writeFile(outPath, textOf(r));
  console.log(`[monthly-report] ${outPath}`);
}

function summarize(rows: Row[]) {
  const num = (s: string) => Number(s) || 0;
  const totals = rows.reduce(
    (a, r) => ({
      impressions: a.impressions + num(r.impressions),
      reactions: a.reactions + num(r.reactions),
      comments: a.comments + num(r.comments),
      shares: a.shares + num(r.shares),
    }),
    { impressions: 0, reactions: 0, comments: 0, shares: 0 },
  );
  const sorted = [...rows].sort((a, b) => num(b.impressions) - num(a.impressions));
  return {
    n_posts: rows.length,
    totals,
    top3: sorted.slice(0, 3).map((r) => ({
      title: r.post_title,
      impressions: num(r.impressions),
      reactions: num(r.reactions),
      comments: num(r.comments),
    })),
    flop: sorted[sorted.length - 1]
      ? {
          title: sorted[sorted.length - 1].post_title,
          impressions: num(sorted[sorted.length - 1].impressions),
        }
      : null,
  };
}

function prevYM(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

async function readOpt(p: string): Promise<string | null> {
  return existsSync(p) ? readFile(p, "utf8") : null;
}

main().catch((e) => {
  console.error("[monthly-report] failed:", e);
  process.exit(1);
});
