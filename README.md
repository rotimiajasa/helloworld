# AI Trading Agent

A 24/7 autonomous equity trading agent powered by **Claude Opus 4.7**, running on Claude Code Routines with Alpaca for brokerage, Perplexity for research, and ClickUp for notifications.

> ⚠️ **Disclaimer:** This is experimental software. Not financial advice. Use paper trading before risking real capital.

---

## Architecture

```
memory/          ← Agent's persistent brain (committed to GitHub)
scripts/         ← API integrations (Alpaca, Perplexity, ClickUp)
routines/        ← Scheduled task prompts (run via Claude Code)
commands/        ← Manual slash commands
CLAUDE.md        ← Agent system prompt & rules
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your real API keys
```

Required keys:
| Variable | Source |
|----------|--------|
| `ALPACA_API_KEY` | [Alpaca Markets](https://app.alpaca.markets) |
| `ALPACA_SECRET_KEY` | [Alpaca Markets](https://app.alpaca.markets) |
| `PERPLEXITY_API_KEY` | [Perplexity AI](https://www.perplexity.ai/api) |
| `CLICKUP_API_TOKEN` | [ClickUp Settings → Apps](https://app.clickup.com/settings/apps) |
| `CLICKUP_LIST_ID` | Your ClickUp list ID for trade logs |

### 3. Test API connectivity
```bash
npm run test-keys
```

### 4. Run a routine manually
```bash
# Pre-market research (no trades)
claude --model claude-opus-4-7 -p routines/pre_market.txt

# Market open (executes trades)
claude --model claude-opus-4-7 -p routines/market_open.txt
```

---

## Routine Schedule (Weekdays Only)

| Time | Routine | Action |
|------|---------|--------|
| 6:00 AM | Pre-Market | Research + trade planning |
| 8:30 AM | Market Open | Execute planned trades + set stops |
| 12:00 PM | Midday | Cut losers, tighten stops |
| 3:00 PM | Market Close | EOD review + ClickUp report |
| Friday 4 PM | Weekly Review | Performance grade + strategy update |

### Claude Code Routines (cron)
Set up in your Claude Code settings or `.claude/settings.json`:
```
0 6 * * 1-5   claude --model claude-opus-4-7 -p routines/pre_market.txt
30 8 * * 1-5  claude --model claude-opus-4-7 -p routines/market_open.txt
0 12 * * 1-5  claude --model claude-opus-4-7 -p routines/midday.txt
0 15 * * 1-5  claude --model claude-opus-4-7 -p routines/market_close.txt
0 16 * * 5    claude --model claude-opus-4-7 -p routines/weekly_review.txt
```

---

## Strategy Summary

- **Style:** Swing / long-term fundamental investing
- **Benchmark:** S&P 500 (SPY)
- **Max position:** 5% of equity per ticker
- **Stop loss:** ~7% from entry (hard rule)
- **Trailing stop:** ~10% from recent high
- **Prohibited:** Options, leverage, penny stocks, HFT

Full strategy: [`memory/strategy.md`](memory/strategy.md)

---

## Persistence Model

The agent is stateless each run. Memory is maintained via files committed to GitHub:

```
memory/strategy.md      ← Rules and principles
memory/portfolio.md     ← Current positions and account state
memory/trade_log.md     ← All executed trades
memory/research_log.md  ← Daily research and watchlists
memory/weekly_review.md ← Weekly performance grades
```

Every routine ends with: `git add memory/ && git commit && git push`

---

## Manual Commands

```bash
# Research a stock or topic
./commands/research NVDA earnings outlook Q4

# Execute a trade
./commands/trade buy AAPL 10 --stop 175.00
./commands/trade buy MSFT 500 --dollars
./commands/trade sell TSLA all

# View logs
./commands/log portfolio
./commands/log trades
./commands/log note "Important observation"
```

---

## Testing Protocol

Before live trading:
1. Set `paper: true` in `scripts/execute_trade.js` and `scripts/fetch_market_data.js`
2. Run each routine manually and verify logs update
3. Confirm trades appear in Alpaca paper account
4. Verify ClickUp notifications arrive
5. Check that git commits push successfully after each run
