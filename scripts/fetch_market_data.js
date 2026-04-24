/**
 * Fetches market data from Alpaca and Perplexity for agent decision-making.
 * Usage: node fetch_market_data.js [ticker1,ticker2,...] [--news]
 */

import Alpaca from "@alpacahq/alpaca-trade-api";
import fetch from "node-fetch";

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_SECRET_KEY,
  paper: true, // switch to false for live trading
});

async function getAccountInfo() {
  const account = await alpaca.getAccount();
  return {
    equity: account.equity,
    cash: account.cash,
    buyingPower: account.buying_power,
    dayPL: account.unrealized_pl,
    portfolioValue: account.portfolio_value,
  };
}

async function getPositions() {
  const positions = await alpaca.getPositions();
  return positions.map((p) => ({
    ticker: p.symbol,
    qty: p.qty,
    avgCost: p.avg_entry_price,
    currentPrice: p.current_price,
    marketValue: p.market_value,
    unrealizedPL: p.unrealized_pl,
    unrealizedPLPct: (parseFloat(p.unrealized_plpc) * 100).toFixed(2),
  }));
}

async function getQuotes(tickers) {
  if (!tickers || tickers.length === 0) return {};
  const quotes = await alpaca.getLatestQuotes(tickers);
  const result = {};
  for (const [symbol, quote] of Object.entries(quotes)) {
    result[symbol] = {
      askPrice: quote.AskPrice,
      bidPrice: quote.BidPrice,
      midPrice: ((quote.AskPrice + quote.BidPrice) / 2).toFixed(2),
    };
  }
  return result;
}

async function getBars(tickers, timeframe = "1Day", limit = 30) {
  if (!tickers || tickers.length === 0) return {};
  const bars = await alpaca.getMultiBarsV2(tickers, {
    timeframe,
    limit,
  });
  return bars;
}

async function getSPYPerformance() {
  const bars = await alpaca.getBarsV2("SPY", { timeframe: "1Day", limit: 5 });
  const data = [];
  for await (const bar of bars) {
    data.push(bar);
  }
  if (data.length < 2) return null;
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  return {
    currentPrice: latest.ClosePrice,
    dayChange: (((latest.ClosePrice - prev.ClosePrice) / prev.ClosePrice) * 100).toFixed(2),
    weekChange: (
      ((latest.ClosePrice - data[0].ClosePrice) / data[0].ClosePrice) *
      100
    ).toFixed(2),
  };
}

async function researchWithPerplexity(query) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-large-128k-online",
      messages: [
        {
          role: "system",
          content:
            "You are a financial research assistant. Provide concise, factual information about market news, company fundamentals, and macro trends. Focus on data relevant to long-term fundamental investing.",
        },
        { role: "user", content: query },
      ],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function getOrders(status = "open") {
  const orders = await alpaca.getOrders({ status });
  return orders.map((o) => ({
    id: o.id,
    ticker: o.symbol,
    side: o.side,
    qty: o.qty,
    type: o.order_type,
    limitPrice: o.limit_price,
    status: o.status,
    createdAt: o.created_at,
  }));
}

// CLI entrypoint
const args = process.argv.slice(2);
const tickers = args[0] ? args[0].split(",") : [];
const includeNews = args.includes("--news");

try {
  const [account, positions, spy, openOrders] = await Promise.all([
    getAccountInfo(),
    getPositions(),
    getSPYPerformance(),
    getOrders("open"),
  ]);

  let quotes = {};
  if (tickers.length > 0) {
    quotes = await getQuotes(tickers);
  }

  const output = { account, positions, spy, openOrders, quotes };

  if (includeNews && tickers.length > 0) {
    const newsQuery = `Latest news, earnings, and fundamental developments for: ${tickers.join(", ")}. Include any recent SEC filings, analyst upgrades/downgrades, or macro factors affecting these stocks.`;
    output.research = await researchWithPerplexity(newsQuery);
  }

  console.log(JSON.stringify(output, null, 2));
} catch (err) {
  console.error("Error fetching market data:", err.message);
  process.exit(1);
}

export {
  getAccountInfo,
  getPositions,
  getQuotes,
  getBars,
  getSPYPerformance,
  researchWithPerplexity,
  getOrders,
};
