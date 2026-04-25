"""Claude-backed agronomist reasoning.

Uses claude-opus-4-7 with adaptive thinking (the recommended config for
Opus 4.7) and prompt caching on the agronomy reference block — the
reference is large and stable, the farmer query is small and varies, so
caching cuts cost dramatically across thousands of farmer queries per day.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional

import anthropic

from .knowledge import KNOWLEDGE_BASE
from .languages import language_name


MODEL = "claude-opus-4-7"
ADAPTIVE_THINKING = {"type": "adaptive"}
EFFORT = {"effort": "medium"}


def _build_system(lang_code: str, state: Optional[str], crop: Optional[str]) -> list[dict]:
    """Build the system prompt as cacheable blocks.

    Block 1: persona + style + language directive (small, may vary by lang).
    Block 2: the agronomy knowledge base (large, frozen) — this gets the
             cache_control marker so it caches across all farmer queries.
    """
    persona = (
        "You are AgroNaija, an AI extension agent helping Nigerian "
        "smallholder farmers. You are warm, plain-spoken, and concrete. "
        "Always:\n"
        "  * answer in 4-8 short sentences max — most farmers read on "
        "    feature phones over slow networks;\n"
        "  * give one clear next action, with quantities and timing;\n"
        "  * if the question is unsafe (e.g. mixing pesticides, "
        "    self-medication for livestock), refuse and say why;\n"
        "  * if you don't know, say so and suggest visiting the nearest "
        "    ADP (Agricultural Development Programme) office.\n"
    )

    lang_directive = (
        f"Respond in {language_name(lang_code)}. Match the farmer's "
        "register — if they wrote in Pidgin, reply in Pidgin; if Yoruba, "
        "reply in Yoruba; etc. Do not switch languages mid-message."
    )

    location_hint = ""
    if state:
        location_hint += f"Farmer's state: {state}. "
    if crop:
        location_hint += f"Farmer's primary crop: {crop}. "
    if location_hint:
        location_hint = location_hint.strip() + "\n"

    return [
        {"type": "text", "text": persona + "\n" + lang_directive + "\n" + location_hint},
        {
            "type": "text",
            "text": "REFERENCE MATERIAL — use these facts when relevant:\n\n"
            + KNOWLEDGE_BASE,
            "cache_control": {"type": "ephemeral"},
        },
    ]


@dataclass
class AgentReply:
    text: str
    language: str
    input_tokens: int
    cache_read_input_tokens: int
    output_tokens: int


def get_client() -> anthropic.Anthropic:
    """Returns a configured Anthropic client.

    Reads ANTHROPIC_API_KEY from env.
    """
    return anthropic.Anthropic()


def answer_text_query(
    question: str,
    *,
    lang_code: str,
    state: Optional[str] = None,
    crop: Optional[str] = None,
    client: Optional[anthropic.Anthropic] = None,
) -> AgentReply:
    """Synchronous text -> text answer for a farmer's question."""
    client = client or get_client()
    system = _build_system(lang_code, state, crop)

    response = client.messages.create(
        model=MODEL,
        max_tokens=800,
        thinking=ADAPTIVE_THINKING,
        output_config=EFFORT,
        system=system,
        messages=[{"role": "user", "content": question}],
    )

    text = next((b.text for b in response.content if b.type == "text"), "")
    return AgentReply(
        text=text,
        language=lang_code,
        input_tokens=response.usage.input_tokens,
        cache_read_input_tokens=response.usage.cache_read_input_tokens or 0,
        output_tokens=response.usage.output_tokens,
    )


def answer_image_query(
    question: str,
    image_b64: str,
    image_media_type: str,
    *,
    lang_code: str,
    state: Optional[str] = None,
    crop: Optional[str] = None,
    client: Optional[anthropic.Anthropic] = None,
) -> AgentReply:
    """Vision call: farmer photographs a leaf / pest / lesion.

    Uses Opus 4.7 high-res vision (automatic; no opt-in needed) so leaf
    blemishes register at native resolution.
    """
    client = client or get_client()
    system = _build_system(lang_code, state, crop)

    response = client.messages.create(
        model=MODEL,
        max_tokens=900,
        thinking=ADAPTIVE_THINKING,
        output_config=EFFORT,
        system=system,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_media_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            f"{question}\n\n"
                            "Diagnose what you see in the photo. State the "
                            "single most-likely cause, what to do today, "
                            "and one 'do not do' warning."
                        ),
                    },
                ],
            }
        ],
    )

    text = next((b.text for b in response.content if b.type == "text"), "")
    return AgentReply(
        text=text,
        language=lang_code,
        input_tokens=response.usage.input_tokens,
        cache_read_input_tokens=response.usage.cache_read_input_tokens or 0,
        output_tokens=response.usage.output_tokens,
    )
