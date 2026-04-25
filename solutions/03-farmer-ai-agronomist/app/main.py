from __future__ import annotations

import os

from fastapi import Depends, FastAPI, Form, Header, HTTPException, status
from fastapi.responses import PlainTextResponse

from . import llm
from .languages import detect_language
from .models import ImageQuery, TextQuery, TextReply, USSDRequest
from .ussd import fit_to_ussd, render_menu

app = FastAPI(
    title="Naija Farmer AI Agronomist",
    version="0.1.0",
    description=(
        "Multilingual AI agronomist for Nigerian smallholder farmers. "
        "Reachable via WhatsApp, USSD, and SMS bridges."
    ),
)


def _require_api_key(x_api_key: str | None = Header(default=None)) -> str:
    expected = os.getenv("AGRO_API_KEY")
    if expected is None:
        return "demo"
    if x_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid api key"
        )
    return x_api_key


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model": llm.MODEL}


@app.post("/v1/chat", response_model=TextReply)
def chat(
    q: TextQuery, _: str = Depends(_require_api_key)
) -> TextReply:
    lang = q.language_hint or detect_language(q.question)
    reply = llm.answer_text_query(
        q.question, lang_code=lang, state=q.state, crop=q.crop
    )
    return TextReply(
        text=reply.text,
        language=reply.language,
        usage={
            "input_tokens": reply.input_tokens,
            "cache_read_input_tokens": reply.cache_read_input_tokens,
            "output_tokens": reply.output_tokens,
        },
    )


@app.post("/v1/diagnose", response_model=TextReply)
def diagnose(
    q: ImageQuery, _: str = Depends(_require_api_key)
) -> TextReply:
    lang = q.language_hint or detect_language(q.question)
    reply = llm.answer_image_query(
        q.question,
        q.image_b64,
        q.image_media_type,
        lang_code=lang,
        state=q.state,
        crop=q.crop,
    )
    return TextReply(
        text=reply.text,
        language=reply.language,
        usage={
            "input_tokens": reply.input_tokens,
            "cache_read_input_tokens": reply.cache_read_input_tokens,
            "output_tokens": reply.output_tokens,
        },
    )


@app.post("/v1/ussd", response_class=PlainTextResponse)
def ussd(req: USSDRequest, _: str = Depends(_require_api_key)) -> str:
    """USSD webhook compatible with Africa's Talking gateway shape."""
    step = render_menu(req.text)
    if step.farmer_question is None:
        return step.response

    lang = detect_language(step.farmer_question)
    answer = llm.answer_text_query(
        step.farmer_question, lang_code=lang, crop=step.crop
    )
    return f"END {fit_to_ussd(answer.text)}"


@app.post("/v1/whatsapp/webhook", response_class=PlainTextResponse)
async def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(""),
    NumMedia: str = Form("0"),
    MediaUrl0: str = Form(""),
    MediaContentType0: str = Form(""),
    _: str = Depends(_require_api_key),
) -> str:
    """Twilio-compatible WhatsApp webhook.

    Production deploy fetches MediaUrl0, base64-encodes, and forwards to
    /v1/diagnose. For the MVP we hand off to /v1/chat for text, and
    return a friendly reply to the farmer in TwiML XML in production —
    this stub returns plain text for inspection.
    """
    if int(NumMedia) > 0 and MediaUrl0:
        # In prod: download MediaUrl0 with Twilio basic-auth, base64 encode,
        # then call llm.answer_image_query. We return the placeholder so the
        # control flow is auditable.
        return "Image received. Diagnosis pipeline goes here."

    if not Body.strip():
        return "Please send a question or a photo of your crop."

    lang = detect_language(Body)
    reply = llm.answer_text_query(Body, lang_code=lang)
    return reply.text
