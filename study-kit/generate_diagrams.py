"""Generate diagram PNGs used by the CCA-F Study Kit (PDF + PPTX)."""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import numpy as np

OUT = os.path.join(os.path.dirname(__file__), "diagrams")
os.makedirs(OUT, exist_ok=True)

ANTH_ORANGE = "#D97757"
ANTH_DARK = "#191919"
ANTH_CREAM = "#F5F0E8"
ANTH_BLUE = "#3A6F8F"
ANTH_GREEN = "#5A8A6B"
ANTH_RED = "#B5483D"
ANTH_GREY = "#7A7A7A"


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print("wrote", path)


# 1. Domain weighting pie chart
def domain_weights():
    fig, ax = plt.subplots(figsize=(8, 6))
    labels = [
        "Agent Architecture\n& Orchestration\n(27%)",
        "Claude Code Config\n& Workflows\n(20%)",
        "Prompt Engineering\n& Structured Output\n(20%)",
        "Tool Design\n& MCP Integration\n(18%)",
        "Context Management\n& Reliability\n(15%)",
    ]
    sizes = [27, 20, 20, 18, 15]
    colors = [ANTH_ORANGE, ANTH_BLUE, ANTH_GREEN, "#C28E4E", ANTH_RED]
    wedges, texts = ax.pie(
        sizes,
        labels=labels,
        colors=colors,
        startangle=90,
        wedgeprops=dict(edgecolor="white", linewidth=2),
        textprops=dict(fontsize=10, color=ANTH_DARK),
    )
    ax.set_title(
        "CCA-F Exam Domains (Weighted)",
        fontsize=16,
        fontweight="bold",
        color=ANTH_DARK,
        pad=20,
    )
    save(fig, "01_domain_weights.png")


# 2. Agent loop flowchart
def agent_loop():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis("off")

    boxes = [
        (1.0, 4, "Send request\nto Claude\n(messages + tools)", ANTH_BLUE),
        (4.0, 4, "Receive response\n+ stop_reason", ANTH_DARK),
        (7.0, 4, 'stop_reason\n== "tool_use"?', ANTH_ORANGE),
        (7.0, 1, "Execute tool,\nappend tool_result\nto history", ANTH_GREEN),
        (1.0, 1, 'stop_reason == "end_turn"\nReturn final answer', ANTH_RED),
    ]
    for x, y, txt, color in boxes:
        box = FancyBboxPatch(
            (x - 0.95, y - 0.55),
            1.9,
            1.1,
            boxstyle="round,pad=0.05",
            linewidth=1.5,
            edgecolor=color,
            facecolor="white",
        )
        ax.add_patch(box)
        ax.text(x, y, txt, ha="center", va="center", fontsize=9, color=ANTH_DARK)

    arrows = [
        ((1.95, 4), (3.05, 4)),  # send -> receive
        ((4.95, 4), (6.05, 4)),  # receive -> stop_reason
        ((7.0, 3.45), (7.0, 1.55)),  # tool_use yes -> execute
        ((6.05, 0.85), (1.95, 0.85)),  # execute -> end_turn? actually loops back
        ((7.0, 0.55), (1.0, 0.55)),
        ((1.0, 1.55), (1.0, 3.45)),  # back to send
    ]
    for (x1, y1), (x2, y2) in [
        ((1.95, 4), (3.05, 4)),
        ((4.95, 4), (6.05, 4)),
    ]:
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="->", mutation_scale=15, color=ANTH_DARK))

    # tool_use yes path
    ax.add_patch(FancyArrowPatch((7.0, 3.45), (7.0, 1.55), arrowstyle="->", mutation_scale=15, color=ANTH_GREEN))
    ax.text(7.15, 2.5, "yes", color=ANTH_GREEN, fontsize=10, fontweight="bold")
    # loop back
    ax.add_patch(
        FancyArrowPatch((6.05, 1.0), (1.95, 1.0), connectionstyle="arc3,rad=0", arrowstyle="->", mutation_scale=15, color=ANTH_GREEN)
    )
    # tool_use no path -> end
    ax.add_patch(FancyArrowPatch((6.05, 4.0), (1.95, 4.0), arrowstyle="-", mutation_scale=15, color=ANTH_DARK, alpha=0))
    ax.add_patch(
        FancyArrowPatch((6.6, 3.6), (1.95, 1.5), arrowstyle="->", mutation_scale=15, color=ANTH_RED, connectionstyle="arc3,rad=-0.2")
    )
    ax.text(4.0, 2.5, "no -> end_turn", color=ANTH_RED, fontsize=10, fontweight="bold")
    # send back loop
    ax.add_patch(FancyArrowPatch((1.0, 1.55), (1.0, 3.45), arrowstyle="->", mutation_scale=15, color=ANTH_BLUE))
    ax.text(0.4, 2.6, "loop", color=ANTH_BLUE, fontsize=10, fontweight="bold", rotation=90)

    ax.set_title("The Agentic Loop (model-driven)", fontsize=15, fontweight="bold", color=ANTH_DARK, pad=10)
    save(fig, "02_agent_loop.png")


