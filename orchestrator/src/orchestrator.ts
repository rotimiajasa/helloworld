import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import matter from "gray-matter";
import { REPO_ROOT } from "./lib/claude.js";
import { loadState, saveState } from "./lib/state.js";
import { researchTopics } from "./agents/keyword-research.js";
import { analyzeCompetitors } from "./agents/competitor-analysis.js";
import { draftArticles } from "./agents/article-writer.js";
import { editForSeo } from "./agents/seo-editor.js";
import { repurpose } from "./agents/repurpose.js";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run") || process.env.DRY_RUN === "true";
const N = Number(process.env.ARTICLES_PER_RUN ?? 5);
const SITE_URL = process.env.SITE_URL ?? "https://example.com";

async function main() {
  console.log(`[orchestrator] start — articles=${N} dry=${DRY}`);

  // 1. Research
  console.log("[1/5] researching topics…");
  const topics = await researchTopics(N);
  console.log(
    `       picked: ${topics.map((t) => `\n         - ${t.title} [${t.type}]`).join("")}`,
  );
  if (DRY) {
    console.log("[dry-run] stopping after research.");
    return;
  }

  // 2. Competitors
  console.log("[2/5] analyzing competitors…");
  const briefs = await analyzeCompetitors(topics);

  // 3. Draft
  console.log("[3/5] drafting articles…");
  const drafts = await draftArticles(briefs);

  // 4. SEO edit
  console.log("[4/5] SEO editing…");
  const edited = await editForSeo(drafts);

  // 5. Write to disk
  console.log("[5/5] writing markdown + repurposed assets…");
  const postsDir = resolve(REPO_ROOT, "site/src/content/posts");
  await mkdir(postsDir, { recursive: true });

  for (const a of edited) {
    const fm = {
      title: a.title,
      description: a.description,
      primaryKeyword: a.primaryKeyword,
      publishedAt: new Date().toISOString().slice(0, 10),
      draft: true,
      needsHumanCommentary: true,
      ...a.frontmatterExtras,
    };
    const md = matter.stringify(a.markdown, fm);
    await writeFile(resolve(postsDir, `${a.slug}.md`), md);
  }

  // Repurpose batch
  const batch = await repurpose(edited, SITE_URL);
  const outDir = resolve(REPO_ROOT, "out", new Date().toISOString().slice(0, 10));
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "newsletter.md"), batch.newsletter);
  await writeFile(resolve(outDir, "linkedin.md"), batch.linkedinPost);
  for (let i = 0; i < batch.tweetThreads.length; i++) {
    await writeFile(resolve(outDir, `thread-${i + 1}.md`), batch.tweetThreads[i]);
  }

  // Update state — only mark as covered after files written successfully.
  const state = await loadState();
  for (const a of edited) {
    state.covered.push({
      slug: a.slug,
      title: a.title,
      publishedAt: new Date().toISOString().slice(0, 10),
      primaryKeyword: a.primaryKeyword,
    });
  }
  await saveState(state);

  console.log(`[orchestrator] done. ${edited.length} drafts written.`);
  console.log(`              → site/src/content/posts/`);
  console.log(`              → out/${new Date().toISOString().slice(0, 10)}/`);
}

main().catch((e) => {
  console.error("[orchestrator] FAILED:", e);
  process.exit(1);
});
