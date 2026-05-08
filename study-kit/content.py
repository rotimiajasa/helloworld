"""Source-of-truth content for the CCA-F study kit.

Synthesised from the official exam guide, the Anthropic Skilljar
"Claude Certified Architect — Foundations" prep tracks, the YouTube prep
playlist (PLFz7SvAnfqLpjPCPJBkUy077BC5ecuE8c), and the community study
guide at github.com/paullarionov/claude-certified-architect.
"""

EXAM_FACTS = {
    "name": "Claude Certified Architect — Foundations (CCA-F)",
    "duration_min": 120,
    "questions": 60,
    "scenarios": "4 of 8 scenarios are sampled per attempt",
    "format": "Multiple choice (1 correct of 4) — no guessing penalty",
    "scaled_score": "100 – 1000 scale; passing = 720",
    "delivery": "Online proctored via Anthropic Skilljar",
    "domains": [
        ("1. Agent Architecture & Orchestration", 27),
        ("2. Claude Code Configuration & Workflows", 20),
        ("3. Prompt Engineering & Structured Output", 20),
        ("4. Tool Design & MCP Integration", 18),
        ("5. Context Management & Reliability", 15),
    ],
    "scenarios_list": [
        "Customer Support Agent",
        "Code Generation with Claude Code",
        "Multi-agent Research System",
        "Developer Productivity Tools",
        "Claude Code for Continuous Integration",
        "Structured Data Extraction",
        "Conversational AI Architecture Patterns",
        "Agentic AI Tools",
    ],
}

OFFICIAL_PREP_COURSES = [
    "AI Fluency: Framework & Foundations",
    "Introduction to Agent Skills",
    "Building with the Claude API",
    "Claude Code in Action",
    "Intro to Model Context Protocol",
    "MCP: Advanced Topics",
    "Prompt Engineering Interactive Tutorial",
    "Real-world Prompting",
    "Tool Use with Claude",
    "Customer Service Agent (cookbook walkthrough)",
    "Multi-agent Research Pipelines",
    "Structured Data Extraction Workshop",
    "Claude Code in CI/CD",
]