# 3. Hub-and-spoke multi-agent
def hub_and_spoke():
    fig, ax = plt.subplots(figsize=(9, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis("off")

    # coordinator
    cx, cy = 5, 5
    box = FancyBboxPatch(
        (cx - 1.3, cy - 0.5),
        2.6,
        1.0,
        boxstyle="round,pad=0.05",
        linewidth=2,
        edgecolor=ANTH_ORANGE,
        facecolor="#FBE9DD",
    )
    ax.add_patch(box)
    ax.text(cx, cy, "Coordinator\n(decompose, delegate, aggregate)", ha="center", va="center", fontsize=10, fontweight="bold")

    subagents = [
        (1.5, 2, "Web Search\nSubagent"),
        (4, 2, "Document\nAnalysis"),
        (6.5, 2, "Synthesis\nSubagent"),
        (9, 2, "Report\nGenerator"),
    ]
    for x, y, label in subagents:
        b = FancyBboxPatch(
            (x - 0.8, y - 0.5),
            1.6,
            1.0,
            boxstyle="round,pad=0.05",
            linewidth=1.5,
            edgecolor=ANTH_BLUE,
            facecolor="white",
        )
        ax.add_patch(b)
        ax.text(x, y, label, ha="center", va="center", fontsize=9)
        ax.add_patch(FancyArrowPatch((cx, cy - 0.5), (x, y + 0.5), arrowstyle="<->", mutation_scale=12, color=ANTH_GREY))

    ax.text(5, 0.8, "Subagents have ISOLATED context — pass full context explicitly via Task prompt",
            ha="center", fontsize=10, color=ANTH_RED, style="italic")
    ax.set_title("Hub-and-Spoke Multi-Agent Architecture", fontsize=15, fontweight="bold", color=ANTH_DARK, pad=10)
    save(fig, "03_hub_and_spoke.png")


# 4. CLAUDE.md hierarchy
def claude_md_hierarchy():
    fig, ax = plt.subplots(figsize=(9, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis("off")

    levels = [
        (5, 4.8, 4.0, "User-level: ~/.claude/CLAUDE.md\nPersonal preferences (not in VCS)", ANTH_GREY),
        (5, 3.0, 4.0, "Project-level: .claude/CLAUDE.md (in VCS)\nTeam standards, applied for all contributors", ANTH_BLUE),
        (5, 1.2, 4.0, "Directory-level: <subdir>/CLAUDE.md\nApplies to that part of the codebase", ANTH_GREEN),
    ]
    for x, y, w, txt, color in levels:
        b = FancyBboxPatch((x - w / 2, y - 0.5), w, 1.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=color, facecolor="white")
        ax.add_patch(b)
        ax.text(x, y, txt, ha="center", va="center", fontsize=10)

    # arrows merging
    ax.add_patch(FancyArrowPatch((5, 4.3), (5, 3.5), arrowstyle="->", mutation_scale=12, color=ANTH_DARK))
    ax.add_patch(FancyArrowPatch((5, 2.5), (5, 1.7), arrowstyle="->", mutation_scale=12, color=ANTH_DARK))
    ax.text(0.5, 0.4, "All three levels merge into the active context. Use @path imports & .claude/rules/ to modularize.", fontsize=10, color=ANTH_DARK, style="italic")
    ax.set_title("CLAUDE.md Hierarchy", fontsize=15, fontweight="bold", color=ANTH_DARK, pad=10)
    save(fig, "04_claude_md_hierarchy.png")


# 5. MCP architecture
def mcp_arch():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)
    ax.axis("off")

    # Host (Claude)
    b = FancyBboxPatch((0.5, 2), 2.4, 2.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=ANTH_ORANGE, facecolor="#FBE9DD")
    ax.add_patch(b)
    ax.text(1.7, 3.0, "Claude\n(MCP Host)\n• Claude Code\n• Agent SDK", ha="center", va="center", fontsize=10, fontweight="bold")

    # Servers
    servers = [
        (6.0, 4.7, "GitHub MCP", "tools: search_pr,\nlist_issues, ..."),
        (6.0, 3.0, "Jira MCP", "tools: get_issue,\nupdate_status, ..."),
        (6.0, 1.3, "Custom MCP", "tools: load_doc, ...\nresources: catalog"),
    ]
    for x, y, name, body in servers:
        bx = FancyBboxPatch((x - 1.2, y - 0.6), 2.4, 1.2, boxstyle="round,pad=0.05", linewidth=1.5, edgecolor=ANTH_BLUE, facecolor="white")
        ax.add_patch(bx)
        ax.text(x, y + 0.25, name, ha="center", va="center", fontsize=10, fontweight="bold", color=ANTH_BLUE)
        ax.text(x, y - 0.2, body, ha="center", va="center", fontsize=8.5)
        ax.add_patch(FancyArrowPatch((2.9, 3.0), (x - 1.2, y), arrowstyle="<->", mutation_scale=12, color=ANTH_GREY))

    # Backend systems
    backends = [
        (10.5, 4.7, "GitHub API"),
        (10.5, 3.0, "Jira API"),
        (10.5, 1.3, "Internal DB"),
    ]
    for (x, y, name), (sx, sy, _, _) in zip(backends, servers):
        bx = FancyBboxPatch((x - 1.0, y - 0.4), 2.0, 0.8, boxstyle="round,pad=0.05", linewidth=1.5, edgecolor=ANTH_GREEN, facecolor="white")
        ax.add_patch(bx)
        ax.text(x, y, name, ha="center", va="center", fontsize=9.5)
        ax.add_patch(FancyArrowPatch((sx + 1.2, sy), (x - 1.0, y), arrowstyle="<->", mutation_scale=12, color=ANTH_GREY))

    ax.text(6.0, 0.3, "MCP exposes 3 primitives: Tools (actions), Resources (read-only data), Prompts (templates)", ha="center", fontsize=10, style="italic", color=ANTH_DARK)
    ax.set_title("Model Context Protocol (MCP) Architecture", fontsize=15, fontweight="bold", color=ANTH_DARK, pad=10)
    save(fig, "05_mcp_architecture.png")


# 6. Hooks vs prompts comparison
def hooks_vs_prompts():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")

    # Hooks (deterministic)
    b1 = FancyBboxPatch((0.3, 0.5), 4.6, 4.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=ANTH_GREEN, facecolor="#EAF2EC")
    ax.add_patch(b1)
    ax.text(2.6, 4.0, "HOOKS (Code)", ha="center", fontsize=14, fontweight="bold", color=ANTH_GREEN)
    ax.text(2.6, 3.4, "Deterministic — 100%", ha="center", fontsize=11)
    ax.text(0.5, 2.7, "• PreToolUse: block / redirect tool calls\n• PostToolUse: normalize results, trim fields\n• Always enforced; not subject to drift\n• Best for: financial, legal, compliance, safety\n• Example: block refund > $500", fontsize=10, va="top")

    # Prompts (probabilistic)
    b2 = FancyBboxPatch((5.1, 0.5), 4.6, 4.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=ANTH_RED, facecolor="#FBE6E2")
    ax.add_patch(b2)
    ax.text(7.4, 4.0, "PROMPT INSTRUCTIONS", ha="center", fontsize=14, fontweight="bold", color=ANTH_RED)
    ax.text(7.4, 3.4, "Probabilistic — >90%, never 100%", ha="center", fontsize=11)
    ax.text(5.3, 2.7, '• "Always verify customer first"\n• "Try to resolve before escalating"\n• Fast to change; flexible\n• Best for: preferences, formatting, soft policy\n• Drifts as conversation grows', fontsize=10, va="top")

    ax.set_title("Hooks vs Prompt Instructions — When to Use Which", fontsize=14, fontweight="bold", color=ANTH_DARK, pad=10)
    save(fig, "06_hooks_vs_prompts.png")


# 7. Sync vs Batch decision
def sync_vs_batch():
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.5)
    ax.axis("off")
    ax.set_title("Sync API vs Message Batches API", fontsize=14, fontweight="bold", pad=10)

    rows = [
        ("Pre-merge PR check", "Synchronous", ANTH_ORANGE, "Developer waits"),
        ("Interactive code review", "Synchronous", ANTH_ORANGE, "Real-time"),
        ("Iterative tool-calling agent", "Synchronous", ANTH_ORANGE, "Batch ≠ multi-turn"),
        ("Overnight tech-debt report", "Batch (50% off)", ANTH_GREEN, "≤24h OK"),
        ("Weekly security audit", "Batch (50% off)", ANTH_GREEN, "≤24h OK"),
        ("10 000 invoices extraction", "Batch (50% off)", ANTH_GREEN, "Throughput"),
    ]
    y = 4.6
    ax.text(0.4, 5.1, "Workload", fontsize=11, fontweight="bold")
    ax.text(4.0, 5.1, "Choose", fontsize=11, fontweight="bold")
    ax.text(6.6, 5.1, "Why", fontsize=11, fontweight="bold")
    for w, c, color, why in rows:
        ax.add_patch(Rectangle((0.3, y - 0.35), 9.4, 0.6, edgecolor=color, facecolor="white"))
        ax.text(0.5, y, w, fontsize=10, va="center")
        ax.text(4.0, y, c, fontsize=10, va="center", color=color, fontweight="bold")
        ax.text(6.6, y, why, fontsize=10, va="center")
        y -= 0.7
    save(fig, "07_sync_vs_batch.png")


# 8. Error category matrix
def error_matrix():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")
    ax.set_title("MCP / Tool Error Categories", fontsize=14, fontweight="bold", pad=10)

    rows = [
        ("Transient", "Timeout, 503, network", "Retry w/ backoff", ANTH_ORANGE),
        ("Validation", "Bad input, missing field", "Fix input & retry", ANTH_BLUE),
        ("Business", "Policy violation, threshold", "Explain to user; offer alternative", ANTH_RED),
        ("Permission", "Access denied", "Escalate to human", ANTH_DARK),
    ]
    headers = ["Category", "Examples", "Action"]
    xs = [0.4, 2.8, 6.2]
    y = 4.0
    for h, x in zip(headers, xs):
        ax.text(x, 4.6, h, fontsize=11, fontweight="bold")
    for cat, ex, act, color in rows:
        ax.add_patch(Rectangle((0.3, y - 0.4), 9.4, 0.7, edgecolor=color, facecolor="white", linewidth=1.5))
        ax.text(0.4, y, cat, fontsize=10.5, fontweight="bold", color=color, va="center")
        ax.text(2.8, y, ex, fontsize=10, va="center")
        ax.text(6.2, y, act, fontsize=10, va="center")
        y -= 0.85
    ax.text(0.3, 0.2, "Always return STRUCTURED errors: errorCategory, isRetryable, message, attempted_query, partial_results.",
            fontsize=10, color=ANTH_DARK, style="italic")
    save(fig, "08_error_categories.png")


# 9. Context strategies
def context_strategies():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis("off")
    ax.set_title("Context-Window Management Strategies", fontsize=14, fontweight="bold", pad=10)

    strategies = [
        (2.5, 4.5, "Case-Facts Block", "Pin amounts, IDs,\ndates outside summary"),
        (7.5, 4.5, "Trim Tool Output", "PostToolUse hook keeps\nonly relevant fields"),
        (2.5, 2.5, "Position-Aware Input", "Key findings at TOP\n+ explicit headings"),
        (7.5, 2.5, "Scratchpad File", "Persist findings across\nsession boundaries"),
        (2.5, 0.7, "Subagent Delegation", "Explore subagent isolates\nverbose discovery"),
        (7.5, 0.7, "/compact + /memory", "Compress; preserve facts\nin CLAUDE.md"),
    ]
    for x, y, t, body in strategies:
        b = FancyBboxPatch((x - 2.0, y - 0.7), 4.0, 1.4, boxstyle="round,pad=0.05", linewidth=1.5, edgecolor=ANTH_BLUE, facecolor="white")
        ax.add_patch(b)
        ax.text(x, y + 0.3, t, ha="center", fontsize=11, fontweight="bold", color=ANTH_BLUE)
        ax.text(x, y - 0.25, body, ha="center", fontsize=9.5)
    save(fig, "09_context_strategies.png")


# 10. Planning vs direct execution
def planning_vs_direct():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")
    ax.set_title("Planning Mode vs Direct Execution", fontsize=14, fontweight="bold", pad=10)

    b1 = FancyBboxPatch((0.3, 0.5), 4.6, 4.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=ANTH_BLUE, facecolor="#E6EEF3")
    ax.add_patch(b1)
    ax.text(2.6, 4.0, "PLANNING MODE", ha="center", fontsize=13, fontweight="bold", color=ANTH_BLUE)
    ax.text(0.5, 3.5, "Use when:", fontsize=10, fontweight="bold", va="top")
    ax.text(0.5, 3.0, "• Many files (dozens), architectural\n   decisions, library migrations\n• Multiple plausible approaches\n• Unfamiliar codebase\n• Side-effect-free exploration",
            fontsize=10, va="top")

    b2 = FancyBboxPatch((5.1, 0.5), 4.6, 4.0, boxstyle="round,pad=0.05", linewidth=2, edgecolor=ANTH_GREEN, facecolor="#EAF2EC")
    ax.add_patch(b2)
    ax.text(7.4, 4.0, "DIRECT EXECUTION", ha="center", fontsize=13, fontweight="bold", color=ANTH_GREEN)
    ax.text(5.3, 3.5, "Use when:", fontsize=10, fontweight="bold", va="top")
    ax.text(5.3, 3.0, "• Single-file fix with clear stack trace\n• Adding one validation check\n• Well-understood, unambiguous\n   change\n• Implementing an APPROVED plan",
            fontsize=10, va="top")
    save(fig, "10_planning_vs_direct.png")


# 11. tool_choice modes
def tool_choice():
    fig, ax = plt.subplots(figsize=(10, 4.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4.5)
    ax.axis("off")
    ax.set_title("tool_choice — Three Modes", fontsize=14, fontweight="bold", pad=10)

    modes = [
        (1.7, '{"type":"auto"}', "Model decides:\ntext OR tool", "Default", ANTH_BLUE),
        (5.0, '{"type":"any"}', "Model MUST\ncall some tool", "Guarantee\nstructured output", ANTH_ORANGE),
        (8.3, '{"type":"tool",\n"name":"X"}', 'Model MUST call\ntool X', "Force a\nspecific first step", ANTH_GREEN),
    ]
    for x, code, behavior, when, color in modes:
        b = FancyBboxPatch((x - 1.4, 0.5), 2.8, 3.4, boxstyle="round,pad=0.05", linewidth=2, edgecolor=color, facecolor="white")
        ax.add_patch(b)
        ax.text(x, 3.5, code, ha="center", fontsize=10.5, fontweight="bold", color=color, family="monospace")
        ax.text(x, 2.4, behavior, ha="center", fontsize=10)
        ax.text(x, 1.2, "when:\n" + when, ha="center", fontsize=10, style="italic")
    save(fig, "11_tool_choice.png")


# 12. Few-shot impact
def few_shot():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")
    ax.set_title("Few-Shot Prompting — Why It Works", fontsize=14, fontweight="bold", pad=10)

    ax.text(0.4, 4.4, "Vague instruction", fontsize=11, fontweight="bold", color=ANTH_RED)
    ax.text(0.4, 3.9, '"Be more conservative"', fontsize=10, family="monospace")
    ax.text(0.4, 3.4, "→ Interpreted many ways. Inconsistent.", fontsize=10, color=ANTH_RED, style="italic")

    ax.text(0.4, 2.7, "Few-shot examples (2–4)", fontsize=11, fontweight="bold", color=ANTH_GREEN)
    ax.text(0.4, 2.0, 'Q: "My order is broken"\nA: get_customer → lookup_order → diagnose\n(damaged item — need order details)\n\nQ: "Get me a manager"\nA: escalate_to_human (immediate, no further investigation)',
            fontsize=10, family="monospace", va="top")
    ax.text(0.4, 0.3, "→ Unambiguous decision logic; model GENERALIZES the pattern to new cases.",
            fontsize=10, color=ANTH_GREEN, style="italic")
    save(fig, "12_few_shot.png")


# 13. Escalation triggers
def escalation_triggers():
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")
    ax.set_title("Escalation: Reliable vs Unreliable Triggers", fontsize=14, fontweight="bold", pad=10)

    ok = [
        '✓ Customer explicitly asks "get me a manager"',
        "✓ Policy gap (request not covered by policy)",
        "✓ Cannot make progress after reasonable attempts",
        "✓ Financial op above threshold (enforce via HOOK)",
        "✓ Multiple matches when searching customer",
    ]
    bad = [
        "✗ Sentiment analysis (mood ≠ complexity)",
        "✗ Self-rated confidence 1–10 (poorly calibrated)",
        "✗ Auto-classifier (overengineered, needs data)",
        "✗ First sign of frustration (acknowledge, then resolve)",
    ]
    ax.text(0.4, 4.5, "RELIABLE", fontsize=12, fontweight="bold", color=ANTH_GREEN)
    for i, t in enumerate(ok):
        ax.text(0.4, 4.0 - i * 0.5, t, fontsize=10.5, color=ANTH_GREEN)
    ax.text(5.3, 4.5, "UNRELIABLE", fontsize=12, fontweight="bold", color=ANTH_RED)
    for i, t in enumerate(bad):
        ax.text(5.3, 4.0 - i * 0.5, t, fontsize=10.5, color=ANTH_RED)
    save(fig, "13_escalation_triggers.png")


# 14. Study roadmap
def study_roadmap():
    fig, ax = plt.subplots(figsize=(11, 5))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 5)
    ax.axis("off")
    ax.set_title("Suggested 4-Week Study Roadmap", fontsize=14, fontweight="bold", pad=10)
    weeks = [
        (1.4, "Week 1", "Claude API\n+ tool_use\n+ JSON schemas", ANTH_BLUE),
        (3.7, "Week 2", "Agent SDK\n+ MCP\n+ Hooks", ANTH_ORANGE),
        (6.0, "Week 3", "Claude Code\nCLAUDE.md, rules,\nskills, CI/CD", ANTH_GREEN),
        (8.3, "Week 4", "Multi-agent +\nContext mgmt +\n76 practice Qs", ANTH_RED),
    ]
    for x, w, body, color in weeks:
        b = FancyBboxPatch((x - 1.0, 1.0), 2.0, 2.8, boxstyle="round,pad=0.05", linewidth=2, edgecolor=color, facecolor="white")
        ax.add_patch(b)
        ax.text(x, 3.4, w, ha="center", fontsize=12, fontweight="bold", color=color)
        ax.text(x, 2.3, body, ha="center", fontsize=10)
    # arrow
    ax.add_patch(FancyArrowPatch((1.4, 0.7), (8.3, 0.7), arrowstyle="->", mutation_scale=18, color=ANTH_DARK, linewidth=2))
    ax.text(9.7, 0.7, "EXAM", fontsize=12, fontweight="bold", color=ANTH_RED, va="center")
    save(fig, "14_roadmap.png")


if __name__ == "__main__":
    domain_weights()
    agent_loop()
    hub_and_spoke()
    claude_md_hierarchy()
    mcp_arch()
    hooks_vs_prompts()
    sync_vs_batch()
    error_matrix()
    context_strategies()
    planning_vs_direct()
    tool_choice()
    few_shot()
    escalation_triggers()
    study_roadmap()
    print("All diagrams written to", OUT)
