import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SYSTEM_ROOT = resolve(__dirname, "../../..");

let _client: Anthropic | null = null;
export function client(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing");
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const MODELS = {
  smart: process.env.MODEL_SMART ?? "claude-opus-4-7",
  fast: process.env.MODEL_FAST ?? "claude-sonnet-4-6",
  cheap: process.env.MODEL_CHEAP ?? "claude-haiku-4-5-20251001",
};

export function cachedSystem(text: string) {
  return [{ type: "text" as const, text, cache_control: { type: "ephemeral" as const } }];
}

export async function loadFile(rel: string): Promise<string> {
  return readFile(resolve(SYSTEM_ROOT, rel), "utf8");
}

export function textOf(message: Anthropic.Message): string {
  return message.content.map((b) => (b.type === "text" ? b.text : "")).join("");
}

export function extractJson<T = unknown>(text: string): T {
  const m = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!m) throw new Error(`No JSON found in:\n${text.slice(0, 200)}`);
  return JSON.parse(m[0]);
}
