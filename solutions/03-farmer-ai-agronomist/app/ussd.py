"""USSD menu state machine for feature-phone farmers.

USSD has hard limits: 182 chars per screen, max ~20s per leg before the
gateway times out. So the design is: short menus, no LLM call until the
farmer has selected a topic and typed a free-text question, and the
final answer is summarised to fit USSD screen size (or chunked).

We use the de-facto Africa's Talking USSD shape because it's the
dominant Nigerian USSD aggregator — same code works on Infobip / Hubtel
with field-name swaps.
"""

from __future__ import annotations

from dataclasses import dataclass


CROPS = ["Maize", "Rice", "Cassava", "Tomato", "Cowpea", "Yam"]
TOPICS = [
    ("plant", "When to plant"),
    ("fert", "Fertiliser"),
    ("pest", "Pest / disease"),
    ("price", "Today's price"),
    ("free", "Other (type question)"),
]


@dataclass
class USSDStep:
    """Result of advancing the menu one step."""

    response: str  # What to send back to the gateway (CON/END prefix already applied).
    farmer_question: str | None = None  # If set, caller should hit the LLM with this.
    crop: str | None = None
    topic: str | None = None


def _wrap(prefix: str, body: str) -> str:
    """Africa's Talking expects 'CON ...' to continue, 'END ...' to terminate."""
    return f"{prefix} {body}"


def render_menu(text: str) -> USSDStep:
    """Drive the USSD state machine off the cumulative `text` field.

    `text` is "" on first dial, then "1", "1*2", "1*2*3*plant my maize"
    as the farmer makes selections.
    """
    if not text:
        crop_lines = [f"{i + 1}. {c}" for i, c in enumerate(CROPS)]
        body = "Welcome to AgroNaija.\nChoose your crop:\n" + "\n".join(crop_lines)
        return USSDStep(response=_wrap("CON", body))

    parts = text.split("*")
    crop_idx_raw = parts[0]
    if not crop_idx_raw.isdigit() or not (1 <= int(crop_idx_raw) <= len(CROPS)):
        return USSDStep(response=_wrap("END", "Invalid crop. Dial again."))
    crop = CROPS[int(crop_idx_raw) - 1]

    if len(parts) == 1:
        topic_lines = [f"{i + 1}. {label}" for i, (_, label) in enumerate(TOPICS)]
        body = f"Crop: {crop}\nChoose topic:\n" + "\n".join(topic_lines)
        return USSDStep(response=_wrap("CON", body))

    topic_idx_raw = parts[1]
    if not topic_idx_raw.isdigit() or not (1 <= int(topic_idx_raw) <= len(TOPICS)):
        return USSDStep(response=_wrap("END", "Invalid topic. Dial again."))
    topic_key, _ = TOPICS[int(topic_idx_raw) - 1]

    if topic_key == "free":
        if len(parts) < 3 or not parts[2].strip():
            return USSDStep(
                response=_wrap("CON", "Type your question (max 160 chars):"),
                crop=crop,
                topic=topic_key,
            )
        question = "*".join(parts[2:]).strip()
        return USSDStep(
            response="",  # caller fills this in after LLM call
            farmer_question=question,
            crop=crop,
            topic=topic_key,
        )

    canned_question = {
        "plant": f"When should I plant {crop} in my state?",
        "fert": f"What fertiliser plan for {crop}?",
        "pest": f"Common pest or disease problem on my {crop}, and what to spray?",
        "price": f"What is today's market price for {crop}?",
    }[topic_key]

    return USSDStep(
        response="",  # caller fills this in after LLM call
        farmer_question=canned_question,
        crop=crop,
        topic=topic_key,
    )


def fit_to_ussd(text: str, max_chars: int = 160) -> str:
    """USSD screens cap around 182 chars; leave headroom for 'END '."""
    text = " ".join(text.split())  # collapse whitespace
    if len(text) <= max_chars:
        return text
    cut = text.rfind(" ", 0, max_chars - 3)
    if cut < 0:
        cut = max_chars - 3
    return text[:cut] + "..."
