"""Build the CCA-F study kit as a PDF (with embedded diagrams)."""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Image,
    PageBreak, Table, TableStyle, KeepTogether,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas

from content import (
    EXAM_FACTS, OFFICIAL_PREP_COURSES, CHAPTERS, DOMAINS,
    CHEAT_SHEET, QUESTIONS, OUT_OF_SCOPE, PRACTICAL_EXERCISES,
)

HERE = os.path.dirname(os.path.abspath(__file__))
DIAG = os.path.join(HERE, "diagrams")
OUT_PDF = os.path.join(HERE, "CCA-Foundations-Study-Kit.pdf")

ANTH_ORANGE = colors.HexColor("#D97757")
ANTH_DARK = colors.HexColor("#191919")
ANTH_CREAM = colors.HexColor("#F5F0E8")
ANTH_BLUE = colors.HexColor("#3A6F8F")
ANTH_GREEN = colors.HexColor("#5A8A6B")
ANTH_RED = colors.HexColor("#B5483D")
ANTH_GREY = colors.HexColor("#7A7A7A")


# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=22, leading=26,
                   textColor=ANTH_DARK, spaceBefore=18, spaceAfter=12,
                   fontName="Helvetica-Bold")
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=16, leading=20,
                   textColor=ANTH_ORANGE, spaceBefore=14, spaceAfter=8,
                   fontName="Helvetica-Bold")
H3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=12.5, leading=16,
                   textColor=ANTH_BLUE, spaceBefore=10, spaceAfter=4,
                   fontName="Helvetica-Bold")
BODY = ParagraphStyle("BODY", parent=styles["BodyText"], fontSize=10.5,
                     leading=14, textColor=ANTH_DARK, alignment=TA_JUSTIFY,
                     spaceAfter=6, fontName="Helvetica")
BULLET = ParagraphStyle("BULLET", parent=BODY, leftIndent=14, bulletIndent=4,
                       spaceAfter=3, alignment=TA_LEFT)
SMALL = ParagraphStyle("SMALL", parent=BODY, fontSize=9, leading=11,
                       textColor=ANTH_GREY)
COVER_TITLE = ParagraphStyle("COVER_TITLE", parent=styles["Title"],
                             fontSize=30, leading=36, textColor=ANTH_DARK,
                             alignment=TA_CENTER, fontName="Helvetica-Bold")
COVER_SUB = ParagraphStyle("COVER_SUB", parent=styles["Title"], fontSize=16,
                          leading=22, textColor=ANTH_ORANGE,
                          alignment=TA_CENTER, fontName="Helvetica-Bold")
COVER_BODY = ParagraphStyle("COVER_BODY", parent=BODY, fontSize=12,
                           leading=16, alignment=TA_CENTER)
CODE = ParagraphStyle("CODE", parent=BODY, fontName="Courier", fontSize=9.5,
                     leading=12, leftIndent=12, rightIndent=12,
                     textColor=ANTH_DARK, backColor=colors.HexColor("#F5F0E8"))
ANS = ParagraphStyle("ANS", parent=BODY, fontSize=10, leading=13,
                    textColor=ANTH_GREEN, fontName="Helvetica-Bold")
EXPL = ParagraphStyle("EXPL", parent=BODY, fontSize=10, leading=13,
                     textColor=ANTH_DARK, leftIndent=12)


# ---------------------------------------------------------------------------
# Page decoration
# ---------------------------------------------------------------------------
def on_page(canv, doc):
    canv.saveState()
    # Header bar
    canv.setFillColor(ANTH_DARK)
    canv.rect(0, 10.65 * inch, LETTER[0], 0.35 * inch, fill=1, stroke=0)
    canv.setFillColor(ANTH_CREAM)
    canv.setFont("Helvetica-Bold", 10)
    canv.drawString(0.5 * inch, 10.78 * inch, "Claude Certified Architect — Foundations · Study Kit")
    canv.drawRightString(LETTER[0] - 0.5 * inch, 10.78 * inch, f"Page {doc.page}")
    # Footer
    canv.setFillColor(ANTH_GREY)
    canv.setFont("Helvetica-Oblique", 8)
    canv.drawString(0.5 * inch, 0.4 * inch,
                    "Synthesised from the official Anthropic exam guide, Skilljar prep tracks & community study materials")
    canv.restoreState()