# ---------------------------------------------------------------------------
# Theory chapters — flat list of (title, [paragraph or bullet, ...])
# ---------------------------------------------------------------------------
CHAPTERS = [
    (
        "1. Claude API — Fundamentals",
        [
            "Stateless: every request must include the FULL prior conversation in `messages`. The model has no server-side memory.",
            "Request fields: `model`, `max_tokens`, `system`, `messages`, `tools`, `tool_choice`.",
            "Roles: `user`, `assistant`, plus tool results (sent as a `tool_result` content block on a user-role message).",
            "stop_reason values you must handle: `end_turn` (final answer), `tool_use` (run the tool, append result, loop), `max_tokens` (truncated — increase limit), `stop_sequence`.",
            "System prompt: separate field; defines persistent role/constraints/format. Wording can create unintended tool associations (e.g. forcing overuse of get_customer).",
            "Context window includes system prompt + full history + tool definitions + tool results. Watch for: (a) lost-in-the-middle effect, (b) tool-result accumulation, (c) detail loss in progressive summarisation.",
        ],
    ),
    (
        "2. Tools and tool_use",
        [
            "tool_use lets Claude REQUEST a tool call (a structured JSON block); your code runs the function and feeds the result back.",
            "Tool description is the PRIMARY selection signal. Minimal descriptions ('Gets customer info') cause tool confusion.",
            "Each description should include: what it does/returns, input formats with examples, edge cases, when to use vs similar alternatives.",
            "Avoid overlapping descriptions across tools (e.g. analyze_content vs analyze_document). Rename to remove semantic overlap.",
            "Built-in tools may be preferred over MCP tools. Counter this by emphasising unique data/context that built-ins cannot access.",
            "tool_choice modes: `auto` (default), `any` (must call SOME tool — guarantees structured output), `{type:tool, name:X}` (force a specific first step).",
            "JSON Schema with tool_use is the most reliable way to get structured output. It eliminates SYNTAX errors but not SEMANTIC errors.",
            "Schema design: required only when always present; nullable types for optional info; `enum` with `other`+detail string and `unclear` for honest fallback.",
        ],
    ),
    (
        "3. Claude Agent SDK — Building Agentic Systems",
        [
            "Agentic loop: send → check stop_reason → if tool_use, run tool, append tool_result, loop → if end_turn, finish. The ONLY reliable completion signal is `stop_reason == 'end_turn'`.",
            "Anti-patterns: parsing assistant text for completion, using max_iterations as primary stop, treating presence of text content as 'done'.",
            "AgentDefinition fields: name, description, system_prompt, allowed_tools (least privilege).",
            "Hub-and-spoke: a coordinator owns decomposition, delegation, aggregation, error handling. All inter-agent comms route through the coordinator for observability.",
            "Subagents have ISOLATED context — they do NOT inherit the coordinator's history. Pass full required context explicitly in the Task prompt.",
            "Spawn subagents via the `Task` tool (must be in coordinator's `allowed_tools`). Multiple Task calls in one coordinator response run IN PARALLEL.",
            "Hooks intercept lifecycle events. `PostToolUse` normalises/trims tool results; `PreToolUse` blocks/redirects calls (e.g. block refunds > $500).",
            "Hooks provide DETERMINISTIC guarantees; prompts give PROBABILISTIC compliance. Use hooks for financial / legal / safety constraints.",
            "Sessions: `--resume <name>` continues prior context (risk: stale results). `fork_session` branches off a shared point for parallel approach exploration.",
        ],
    ),
    (
        "4. Model Context Protocol (MCP)",
        [
            "Open protocol that exposes Tools (actions), Resources (read-only data), and Prompts (templates) to a Claude host.",
            "When a host connects to an MCP server, all tools are auto-discovered and merged with tools from other connected servers.",
            "Project config: `.mcp.json` in repo root (in VCS). Use `${ENV_VAR}` substitution so secrets are NOT committed.",
            "User config: `~/.claude.json` for personal/experimental servers, NOT shared via VCS.",
            "Prefer existing community MCP servers (GitHub, Jira, Slack); build custom only for unique team workflows.",
            "Errors: set `isError: true` and return STRUCTURED metadata: `errorCategory` (transient/validation/business/permission), `isRetryable`, message, attempted_query, partial_results, alternative approaches. Generic 'Operation failed' breaks coordinator decision-making.",
            "Resources act as a 'map': agent reads catalogues / schemas / docs without exploratory tool calls.",
        ],
    ),
    (
        "5. Claude Code — Configuration & Workflows",
        [
            "CLAUDE.md hierarchy: User (~/.claude/CLAUDE.md) → Project (.claude/CLAUDE.md or root CLAUDE.md, in VCS) → Directory (subdir CLAUDE.md). Project-level guarantees teammates inherit standards.",
            "@path imports modularise CLAUDE.md (e.g. `@./standards/testing.md`). Max nesting depth is 5; relative paths resolve from the importing file.",
            ".claude/rules/ contains topical files with YAML frontmatter `paths` globs — loaded ONLY when editing matching files. Ideal for cross-cutting conventions like tests scattered across the codebase.",
            "Custom slash commands live in .claude/commands/ (project, in VCS) or ~/.claude/commands/ (personal).",
            "Skills (.claude/skills/<name>/SKILL.md) extend slash commands with frontmatter: `context: fork` (isolated subagent), `allowed-tools` (least privilege), `argument-hint` (prompts for arg).",
            "Personal skills at ~/.claude/skills/<name>/SKILL.md OVERRIDE same-named project skills for that user.",
            "Planning mode: investigate-only (Read/Grep/Glob), produces an approval-gated plan. Use for large changes, multiple approaches, architectural decisions, unfamiliar codebases.",
            "Direct execution: small, well-understood, single-file changes.",
            "Explore subagent: isolates verbose codebase exploration so it does not pollute main context.",
            "/compact: summarise prior history (risk: numeric/date precision loss). /memory: edit CLAUDE.md to persist facts across sessions.",
            "CI/CD: use `claude -p` (or --print) for non-interactive mode. Combine with --output-format json + --json-schema for parseable findings (e.g. inline PR comments via GitHub API).",
            "Use a SECOND independent Claude instance to review code generated by the first — avoids confirmation bias from generation context.",
            "When re-reviewing after new commits, include prior findings in context and instruct Claude to report only new/unresolved issues to avoid duplicate comments.",
        ],
    ),
    (
        "6. Prompt Engineering — Advanced Techniques",
        [
            "Few-shot (2–4 input/output examples) outperforms vague instructions for ambiguity, formatting, edge cases, informal measurements.",
            "Add normalisation rules (dates → ISO 8601, currency as numeric+code, percentages as decimal) to prevent semantic drift in structured output.",
            "Replace vague instructions with EXPLICIT criteria: what to flag vs ignore, severity definitions with code examples for each level.",
            "Prompt chaining: split tasks into sequential focused passes (e.g. per-file analysis then a cross-file integration pass) to avoid attention dilution.",
            "Use prompt chaining for predictable pipelines; use dynamic decomposition for open-ended investigations.",
            "Interview pattern: Claude asks clarifying questions before implementing in unfamiliar domains or when multiple viable approaches exist.",
            "Validation + retry-with-feedback: re-prompt with the original document, the prior wrong extraction, and the specific validation error. Pydantic is the canonical validation tool.",
            "Retry helps with format/structural/arithmetic issues; it does NOT help when the information is absent from the source.",
            "Self-correction: extract `stated_total` AND `calculated_total`; flag `conflict_detected: true` for downstream handling.",
        ],
    ),
    (
        "7. Message Batches API",
        [
            "50% cost saving vs synchronous; processing window up to 24h with NO latency SLA.",
            "Batch is asynchronous and 'fire-and-forget' — multi-turn tool calling within one request is NOT supported (a fundamental limit).",
            "`custom_id` correlates each request with its response; on partial failure, resubmit only the failed custom_ids.",
            "Decision rule: blocking workflow (pre-merge, interactive review, agent loops) → synchronous. Scheduled workload (overnight reports, weekly audits, bulk extraction) → batch.",
            "SLA planning: if you need results in 30h and batches take up to 24h, your submission window is the remaining 6h.",
        ],
    ),
    (
        "8. Task Decomposition Strategies",
        [
            "Fixed pipeline (prompt chaining): every step pre-defined — extract metadata → extract data → validate → enrich → output.",
            "Dynamic adaptive decomposition: subtasks are generated from intermediate findings (legacy test coverage analysis, exploratory investigations).",
            "Multi-pass code review: per-file local analysis + a separate cross-file integration pass. Larger context windows do NOT fix attention dilution — focused passes do.",
            "Avoid 'consensus over multiple full reviews' — it suppresses real bugs by demanding agreement across inconsistent runs.",
        ],
    ),
    (
        "9. Escalation & Human-in-the-Loop",
        [
            "Reliable triggers: explicit human request, policy gap (request not covered), inability to make progress, financial threshold (enforce via HOOK), multiple matches when identifying a customer.",
            "Unreliable triggers: sentiment analysis (mood ≠ complexity), self-rated confidence 1–10 (poorly calibrated — model can be confidently wrong), bespoke trained classifiers (over-engineering).",
            "Pattern: acknowledge emotion → propose concrete resolution → escalate only if customer reiterates the desire for a human (or explicitly asks first time).",
            "Structured handoff to human: customer_id, name, issue_summary, order_id, root_cause, actions_taken[], refund_amount, recommended_action, escalation_reason. Operators see ONLY this — make it self-contained.",
            "Confidence calibration: per-field scores; calibrate against labelled validation set; route low confidence to human review.",
            "Stratified random sampling: a 97% aggregate accuracy can hide 40% errors on a specific document type.",
        ],
    ),
    (
        "10. Error Handling in Multi-agent Systems",
        [
            "Categories: Transient (retry w/ backoff), Validation (fix input & retry), Business (explain + alternative), Permission (escalate).",
            "Subagent does LOCAL recovery (1–2 retries) for transient failures; only propagates non-recoverable errors to coordinator.",
            "Anti-patterns: generic 'service unavailable' status (no recovery info), silent suppression (empty result == success), aborting whole workflow on one failure, infinite subagent retries.",
            "Distinguish ACCESS FAILURE (timeout — retry decision) from VALID EMPTY RESULT ('0 results' — successful query).",
            "Coverage annotations in synthesis: 'FULL COVERAGE' / 'PARTIAL COVERAGE — search timeout' to communicate uncertainty downstream.",
        ],
    ),
    (
        "11. Context Management in Production",
        [
            "Extract a Case-Facts block (customer_id, order_id, amounts, dates, issue, request, status) and pin it OUTSIDE the summarised history.",
            "Trim verbose tool results via PostToolUse hook (40+ fields → keep 5).",
            "Position-aware input: KEY FINDINGS at the TOP, action items at the BOTTOM, detailed results in middle with explicit headings (mitigates lost-in-the-middle).",
            "Scratchpad files (e.g. investigation-scratchpad.md) survive context boundaries and new sessions.",
            "Delegate exploratory work to subagents (Explore subagent) — keeps main context clean.",
            "Constrained subagent budgets: minimal context, structured-only return, restricted allowed_tools.",
            "Crash recovery: each subagent persists state to agent-state/<name>.json; coordinator reads manifest.json on resume.",
        ],
    ),
    (
        "12. Provenance Preservation in Multi-source Synthesis",
        [
            "Always preserve claim → source mappings (URL, source name, publication date, methodology) — do not let attribution dissolve in summarisation.",
            "Conflicting data: keep both values with attribution; let the coordinator decide (do not arbitrarily pick one).",
            "Include dates so temporal differences are not misread as contradictions.",
            "Render by content type: tables for financial, prose for analysis, structured lists for technical findings, chronological for time series.",
        ],
    ),
    (
        "13. Claude Code Built-in Tools",
        [
            "Glob — find files by name/extension pattern (`**/*.test.tsx`).",
            "Grep — search WITHIN file contents (function names, errors, imports).",
            "Read — full file load. Write — create new file. Edit — precise replace via unique string match.",
            "When Edit fails on non-unique match: fall back to Read → modify in memory → Write.",
            "Investigation strategy: incremental — Grep for entry points → Read those files → Grep for usages → Read consumers → repeat until full picture.",
        ],
    ),
]

