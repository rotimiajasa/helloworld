import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import slugify from "slugify";
import { REPO_ROOT } from "./claude.js";

export type BacklogTopic = {
  title: string;
  intent: string;
  affiliate: string;
  slug: string;
  type: "pillar" | "comparison" | "how-to" | "listicle" | "review" | "news";
};

const TYPE_HEADERS: Record<string, BacklogTopic["type"]> = {
  "Pillar posts": "pillar",
  "Comparison posts": "comparison",
  "How-to posts": "how-to",
  "Listicle posts": "listicle",
  "Tool reviews": "review",
  "Newsworthy / monthly refresh": "news",
};

export async function loadBacklog(): Promise<BacklogTopic[]> {
  const md = await readFile(resolve(REPO_ROOT, "topics-backlog.md"), "utf8");
  const lines = md.split("\n");
  const out: BacklogTopic[] = [];
  let currentType: BacklogTopic["type"] = "pillar";

  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*(?:\(.+\))?$/);
    if (h) {
      const headerText = h[1].trim();
      for (const [k, v] of Object.entries(TYPE_HEADERS)) {
        if (headerText.startsWith(k.split(" ")[0])) {
          currentType = v;
          break;
        }
      }
      continue;
    }
    const m = line.match(/^-\s*\[\s*\]\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*$/);
    if (!m) continue;
    const title = m[1].trim();
    out.push({
      title,
      intent: m[2].trim(),
      affiliate: m[3].trim(),
      slug: slugify(title, { lower: true, strict: true }).slice(0, 80),
      type: currentType,
    });
  }
  return out;
}