def on_cover(canv, doc):
    canv.saveState()
    # Big orange band at top
    canv.setFillColor(ANTH_ORANGE)
    canv.rect(0, 8.5 * inch, LETTER[0], 2.5 * inch, fill=1, stroke=0)
    canv.setFillColor(ANTH_CREAM)
    canv.setFont("Helvetica-Bold", 36)
    canv.drawCentredString(LETTER[0] / 2, 9.6 * inch, "CCA-F")
    canv.setFont("Helvetica", 18)
    canv.drawCentredString(LETTER[0] / 2, 8.95 * inch, "Claude Certified Architect — Foundations")
    canv.restoreState()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def add_image(story, name, width=6.4 * inch):
    path = os.path.join(DIAG, name)
    if not os.path.exists(path):
        return
    img = Image(path, width=width, height=width * 0.6)
    img.hAlign = "CENTER"
    story.append(Spacer(1, 6))
    story.append(img)
    story.append(Spacer(1, 6))


def bullets(story, items, style=BULLET):
    for it in items:
        story.append(Paragraph("• " + it, style))


def make_table(rows, col_widths=None, header=True):
    t = Table(rows, colWidths=col_widths, hAlign="LEFT")
    style = [
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.4, ANTH_GREY),
    ]
    if header:
        style += [
            ("BACKGROUND", (0, 0), (-1, 0), ANTH_DARK),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ]
    t.setStyle(TableStyle(style))
    return t


# ---------------------------------------------------------------------------
# Sections
# ---------------------------------------------------------------------------
def cover(story):
    story.append(Spacer(1, 2.8 * inch))
    story.append(Paragraph("Exam-Ready Study Kit", COVER_TITLE))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Claude Certified Architect — Foundations", COVER_SUB))
    story.append(Spacer(1, 0.6 * inch))
    facts = [
        f"Duration: {EXAM_FACTS['duration_min']} minutes  ·  {EXAM_FACTS['questions']} questions",
        f"Format: {EXAM_FACTS['format']}",
        f"Scoring: {EXAM_FACTS['scaled_score']}",
        f"Delivery: {EXAM_FACTS['delivery']}",
    ]
    for f in facts:
        story.append(Paragraph(f, COVER_BODY))
    story.append(Spacer(1, 0.4 * inch))
    add_image(story, "01_domain_weights.png", width=4.8 * inch)
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph(
        "Built for the May 2026 exam blueprint. Covers the Claude API, "
        "Claude Agent SDK, Model Context Protocol (MCP), Claude Code, "
        "prompt engineering, and reliability patterns.",
        SMALL,
    ))
    story.append(PageBreak())


def table_of_contents(story):
    story.append(Paragraph("Contents", H1))
    sections = [
        "1. Exam Overview & Roadmap",
        "2. Theory — Chapters 1–13",
        "3. Domain-by-Domain Notes",
        "4. Exam Scenarios (8)",
        "5. Quick-Reference Cheat Sheet",
        "6. Practice Questions with Explanations",
        "7. Practical Exercises (Hands-on Labs)",
        "8. Study Roadmap & Recommended Resources",
        "9. Out-of-Scope Topics",
        "10. Glossary",
    ]
    for s in sections:
        story.append(Paragraph(s, H3))
    story.append(PageBreak())


