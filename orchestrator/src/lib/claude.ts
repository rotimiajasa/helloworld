import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(__dirname, "../../..");

let _client: Anthropic | null = null;
export function client(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const MODELS = {
  writer: process.env.MODEL_WRITER ?? "claude-opus-4-7",
  editor: process.env.MODEL_EDITOR ?? "claude-sonnet-4-6",
  research: process.env.MODEL_RESEARCH ?? "claude-haiku-4-5-20251001",
};

let _styleGuideCache: string | null = null;
export async function styleGuide(): Promise<string> {
  if (_styleGuideCache) return _styleGuideCache;
  _styleGuideCache = await readFile(resolve(REPO_ROOT, "style-guide.md"), "utf8");
  return _styleGuideCache;
}

let _affiliatesCache: Record<string, AffiliateEntry> | null = null;
export type AffiliateEntry = {
  name: string;
  url: string;
  context: string;
  payout: string;
};
export async function affiliates(): Promise<Record<string, AffiliateEntry>> {
  if (_affiliatesCache) return _affiliatesCache;
  const raw = await readFile(
    resolve(REPO_ROOT, "orchestrator/config/affiliates.json"),
    "utf8",
  );
  _affiliatesCache = JSON.parse(raw);
  return _affiliatesCache!;
}

/**
 * Wraps a system prompt as a cacheable block. Pass the result as `system: [...]`
 * in messages.create() to get the 90% cache discount on the style guide.
 */
export function cachedSystem(text: string) {
  return [{ type: "text" as const, text, cache_control: { type: "ephemeral" as const } }];
}