# ---------------------------------------------------------------------------
# Per-domain notes
# ---------------------------------------------------------------------------
DOMAINS = [
    {
        "title": "Domain 1 — Agent Architecture & Orchestration (27%)",
        "topics": [
            ("Designing Agentic Loops", [
                "Lifecycle: send → stop_reason check → tool_use vs end_turn → loop with appended tool_result.",
                "Model-driven, not hard-coded decision tree.",
                "Anti-patterns: text-parsing for completion, max_iterations as primary stop.",
            ]),
            ("Multi-agent Orchestration", [
                "Hub-and-spoke topology with coordinator-mediated communication for observability.",
                "Subagents have ISOLATED context — pass everything explicitly.",
                "Coordinator owns dynamic subagent selection, error handling, aggregation.",
                "Watch for OVERLY NARROW decomposition (assigning subtasks that miss whole subdomains).",
            ]),
            ("Subagent Spawning & Context Passing", [
                "Task tool spawns subagents (must be in coordinator's allowed_tools).",
                "Multiple Task calls in one turn run in parallel.",
                "Pass full required outputs from prior agents — never assume inheritance.",
                "Coordinator prompts: state goals + quality criteria, not step-by-step instructions.",
            ]),
            ("Multi-step Workflows: Enforcement vs Guidance", [
                "Programmatic preconditions (block lookup_order until get_customer returns a verified ID) > prompt instructions for critical sequences.",
                "Structured handoff payloads on escalation.",
            ]),
            ("Agent SDK Hooks", [
                "PostToolUse: normalise dates, trim noisy fields.",
                "PreToolUse: block policy-violating calls; redirect to escalation.",
                "Hooks deterministic; prompts probabilistic.",
            ]),
            ("Task Decomposition", [
                "Fixed pipelines (prompt chaining) vs dynamic adaptive decomposition.",
                "Per-file + integration passes for multi-file code review.",
            ]),
            ("Sessions: Resume & Fork", [
                "--resume continues; fork_session branches.",
                "Prefer fresh session with summary when results are stale.",
            ]),
        ],
    },
    {
        "title": "Domain 2 — Tool Design & MCP Integration (18%)",
        "topics": [
            ("Tool Interface Design", [
                "Descriptions are the primary selection mechanism; include input formats, examples, edge cases, boundaries.",
                "Eliminate functional overlap by RENAMING (e.g. analyze_content → extract_web_results).",
                "Split general-purpose tools (fetch_url) into specialised ones (load_document with URL validation) — least privilege at the interface.",
            ]),
            ("Structured Error Responses", [
                "isError: true with errorCategory, isRetryable, message, attempted_query, partial_results, alternative_approaches.",
                "Distinguish access failures from valid empty results.",
                "Local recovery in subagents; propagate only what they can't resolve.",
            ]),
            ("Tool Allocation & tool_choice", [
                "≤ ~5 well-scoped tools per agent; more than that hurts selection reliability.",
                "Subagent toolset matches its role.",
                "tool_choice 'any' guarantees structured output; force a specific tool to enforce a first step.",
            ]),
            ("MCP Configuration", [
                "Project .mcp.json (in VCS, ${ENV} for secrets) vs user ~/.claude.json (private).",
                "Tools from all connected servers are merged.",
                "Resources are read-only context maps.",
            ]),
            ("Built-in Tools", [
                "Grep / Glob / Read / Write / Edit / Bash purposes.",
                "Read+Write fallback when Edit can't find a unique match.",
            ]),
        ],
    },
    {
        "title": "Domain 3 — Claude Code Configuration & Workflows (20%)",
        "topics": [
            ("CLAUDE.md Hierarchy", [
                "User → Project → Directory levels merge.",
                "Project-level (in VCS) is the only level new teammates inherit automatically.",
                "@path imports modularise; .claude/rules/ scopes via glob frontmatter.",
            ]),
            ("Custom Slash Commands & Skills", [
                ".claude/commands/ (legacy) and .claude/skills/<name>/SKILL.md (current) — both produce /name.",
                "Frontmatter: context: fork, allowed-tools, argument-hint.",
                "Personal ~/.claude/skills/<name>/SKILL.md overrides project skill for that user.",
            ]),
            ("Path-specific Rules", [
                ".claude/rules/<topic>.md with `paths: ['**/*.test.tsx']`.",
                "Loaded only when editing matching files — saves tokens.",
                "Better than dir-level CLAUDE.md when conventions span many directories (tests, migrations).",
            ]),
            ("Planning Mode vs Direct Execution", [
                "Plan first for large/architectural/multiple-approach changes.",
                "Direct for clear single-file fixes.",
                "Combine: plan, get approval, execute.",
            ]),
            ("Iterative Refinement", [
                "Concrete I/O examples > prose specs.",
                "Test-driven iteration; interview pattern for unknowns.",
            ]),
            ("CI/CD Integration", [
                "claude -p for non-interactive mode.",
                "--output-format json + --json-schema → parseable PR comments.",
                "Independent reviewer instance avoids confirmation bias.",
                "Include prior findings to suppress duplicate comments on follow-up commits.",
            ]),
        ],
    },
    {
        "title": "Domain 4 — Prompt Engineering & Structured Output (20%)",
        "topics": [
            ("Explicit Criteria", [
                "Replace 'be conservative' with categorical rules and severity definitions tied to code examples.",
                "Disable categories with high false-positive rates to restore developer trust.",
            ]),
            ("Few-shot Prompting", [
                "2–4 targeted examples with rationale for ambiguous decisions.",
                "Show output format AND distinguish acceptable vs problematic patterns.",
            ]),
            ("Structured Output via tool_use + JSON Schema", [
                "Eliminates SYNTAX errors; not semantic ones.",
                "Mark optional fields nullable so the model returns null rather than fabricating.",
                "Use enums with `other` + detail and `unclear` to capture out-of-distribution cases.",
                "tool_choice 'any' for guaranteed call; force specific tool to lock the first step.",
            ]),
            ("Validation, Retries, Feedback", [
                "Retry-with-error-feedback: original doc + wrong extraction + concrete error message.",
                "Pydantic semantic validators for business rules (sum(items) == total, start < end).",
                "Self-correction: stated_total + calculated_total + conflict_detected.",
            ]),
            ("Batch Processing Strategies", [
                "Sync vs Batch decision = blocking vs scheduled.",
                "Iterate prompts on a sample BEFORE bulk processing.",
                "Resubmit failed custom_ids only.",
            ]),
            ("Multi-instance / Multi-pass Review", [
                "Independent reviewer Claude instance.",
                "Per-file + integration pass for multi-file PRs.",
            ]),
        ],
    },
    {
        "title": "Domain 5 — Context Management & Reliability (15%)",
        "topics": [
            ("Conversation Context", [
                "Send full history every request — model is stateless.",
                "Lost-in-the-middle: critical info goes at top or bottom.",
                "Trim verbose tool outputs via PostToolUse hook.",
                "Pin transactional facts in a Case-Facts block outside summarisation.",
            ]),
            ("Escalation & Ambiguity", [
                "Reliable triggers; ask for additional identifier on multiple matches; immediate handoff on explicit human request.",
            ]),
            ("Error Propagation", [
                "Structured error context, partial results, alternative approaches.",
                "Distinguish access failure from empty result.",
                "Coverage annotations in synthesis output.",
            ]),
            ("Large-codebase Context Efficiency", [
                "Explore subagent isolates discovery output.",
                "Scratchpad files preserve findings across sessions.",
                "/compact when verbose; /memory persists across sessions via CLAUDE.md.",
            ]),
            ("Human Oversight & Confidence Calibration", [
                "Field-level confidence scores; calibrate on labelled set.",
                "Stratified random sampling — analyse accuracy per document type / field.",
            ]),
            ("Provenance Preservation", [
                "claim → source mappings; preserve conflicting values with attribution.",
                "Always include publication dates.",
            ]),
        ],
    },
]

