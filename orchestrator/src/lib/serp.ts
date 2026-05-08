/**
 * Thin SERP wrapper. Defaults to Brave Search (cheapest, generous free tier).
 * Falls back to a no-op stub if SERP_API_KEY is missing — the orchestrator
 * still runs, it just skips competitor analysis.
 */
export type SerpResult = { title: string; url: string; snippet: string };

export async function serp(query: string, count = 10): Promise<SerpResult[]> {
  const provider = process.env.SERP_PROVIDER ?? "brave";
  const key = process.env.SERP_API_KEY;
  if (!key) {
    console.warn(`[serp] no SERP_API_KEY; returning empty results for "${query}"`);
    return [];
  }

  if (provider === "brave") {
    const u = new URL("https://api.search.brave.com/res/v1/web/search");
    u.searchParams.set("q", query);
    u.searchParams.set("count", String(count));
    const r = await fetch(u, {
      headers: { "X-Subscription-Token": key, Accept: "application/json" },
    });
    if (!r.ok) throw new Error(`Brave SERP failed: ${r.status}`);
    const j: any = await r.json();
    return (j.web?.results ?? []).map((x: any) => ({
      title: x.title,
      url: x.url,
      snippet: x.description ?? "",
    }));
  }

  if (provider === "tavily") {
    const r = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: key, query, max_results: count }),
    });
    if (!r.ok) throw new Error(`Tavily SERP failed: ${r.status}`);
    const j: any = await r.json();
    return (j.results ?? []).map((x: any) => ({
      title: x.title,
      url: x.url,
      snippet: x.content ?? "",
    }));
  }

  throw new Error(`Unknown SERP_PROVIDER: ${provider}`);
}

export async function fetchPageText(url: string): Promise<string> {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NaijaUSDBot/1.0; +https://example.com/bot)",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) return "";
    const html = await r.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 8000);
  } catch (e) {
    console.warn(`[fetchPageText] failed for ${url}:`, (e as Error).message);
    return "";
  }
}