def section_overview(story):
    story.append(Paragraph("1. Exam Overview", H1))
    story.append(Paragraph(
        "The Claude Certified Architect — Foundations (CCA-F) certification "
        "validates your ability to make sound architectural trade-offs when "
        "shipping production applications with Claude. The exam draws on five "
        "weighted domains and is delivered as scenario-driven multiple-choice "
        "questions.",
        BODY,
    ))
    rows = [
        ["Parameter", "Value"],
        ["Question type", EXAM_FACTS["format"]],
        ["Scenarios sampled", EXAM_FACTS["scenarios"]],
        ["Number of questions", str(EXAM_FACTS["questions"])],
        ["Duration", f"{EXAM_FACTS['duration_min']} minutes"],
        ["Scoring", EXAM_FACTS["scaled_score"]],
        ["Delivery", EXAM_FACTS["delivery"]],
    ]
    story.append(make_table(rows, col_widths=[2.2 * inch, 4.0 * inch]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Domain Weighting", H2))
    add_image(story, "01_domain_weights.png", width=5.6 * inch)
    rows = [["Domain", "Weight"]]
    for d, w in EXAM_FACTS["domains"]:
        rows.append([d, f"{w}%"])
    story.append(make_table(rows, col_widths=[4.6 * inch, 1.3 * inch]))
    story.append(Spacer(1, 12))

    story.append(Paragraph("The 8 Production Scenarios", H2))
    story.append(Paragraph(
        "Every attempt randomly samples 4 of these 8 scenarios. Questions are "
        "rooted in realistic system-design situations rather than rote facts.",
        BODY,
    ))
    bullets(story, EXAM_FACTS["scenarios_list"])
    story.append(Spacer(1, 8))

    story.append(Paragraph("Suggested 4-Week Study Plan", H2))
    add_image(story, "14_roadmap.png", width=6.4 * inch)

    story.append(Paragraph("Official Skilljar Preparation Tracks (free)", H3))
    bullets(story, OFFICIAL_PREP_COURSES)
    story.append(PageBreak())


def section_theory(story):
    story.append(Paragraph("2. Theory — The 13 Chapters", H1))
    story.append(Paragraph(
        "These chapters distil what every CCA-F candidate must internalise. "
        "They are organised by technology and concept (not exam domain) so the "
        "underlying mental model is built before mapping back to the blueprint.",
        BODY,
    ))

    chapter_diagrams = {
        "1. Claude API — Fundamentals": None,
        "2. Tools and tool_use": "11_tool_choice.png",
        "3. Claude Agent SDK — Building Agentic Systems": "02_agent_loop.png",
        "4. Model Context Protocol (MCP)": "05_mcp_architecture.png",
        "5. Claude Code — Configuration & Workflows": "04_claude_md_hierarchy.png",
        "6. Prompt Engineering — Advanced Techniques": "12_few_shot.png",
        "7. Message Batches API": "07_sync_vs_batch.png",
        "8. Task Decomposition Strategies": None,
        "9. Escalation & Human-in-the-Loop": "13_escalation_triggers.png",
        "10. Error Handling in Multi-agent Systems": "08_error_categories.png",
        "11. Context Management in Production": "09_context_strategies.png",
        "12. Provenance Preservation in Multi-source Synthesis": None,
        "13. Claude Code Built-in Tools": None,
    }
    extra_diagrams = {
        "3. Claude Agent SDK — Building Agentic Systems": ["03_hub_and_spoke.png", "06_hooks_vs_prompts.png"],
        "5. Claude Code — Configuration & Workflows": ["10_planning_vs_direct.png"],
    }

    for title, points in CHAPTERS:
        block = [Paragraph(title, H2)]
        for p in points:
            block.append(Paragraph("• " + p, BULLET))
        story.append(KeepTogether(block))
        if chapter_diagrams.get(title):
            add_image(story, chapter_diagrams[title], width=5.8 * inch)
        for extra in extra_diagrams.get(title, []):
            add_image(story, extra, width=5.8 * inch)
    story.append(PageBreak())


def section_domains(story):
    story.append(Paragraph("3. Domain-by-Domain Notes", H1))
    story.append(Paragraph(
        "Each domain is broken down into the specific knowledge and skills the "
        "official exam guide tests. Use these as your final-week checklists.",
        BODY,
    ))
    for d in DOMAINS:
        story.append(Paragraph(d["title"], H2))
        for topic_title, points in d["topics"]:
            story.append(Paragraph(topic_title, H3))
            for p in points:
                story.append(Paragraph("• " + p, BULLET))
        story.append(Spacer(1, 6))
    story.append(PageBreak())


def section_scenarios(story):
    story.append(Paragraph("4. Exam Scenarios", H1))
    story.append(Paragraph(
        "Scenarios are described by the official exam guide. Internalise each "
        "as a complete system: what tools it uses, where it usually breaks, "
        "which trade-offs the exam will probe.",
        BODY,
    ))

    scenarios = [
        ("Customer Support Agent",
         "Returns, billing disputes, account issues. Tools: get_customer, "
         "lookup_order, process_refund, escalate_to_human. Target: 80%+ "
         "first-contact resolution. Common test points: tool selection on "
         "ambiguous wording, escalation calibration, programmatic preconditions, "
         "PostToolUse normalisation, Case-Facts blocks."),
        ("Code Generation with Claude Code",
         "Generation, refactoring, debugging, documentation. Test points: "
         "CLAUDE.md hierarchy, .claude/rules/, project vs personal skills with "
         "context: fork, planning mode vs direct execution, MCP server "
         "configuration via .mcp.json."),
        ("Multi-agent Research System",
         "Coordinator + web-search + document analysis + synthesis + report "
         "generator. Test points: hub-and-spoke topology, parallel Task spawn, "
         "explicit context passing, structured error propagation, conflicting "
         "data with attribution, coverage annotations, lost-in-the-middle "
         "mitigations, narrow-decomposition root cause."),
        ("Developer Productivity Tools",
         "Codebase exploration, boilerplate generation, automated routine "
         "tasks. Built-in tools (Read/Write/Bash/Grep/Glob) + MCP integrations. "
         "Test points: tool-selection reliability, Explore subagent, scratchpad "
         "files, incremental investigation strategy."),
        ("Claude Code for Continuous Integration",
         "claude -p in CI for code review and test generation. Test points: "
         "--output-format json + --json-schema for parseable findings, "
         "independent reviewer instance, prior-findings context to avoid "
         "duplicate comments, sync vs Batch decision, attention dilution on "
         "multi-file PRs."),
        ("Structured Data Extraction",
         "Unstructured documents → schema-validated output. Test points: "
         "tool_use + JSON schema, nullable & enum-with-other fields, "
         "validation+retry loops, calibration, stratified sampling, batch "
         "processing with custom_id."),
        ("Conversational AI Architecture Patterns",
         "Multi-turn chat over many sessions. Test points: context window "
         "management, prompt drift, instruction reinforcement, prefill, "
         "Case-Facts blocks, semantic retrieval for very long histories, "
         "preview/execute token-binding for safe destructive tools."),
        ("Agentic AI Tools",
         "(Less documented in early exam writeups.) Generally reuses the same "
         "themes: tool design, sequencing enforcement, hooks, error envelopes, "
         "structured outputs, and reliability."),
    ]
    for name, body in scenarios:
        story.append(Paragraph(name, H2))
        story.append(Paragraph(body, BODY))
    story.append(PageBreak())


def section_cheatsheet(story):
    story.append(Paragraph("5. Quick-Reference Cheat Sheet", H1))
    story.append(Paragraph(
        "Print this and revisit the night before the exam. Each block is one "
        "exam-relevant idea distilled to its smallest useful form.",
        BODY,
    ))
    for title, items in CHEAT_SHEET:
        block = [Paragraph(title, H3)]
        for it in items:
            block.append(Paragraph("• " + it, BULLET))
        story.append(KeepTogether(block))
    add_image(story, "08_error_categories.png", width=6.0 * inch)
    add_image(story, "06_hooks_vs_prompts.png", width=6.0 * inch)
    add_image(story, "07_sync_vs_batch.png", width=6.0 * inch)
    story.append(PageBreak())


def section_questions(story):
    story.append(Paragraph("6. Practice Questions with Explanations", H1))
    story.append(Paragraph(
        "These 20 questions cover the most common exam patterns across all 5 "
        "domains. Every answer below is the official correct option with the "
        "reason it beats the seductive alternatives.",
        BODY,
    ))
    for i, q in enumerate(QUESTIONS, start=1):
        block = [
            Paragraph(f"Q{i}. ({q['scenario']}) {q['stem']}", H3),
        ]
        for c in q["choices"]:
            block.append(Paragraph(c, BULLET))
        block.append(Paragraph(f"Answer: {q['answer']}", ANS))
        block.append(Paragraph("Why: " + q["explain"], EXPL))
        block.append(Spacer(1, 6))
        story.append(KeepTogether(block))
    story.append(PageBreak())


def section_exercises(story):
    story.append(Paragraph("7. Practical Exercises (Hands-on Labs)", H1))
    story.append(Paragraph(
        "Reading isn't enough — the exam asks you to choose between "
        "implementations. The fastest way to internalise the material is to "
        "BUILD the four reference systems below, in order.",
        BODY,
    ))
    for ex in PRACTICAL_EXERCISES:
        block = [
            Paragraph(ex["title"], H2),
            Paragraph(f"Domains: {ex['domains']}", SMALL),
        ]
        for s in ex["steps"]:
            block.append(Paragraph("• " + s, BULLET))
        story.append(KeepTogether(block))
    story.append(PageBreak())


def section_resources(story):
    story.append(Paragraph("8. Study Roadmap & Resources", H1))
    add_image(story, "14_roadmap.png", width=6.4 * inch)
    story.append(Paragraph("Official documentation to study", H2))
    docs = [
        "Claude API — Messages: platform.claude.com/docs/en/api/messages",
        "Claude API — Tool Use: platform.claude.com/docs/en/build-with-claude/tool-use",
        "Claude API — Message Batches: platform.claude.com/docs/en/build-with-claude/message-batches",
        "Agent SDK — Overview / Hooks / Subagents / Sessions: platform.claude.com/docs/en/agent-sdk/...",
        "Model Context Protocol: modelcontextprotocol.io (Tools, Resources, Servers)",
        "Claude Code — Memory / Skills / Hooks / Sub-agents / MCP / GitHub Actions / Headless: code.claude.com/docs/en/...",
        "Prompt Engineering Guide: platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
        "Anthropic Cookbook (code examples): github.com/anthropics/anthropic-cookbook",
    ]
    bullets(story, docs)

    story.append(Paragraph("Skilljar prep tracks (free)", H2))
    bullets(story, OFFICIAL_PREP_COURSES)

    story.append(Paragraph("Community & Video", H2))
    bullets(story, [
        "YouTube prep playlist (PLFz7SvAnfqLpjPCPJBkUy077BC5ecuE8c) — exam walkthroughs and demos.",
        "github.com/paullarionov/claude-certified-architect — community study guide & practice questions.",
        "claudecertifications.com — free study guide and practice questions.",
        "FlashGenius / Tutorialsdojo / DEV.to / Towards AI — domain primers and worked questions.",
    ])
    story.append(PageBreak())


def section_oos(story):
    story.append(Paragraph("9. Out-of-Scope Topics", H1))
    story.append(Paragraph(
        "Don't waste time on these — they will not appear on the exam. "
        "Knowing what NOT to study is itself a study tactic.",
        BODY,
    ))
    bullets(story, OUT_OF_SCOPE)
    story.append(PageBreak())


def section_glossary(story):
    story.append(Paragraph("10. Glossary", H1))
    g = [
        ("Agentic loop", "Send → check stop_reason → run tool on tool_use → loop. The model decides the next step."),
        ("AgentDefinition", "Agent SDK config object: name, description, system_prompt, allowed_tools."),
        ("CLAUDE.md", "Persistent instruction file for Claude Code. Loaded at user/project/directory levels."),
        (".claude/rules/", "Topical rule files with YAML frontmatter (paths globs) for conditional loading."),
        ("Coordinator", "The hub agent that decomposes work, delegates to subagents, aggregates results."),
        ("custom_id", "Per-request identifier in the Message Batches API for correlating responses & retries."),
        ("Edit tool", "Claude Code tool that replaces a unique substring in a file."),
        ("end_turn", "stop_reason value indicating Claude has finished its response."),
        ("fork_session", "Clone a session at a shared point so two branches diverge independently."),
        ("Hook", "Code that runs at a lifecycle event (PreToolUse / PostToolUse) — deterministic enforcement."),
        ("isError", "MCP response flag indicating a tool failure; pair with structured error metadata."),
        ("JSON Schema", "Structured-output contract used with tool_use; eliminates syntax errors."),
        ("Lost-in-the-middle", "LLM tendency to under-attend to information in the middle of long inputs."),
        ("MCP", "Model Context Protocol — open protocol exposing tools, resources, and prompts to a host."),
        ("Planning mode", "Claude Code mode that investigates without making changes; produces an approved plan."),
        ("PostToolUse hook", "Intercepts tool results before the model consumes them — normalisation, trimming."),
        ("PreToolUse hook", "Intercepts outgoing tool calls — block, redirect, enforce policy."),
        ("Resource (MCP)", "Read-only data exposed by an MCP server (catalogues, schemas, docs)."),
        ("SKILL.md", "Skill definition file under .claude/skills/<name>/ with frontmatter (context: fork, allowed-tools)."),
        ("stop_reason", "Field on Claude responses driving the agentic loop: end_turn, tool_use, max_tokens, stop_sequence."),
        ("Subagent", "Specialised agent spawned by the coordinator via the Task tool. Isolated context."),
        ("Task tool", "Built-in tool that spawns a subagent in the Agent SDK / Claude Code."),
        ("tool_choice", "auto | any | {type:tool,name:X} — controls forced tool calling."),
        ("tool_use", "API mechanism for Claude to request tool calls in a structured form."),
    ]
    rows = [[Paragraph(f"<b>{k}</b>", BODY), Paragraph(v, BODY)] for k, v in g]
    story.append(make_table([["Term", "Definition"]] + rows,
                            col_widths=[1.7 * inch, 4.7 * inch]))


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build():
    doc = BaseDocTemplate(
        OUT_PDF,
        pagesize=LETTER,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=1.0 * inch,
        bottomMargin=0.7 * inch,
        title="CCA-F Study Kit",
        author="Generated for the Claude Certified Architect — Foundations exam",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin,
                 doc.width, doc.height, id="normal")
    cover_template = PageTemplate(id="cover", frames=frame, onPage=on_cover)
    body_template = PageTemplate(id="body", frames=frame, onPage=on_page)
    doc.addPageTemplates([cover_template, body_template])

    story = []
    cover(story)
    # Switch to body template (after cover page break above)
    from reportlab.platypus import NextPageTemplate
    story.insert(0, NextPageTemplate("cover"))
    story.append(NextPageTemplate("body"))
    table_of_contents(story)
    section_overview(story)
    section_theory(story)
    section_domains(story)
    section_scenarios(story)
    section_cheatsheet(story)
    section_questions(story)
    section_exercises(story)
    section_resources(story)
    section_oos(story)
    section_glossary(story)
    doc.build(story)
    print("PDF built:", OUT_PDF, os.path.getsize(OUT_PDF), "bytes")


if __name__ == "__main__":
    build()