# ---------------------------------------------------------------------------
# Cheat sheet
# ---------------------------------------------------------------------------
CHEAT_SHEET = [
    ("Stop reasons", [
        "end_turn → finished (only reliable completion signal)",
        "tool_use → run tool, append tool_result, loop",
        "max_tokens → truncated; raise limit",
        "stop_sequence → application-specific",
    ]),
    ("tool_choice", [
        '"auto" → model decides text vs tool (default)',
        '"any" → must call SOME tool (guarantees structured output)',
        '{"type":"tool","name":"X"} → must call X (force first step)',
    ]),
    ("Hooks vs Prompts", [
        "Hooks: deterministic 100% — financial, legal, safety, compliance",
        "Prompts: probabilistic — preferences, formatting, soft policy",
    ]),
    ("Subagents (Task tool)", [
        "Coordinator's allowed_tools must include 'Task'",
        "ISOLATED context — pass everything explicitly",
        "Multiple Task calls in ONE turn run in PARALLEL",
        "Return STRUCTURED data, not raw dumps",
    ]),
    ("MCP error envelope", [
        "isError: true",
        "errorCategory: transient | validation | business | permission",
        "isRetryable: bool",
        "attempted_query, partial_results, alternative_approaches",
    ]),
    ("CLAUDE.md scope", [
        "User: ~/.claude/CLAUDE.md (private)",
        "Project: .claude/CLAUDE.md or root CLAUDE.md (in VCS — only level teammates inherit)",
        "Directory: <subdir>/CLAUDE.md (scoped to that area)",
        "Modularise via @path or .claude/rules/<topic>.md",
    ]),
    (".claude/rules/ frontmatter", [
        "paths: ['src/api/**/*.ts'] — load only when editing matching files",
        "Use for cross-cutting conventions (tests scattered across repo)",
    ]),
    ("Skill frontmatter", [
        "context: fork → isolated subagent (avoid main-context pollution)",
        "allowed-tools: ['Read','Grep'] → least privilege",
        "argument-hint: 'Path to analyse'",
    ]),
    ("CI/CD CLI", [
        "claude -p (or --print) — non-interactive",
        "--output-format json + --json-schema — parseable findings",
        "Run a SECOND independent instance to review (avoids confirmation bias)",
        "Include prior findings to avoid duplicate comments on follow-up commits",
    ]),
    ("Sync vs Batch", [
        "Sync: blocking workflows, agent loops with multi-turn tool use, real-time UX",
        "Batch (50% off, ≤24h): overnight reports, weekly audits, bulk extraction",
        "Batch does NOT support multi-turn tool calling within one request",
    ]),
    ("Escalation triggers (reliable)", [
        "Explicit human request",
        "Policy gap / silent on request",
        "Cannot make progress",
        "Financial threshold (enforce via hook)",
        "Multiple customer matches → ask for additional identifier",
    ]),
    ("Anti-patterns to recognise", [
        "Parsing assistant text for completion (use stop_reason)",
        "max_iterations as primary stop",
        "Generic 'operation failed' error responses",
        "Aborting whole workflow on one subagent failure",
        "Sentiment analysis for escalation",
        "Self-rated confidence 1–10 for routing",
        "Single-pass review of 14 files (attention dilution)",
        "Treating empty result == access failure",
    ]),
]

