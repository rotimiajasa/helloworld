# Claude Certified Architect — Foundations · Study Kit

A complete, exam-ready study kit for the **Claude Certified Architect — Foundations (CCA-F)** certification, delivered as both a printable PDF and a slide deck.

## What's in here

| File | Description |
|---|---|
| `CCA-Foundations-Study-Kit.pdf` | Print-friendly study book with diagrams, theory, domain notes, cheat sheet, 20 practice questions, exercises, glossary. |
| `CCA-Foundations-Study-Kit.pptx` | 63-slide deck mirroring the PDF — useful for review sessions and as a handout. |
| `diagrams/` | All 14 generated illustrations (PNG) used inside both deliverables. |
| `content.py` | Single source-of-truth for all text content (chapters, domain notes, cheat sheet, questions). |
| `generate_diagrams.py` | Regenerates the diagram PNGs (matplotlib). |
| `build_pdf.py` | Rebuilds the PDF from `content.py` + `diagrams/`. |
| `build_pptx.py` | Rebuilds the slide deck. |

## Coverage

Synthesised from:
- The official exam guide (5 domains, 8 scenarios, 60 questions / 120 minutes / pass = 720)
- Anthropic Skilljar prep tracks (Building with the Claude API, Claude Code in Action, Intro to MCP, Agent Skills, etc.)
- The YouTube prep playlist (`PLFz7SvAnfqLpjPCPJBkUy077BC5ecuE8c`)
- Community study guide at `github.com/paullarionov/claude-certified-architect`

Topics covered:
- Claude API fundamentals, `tool_use`, JSON schemas, `tool_choice`
- Claude Agent SDK — agentic loops, hub-and-spoke multi-agent, hooks, sessions
- Model Context Protocol (MCP) — servers, tools, resources, structured errors
- Claude Code — CLAUDE.md hierarchy, `.claude/rules/`, slash commands & skills, planning mode, CI/CD, MCP integration
- Prompt engineering — few-shot, explicit criteria, validation/retry, self-correction
- Message Batches API — when to use, `custom_id`, SLA planning
- Task decomposition, escalation patterns, error propagation, context management
- All 5 exam domains with the exact knowledge/skills the blueprint tests
- 20 worked practice questions with explanations
- 4 hands-on practical labs

## Rebuild

```bash
pip install reportlab python-pptx matplotlib
python3 generate_diagrams.py
python3 build_pdf.py
python3 build_pptx.py
```
