/**
 * Triages incoming LinkedIn comments + DMs for a client.
 * You paste the raw blob (export from LinkedIn or copied from notifications)
 * into clients/<slug>/inbox/YYYY-MM-DD.txt, then run this.
 *
 * Output: clients/<slug>/inbox/YYYY-MM-DD.replies.md
 * Categories: hot-lead, supporter, troll, question, low-priority.
 */
import "dotenv/config";
import { readFile, writeFile, readdir } from "node:fs/promises";
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
    console.error("Usage: npm run reply-triage -- --client <slug>");
    process.exit(1);
  }
  const inboxDir = resolve(SYSTEM_ROOT, "clients", slug, "inbox");
  if (!existsSync(inboxDir)) {
    console.error(`No inbox dir for ${slug}. Create one and drop the day's comments/DMs in YYYY-MM-DD.txt`);
    process.exit(1);
  }

  const files = (await readdir(inboxDir)).filter(
    (f) => f.match(/^\d{4}-\d{2}-\d{2}\.txt$/),
  );
  if (files.length === 0) {
    console.log("No untreated inbox files.");
    return;
  }

  const styleGuide = await readFile(resolve(SYSTEM_ROOT, "clients", slug, "style-guide.md"), "utf8");

  for (const f of files) {
    const repliesPath = resolve(inboxDir, f.replace(".txt", ".replies.md"));
    if (existsSync(repliesPath)) {
      console.log(`skip ${f} (already triaged)`);
      continue;
    }
    const blob = await readFile(resolve(inboxDir, f), "utf8");
    console.log(`triaging ${f}…`);

    const r = await client().messages.create({
      model: MODELS.fast,
      max_tokens: 4096,
      system: cachedSystem(
        `You triage LinkedIn comments and DMs for a busy founder. Categorize each entry, then draft a reply in their voice.
Client style guide:\n${styleGuide}\n\nReply rules:
- Hot leads: warm but not eager. Move to DM if they're already in DM.
- Supporters: thank, BUT add 1 substantive line — not just "🙏". Don't be sycophantic.
- Trolls: ignore (mark "do not reply"). Never engage.
- Questions: answer in 1-3 sentences max.
- Low-priority: thumbs-up react, no text reply.`,
      ),
      messages: [
        {
          role: "user",
          content: `Triage every entry in this blob. Return markdown with one section per entry:

## Entry N
**From**: ...
**On**: post / DM
**Original**: "..."
**Category**: hot-lead | supporter | question | troll | low-priority
**Suggested reply**: "..."  (or "do not reply")
**Send time**: ASAP / today / tomorrow / never

BLOB:
${blob}`,
        },
      ],
    });

    await writeFile(repliesPath, textOf(r));
    console.log(`  → ${repliesPath}`);
  }
}

main().catch((e) => {
  console.error("[reply-triage] failed:", e);
  process.exit(1);
});