# ---------------------------------------------------------------------------
# Practice questions (curated; full pool in Appendix)
# ---------------------------------------------------------------------------
QUESTIONS = [
    {
        "scenario": "Customer Support Agent",
        "stem": "Logs show that in 12% of cases the agent skips get_customer and calls lookup_order using only the customer-provided name, leading to incorrect refunds. Which change is MOST effective?",
        "choices": [
            "A. Add a programmatic precondition that blocks lookup_order and process_refund until get_customer returns a verified ID",
            "B. Strengthen the system prompt requiring verification first",
            "C. Add few-shot examples of correct sequencing",
            "D. Add a routing classifier",
        ],
        "answer": "A",
        "explain": "Critical sequencing must be deterministic. Hooks/preconditions guarantee 100% compliance; prompts (B,C) are probabilistic. D solves a different problem (availability, not ordering).",
    },
    {
        "scenario": "Customer Support Agent",
        "stem": "Agent often calls get_customer instead of lookup_order for order questions; tool descriptions are minimal and similar. First step?",
        "choices": [
            "A. Add few-shot examples",
            "B. Expand each tool description with input formats, examples, edge cases, boundaries",
            "C. Add a routing layer",
            "D. Merge the tools",
        ],
        "answer": "B",
        "explain": "Descriptions are the model's primary selection mechanism — fix the root cause first. Lowest-effort, highest-impact.",
    },
    {
        "scenario": "Customer Support Agent",
        "stem": "Agent resolves only 55% of issues vs 80% target; escalates simple cases and tries to handle complex policy exceptions. How to improve calibration?",
        "choices": [
            "A. Explicit escalation criteria with few-shot examples",
            "B. Self-rated confidence 1–10 with auto-escalation",
            "C. Train a separate classifier",
            "D. Sentiment analysis",
        ],
        "answer": "A",
        "explain": "Decision-boundary problem → explicit criteria + examples. Self-rated confidence is poorly calibrated; sentiment ≠ complexity; classifier is over-engineering.",
    },
    {
        "scenario": "Code Generation with Claude Code",
        "stem": "You need a /review slash command available to the whole team after cloning the repo. Where do you put it?",
        "choices": [
            "A. .claude/commands/ in the project repo",
            "B. ~/.claude/commands/",
            "C. Root CLAUDE.md",
            "D. .claude/config.json",
        ],
        "answer": "A",
        "explain": "Project-level commands in VCS are inherited by every clone. ~/ is personal-only.",
    },
    {
        "scenario": "Code Generation with Claude Code",
        "stem": "You need to restructure a monolith into microservices (dozens of files, boundary decisions). Approach?",
        "choices": [
            "A. Planning mode: explore → understand dependencies → design",
            "B. Direct execution incrementally",
            "C. Direct execution with detailed up-front instructions",
            "D. Direct execution; switch to planning when it gets hard",
        ],
        "answer": "A",
        "explain": "Planning mode is designed for large, multi-approach, architectural changes. B/C/D risk expensive rework.",
    },
    {
        "scenario": "Code Generation with Claude Code",
        "stem": "Codebase has different conventions per area; tests are co-located with code. You want conventions auto-applied. Best approach?",
        "choices": [
            "A. .claude/rules/ files with YAML frontmatter `paths` glob patterns",
            "B. Put everything in root CLAUDE.md",
            "C. Skills in .claude/skills/",
            "D. CLAUDE.md in every directory",
        ],
        "answer": "A",
        "explain": "paths-scoped rules load only when editing matching files — ideal for cross-cutting conventions like tests scattered across the codebase.",
    },
    {
        "scenario": "Multi-agent Research System",
        "stem": "Reports cover only visual art; coordinator decomposed into 'AI in digital art', 'AI in graphic design', 'AI in photography'. Likely root cause?",
        "choices": [
            "A. Synthesis agent doesn't detect gaps",
            "B. Coordinator decomposed too narrowly",
            "C. Web-search agent isn't thorough",
            "D. Document analysis filters out non-visual sources",
        ],
        "answer": "B",
        "explain": "Subagents executed correctly — the issue is what they were assigned. Watch for coordinator decomposition that misses whole subdomains.",
    },
    {
        "scenario": "Multi-agent Research System",
        "stem": "A web-search subagent times out. Best error propagation to coordinator?",
        "choices": [
            "A. Structured error: failure_type, query, partial_results, alternative_approaches",
            "B. Internal retries, then return generic 'search unavailable'",
            "C. Catch the timeout and return empty result marked successful",
            "D. Propagate timeout exception, terminate workflow",
        ],
        "answer": "A",
        "explain": "Coordinator needs context to choose: retry/alternative/partial/skip. B hides info; C masks failure; D over-aborts.",
    },
    {
        "scenario": "Multi-agent Research System",
        "stem": "Document agent hits 2 contradictory credible sources for a key statistic. Best handling?",
        "choices": [
            "A. Apply credibility heuristics, footnote the discrepancy",
            "B. Include both, unmarked, let synthesis decide",
            "C. Stop and ask coordinator which is authoritative",
            "D. Complete with both values, explicitly annotate the conflict with attribution, let coordinator reconcile",
        ],
        "answer": "D",
        "explain": "Preserve both values + attribution; reconciliation is the coordinator's job (broader context).",
    },
    {
        "scenario": "Multi-agent Research System",
        "stem": "fetch_url on the document analysis agent is being misused for ad-hoc web search. Most effective fix?",
        "choices": [
            "A. Replace fetch_url with load_document that validates URLs are document formats",
            "B. Remove fetch_url, route all URL fetches via coordinator/web-search agent",
            "C. Block known search-engine domains",
            "D. Add prompt instructions saying 'don't use for search'",
        ],
        "answer": "A",
        "explain": "Constrain capability at the interface — least privilege. Makes misuse architecturally impossible, not merely discouraged.",
    },
    {
        "scenario": "Claude Code for CI",
        "stem": "Pipeline runs `claude \"Analyze this PR for security issues\"` and hangs. Fix?",
        "choices": [
            "A. Use --batch flag",
            "B. Use -p (or --print) flag",
            "C. Redirect stdin from /dev/null",
            "D. Set CLAUDE_HEADLESS=true",
        ],
        "answer": "B",
        "explain": "-p / --print is the documented non-interactive mode for CI/CD.",
    },
    {
        "scenario": "Claude Code for CI",
        "stem": "Manager wants to move BOTH (1) blocking pre-merge checks and (2) overnight tech-debt reports to Batch API for 50% savings. How to evaluate?",
        "choices": [
            "A. Move both to batch with polling",
            "B. Use sync for pre-merge checks; batch for overnight reports",
            "C. Keep both sync to avoid ordering issues",
            "D. Move both to batch with sync fallback",
        ],
        "answer": "B",
        "explain": "Batch up to 24h is unsuitable for blocking workflows where developers wait, but ideal for overnight scheduled work.",
    },
    {
        "scenario": "Claude Code for CI",
        "stem": "Iterative review uses tool calls to fetch related files. Why is Batch API fundamentally unsuitable here?",
        "choices": [
            "A. Batch lacks correlation IDs",
            "B. Async fire-and-forget cannot intercept tool calls mid-request",
            "C. Batch doesn't support tools in request params",
            "D. 24h latency is too slow",
        ],
        "answer": "B",
        "explain": "Batch is single request → single response. Multi-turn tool calling within one logical interaction needs synchronous round trips.",
    },
    {
        "scenario": "Claude Code for CI",
        "stem": "Findings are accurate but not actionable ('complex routing logic', 'potential null pointer'). Adding instructions doesn't help. Most reliable fix?",
        "choices": [
            "A. More explicit instructions",
            "B. Larger context window",
            "C. Two-pass: identify, then generate fixes",
            "D. 3–4 few-shot examples showing the exact required format (issue, location, concrete fix)",
        ],
        "answer": "D",
        "explain": "Instruction-only changes produce inconsistency; concrete examples lock in format reliably.",
    },
    {
        "scenario": "Structured Data Extraction",
        "stem": "After two iterations, output structure still mismatches expectations (nesting, timestamp format). Best next step?",
        "choices": [
            "A. JSON schema validation after each iteration",
            "B. Provide 2–3 concrete input/output examples of the expected transformation",
            "C. Rewrite requirements with more technical precision",
            "D. Ask Claude to explain its current understanding",
        ],
        "answer": "B",
        "explain": "Examples remove prose ambiguity directly. Schema validation enforces structure but not the desired mapping.",
    },
    {
        "scenario": "Conversational AI Architecture Patterns",
        "stem": "Two messages after the user said 'I love jazz', Claude asks 'What genres do you enjoy?' Most likely cause?",
        "choices": [
            "A. Need a vector DB for memory",
            "B. Context window exceeded",
            "C. Claude API needs session_id",
            "D. Application isn't including prior messages in the messages array",
        ],
        "answer": "D",
        "explain": "Claude is stateless. Every request must include the full prior history.",
    },
    {
        "scenario": "Conversational AI Architecture Patterns",
        "stem": "remove_team_member has dry_run; agent bypasses preview by calling dry_run=false directly. Most reliable enforcement?",
        "choices": [
            "A. Server-side validation requiring a preceding dry_run within 60s",
            "B. Mark the tool as 'requires confirmation' in orchestration",
            "C. Detailed instructions + few-shot in tool description",
            "D. Two tools: preview_remove_member returns a single-use confirmation token; execute_remove_member requires that token",
        ],
        "answer": "D",
        "explain": "Token-binding makes execution architecturally impossible without a preview — code-level enforcement, not LLM compliance.",
    },
    {
        "scenario": "Conversational AI Architecture Patterns",
        "stem": "Production: customers reference '15% discount mentioned earlier' but the agent cites wrong values; details were 20+ turns ago and got summarised vaguely. Best fix?",
        "choices": [
            "A. Raise summarisation threshold to 85%",
            "B. Store full history externally and retrieve on 'as I mentioned'",
            "C. Extract transactional facts (amounts, dates, IDs) into a persistent Case-Facts block included every prompt",
            "D. Revise summarisation prompt to preserve numbers verbatim",
        ],
        "answer": "C",
        "explain": "Summarisation inevitably loses precision. Pin facts OUTSIDE the summarisable history so they're always present.",
    },
    {
        "scenario": "Customer Support Agent",
        "stem": "Tools return Unix timestamps, ISO dates, numeric status codes; some tools are 3rd-party MCP servers you cannot modify. Most maintainable normalisation?",
        "choices": [
            "A. PostToolUse hook intercepts outputs and normalises before the agent sees them",
            "B. Modify tools you control + wrap 3rd-party",
            "C. A normalize_data tool the agent calls after each retrieval",
            "D. Document formats in the system prompt",
        ],
        "answer": "A",
        "explain": "Centralised, deterministic, code-level transformation that works uniformly regardless of source.",
    },
    {
        "scenario": "Customer Support Agent",
        "stem": "Agent loop: when do you stop calling Claude vs continue with another tool result?",
        "choices": [
            "A. Check stop_reason: continue on tool_use, stop on end_turn",
            "B. Parse text for 'I'm done' / 'anything else?'",
            "C. Stop after max iterations",
            "D. Stop if assistant produced any text content",
        ],
        "answer": "A",
        "explain": "stop_reason is the explicit, reliable signal. Everything else is heuristic and breaks.",
    },
]

