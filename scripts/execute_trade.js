/**
 * Executes trades via Alpaca and logs results.
 * Usage: node execute_trade.js <buy|sell> <TICKER> <qty|dollar_amount> [--dollars] [--stop <price>] [--limit <price>]
 *
 * Examples:
 *   node execute_trade.js buy AAPL 10
 *   node execute_trade.js buy AAPL 500 --dollars
 *   node execute_trade.js sell AAPL 10 --stop 175.00
 *   node execute_trade.js sell AAPL all
 */

import Alpaca from "@alpacahq/alpaca-trade-api";
import fs from "fs";
import path from "path";

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_SECRET_KEY,
  paper: true,
});

const TRADE_LOG = path.resolve("memory/trade_log.md");
const PORTFOLIO_MD = path.resolve("memory/portfolio.md");

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

async function getAccount() {
  return alpaca.getAccount();
}

async function getCurrentPrice(ticker) {
  const quotes = await alpaca.getLatestQuote(ticker);
  return (quotes.AskPrice + quotes.BidPrice) / 2;
}

async function getPosition(ticker) {
  try {
    return await alpaca.getPosition(ticker);
  } catch {
    return null;
  }
}

function validateGuardrails(side, ticker, notionalValue, totalEquity) {
  const maxPositionPct = 0.05;
  const maxNotional = totalEquity * maxPositionPct;

  if (side === "buy" && notionalValue > maxNotional) {
    throw new Error(
      `GUARDRAIL VIOLATION: ${ticker} order ($${notionalValue.toFixed(2)}) exceeds 5% position limit ($${maxNotional.toFixed(2)} of $${totalEquity} equity). Reduce size.`
    );
  }
}

function appendTradeLog(entry) {
  const existing = fs.readFileSync(TRADE_LOG, "utf8");
  const insertAt = existing.indexOf("<!-- Trades will be appended below this line -->");
  if (insertAt === -1) {
    fs.appendFileSync(TRADE_LOG, "\n" + entry);
  } else {
    const updated =
      existing.slice(0, insertAt + "<!-- Trades will be appended below this line -->".length) +
      "\n\n" +
      entry +
      existing.slice(insertAt + "<!-- Trades will be appended below this line -->".length);
    fs.writeFileSync(TRADE_LOG, updated);
  }
}

async function placeBuyOrder(ticker, qty, limitPrice, stopLoss) {
  const orderParams = {
    symbol: ticker,
    qty,
    side: "buy",
    type: limitPrice ? "limit" : "market",
    time_in_force: "day",
  };
  if (limitPrice) orderParams.limit_price = limitPrice.toFixed(2);

  const order = await alpaca.createOrder(orderParams);

  // Place bracket stop-loss if requested
  if (stopLoss) {
    await alpaca.createOrder({
      symbol: ticker,
      qty,
      side: "sell",
      type: "stop",
      stop_price: stopLoss.toFixed(2),
      time_in_force: "gtc",
    });
  }

  return order;
}

async function placeSellOrder(ticker, qty, limitPrice) {
  const orderParams = {
    symbol: ticker,
    qty,
    side: "sell",
    type: limitPrice ? "limit" : "market",
    time_in_force: "day",
  };
  if (limitPrice) orderParams.limit_price = limitPrice.toFixed(2);

  return alpaca.createOrder(orderParams);
}

// Parse CLI args
const [, , side, ticker, qtyArg, ...flags] = process.argv;

if (!["buy", "sell"].includes(side) || !ticker || !qtyArg) {
  console.error("Usage: node execute_trade.js <buy|sell> <TICKER> <qty|dollar_amount> [--dollars] [--stop <price>] [--limit <price>]");
  process.exit(1);
}

const isDollars = flags.includes("--dollars");
const stopIdx = flags.indexOf("--stop");
const limitIdx = flags.indexOf("--limit");
const stopPrice = stopIdx !== -1 ? parseFloat(flags[stopIdx + 1]) : null;
const limitPrice = limitIdx !== -1 ? parseFloat(flags[limitIdx + 1]) : null;

try {
  const account = await getAccount();
  const totalEquity = parseFloat(account.equity);
  const currentPrice = await getCurrentPrice(ticker.toUpperCase());

  let qty;
  if (qtyArg === "all") {
    const pos = await getPosition(ticker.toUpperCase());
    if (!pos) throw new Error(`No open position in ${ticker}`);
    qty = parseInt(pos.qty);
  } else if (isDollars) {
    const dollars = parseFloat(qtyArg);
    qty = Math.floor(dollars / currentPrice);
    if (qty < 1) throw new Error(`Dollar amount $${dollars} too small to buy 1 share at $${currentPrice}`);
  } else {
    qty = parseInt(qtyArg);
  }

  const notionalValue = qty * currentPrice;

  // Guardrail check on buys
  if (side === "buy") {
    validateGuardrails("buy", ticker.toUpperCase(), notionalValue, totalEquity);
  }

  console.log(`\n📋 Order Preview`);
  console.log(`  Side:      ${side.toUpperCase()}`);
  console.log(`  Ticker:    ${ticker.toUpperCase()}`);
  console.log(`  Qty:       ${qty} shares`);
  console.log(`  ~Price:    $${currentPrice.toFixed(2)}`);
  console.log(`  ~Notional: $${notionalValue.toFixed(2)}`);
  if (stopPrice) console.log(`  Stop Loss: $${stopPrice.toFixed(2)}`);
  if (limitPrice) console.log(`  Limit:     $${limitPrice.toFixed(2)}`);
  console.log();

  let order;
  if (side === "buy") {
    order = await placeBuyOrder(ticker.toUpperCase(), qty, limitPrice, stopPrice);
  } else {
    order = await placeSellOrder(ticker.toUpperCase(), qty, limitPrice);
  }

  console.log(`✅ Order submitted: ${order.id} | Status: ${order.status}`);

  // Log to trade_log.md
  const logEntry = `### ${todayISO()} | ${ticker.toUpperCase()} | ${side.toUpperCase()} | ${qty} @ ~$${currentPrice.toFixed(2)}
- Order ID: ${order.id}
- Notional: $${notionalValue.toFixed(2)}
- Stop Loss: ${stopPrice ? "$" + stopPrice.toFixed(2) : "TBD"}
- Limit: ${limitPrice ? "$" + limitPrice.toFixed(2) : "Market"}
- Thesis: <!-- AGENT: fill in thesis -->
- Outcome: OPEN`;

  appendTradeLog(logEntry);
  console.log(`📝 Trade logged to memory/trade_log.md`);

  console.log(JSON.stringify(order, null, 2));
} catch (err) {
  console.error(`❌ Trade failed: ${err.message}`);
  process.exit(1);
}
