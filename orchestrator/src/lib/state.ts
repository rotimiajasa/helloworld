import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { REPO_ROOT } from "./claude.js";

const STATE_PATH = resolve(REPO_ROOT, "orchestrator/state/covered.json");

export type CoveredTopic = {
  slug: string;
  title: string;
  publishedAt: string;
  primaryKeyword: string;
};

export type State = {
  covered: CoveredTopic[];
  skipped: string[];
};

export async function loadState(): Promise<State> {
  if (!existsSync(STATE_PATH)) return { covered: [], skipped: [] };
  return JSON.parse(await readFile(STATE_PATH, "utf8"));
}

export async function saveState(s: State): Promise<void> {
  await mkdir(dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify(s, null, 2));
}

export function isCovered(state: State, slug: string): boolean {
  return state.covered.some((c) => c.slug === slug) || state.skipped.includes(slug);
}