# ---------------------------------------------------------------------------
# Out-of-scope
# ---------------------------------------------------------------------------
OUT_OF_SCOPE = [
    "Fine-tuning / training custom models",
    "API authentication, billing, account management",
    "Language/framework-specific implementation details (beyond schema/tool config)",
    "Hosting / infrastructure for MCP servers",
    "Claude internals (training, weights, RLHF, Constitutional AI)",
    "Embeddings & vector DB implementation details",
    "Computer use / browser automation",
    "Vision / image analysis",
    "Streaming API / SSE",
    "Rate limiting & quotas / detailed cost calculations",
    "OAuth, key rotation, auth protocol details",
    "Cloud-provider specific configurations (AWS / GCP / Azure)",
    "Performance benchmarks / model comparisons",
    "Prompt caching implementation details (beyond knowing it exists)",
    "Tokenisation specifics",
]

PRACTICAL_EXERCISES = [
    {
        "title": "Exercise 1 — Multi-tool Agent with Escalation",
        "domains": "1, 2, 5",
        "steps": [
            "Define 3–4 MCP tools with rich descriptions (include 2 similar to test selection).",
            "Implement an agent loop checking stop_reason (tool_use vs end_turn).",
            "Add structured error responses (errorCategory, isRetryable, message).",
            "Add a PreToolUse hook blocking refunds > $500 and routing to escalation.",
            "Test with a multi-aspect customer request (refund + shipping update).",
        ],
    },
    {
        "title": "Exercise 2 — Claude Code for Team Development",
        "domains": "3, 2",
        "steps": [
            "Project-level CLAUDE.md with universal standards.",
            ".claude/rules/ files with paths globs (api, tests, deployments).",
            "A skill at .claude/skills/<name>/SKILL.md with context: fork and allowed-tools.",
            ".mcp.json with ${ENV} substitution for a community server (GitHub).",
            "Test planning mode vs direct execution on tasks of different sizes.",
        ],
    },
    {
        "title": "Exercise 3 — Structured Data Extraction Pipeline",
        "domains": "4, 5",
        "steps": [
            "Define an extraction tool with JSON schema (required/nullable/enum with 'other').",
            "Validation loop: on error, retry with original document + wrong extraction + concrete error.",
            "Few-shot examples for inline citations vs bibliography references vs informal measurements.",
            "Batch run via Message Batches API on 100 docs; resubmit failed custom_ids only.",
            "Field-level confidence; route low-confidence and ambiguous-source docs to human review.",
        ],
    },
    {
        "title": "Exercise 4 — Multi-agent Research Pipeline",
        "domains": "1, 2, 5",
        "steps": [
            "Coordinator with allowed_tools=['Task', ...]; 2+ subagents (web search + doc analysis).",
            "Spawn subagents in parallel via multiple Task calls in one coordinator turn.",
            "Require structured subagent output: claim, quote, source URL, publication date.",
            "Simulate a subagent timeout — return structured error context, continue with partial results, annotate coverage in synthesis.",
            "Test with conflicting data — preserve both values with attribution.",
        ],
    },
]
