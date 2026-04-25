from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class TextQuery(BaseModel):
    """A plain text farmer question (used by /v1/chat and SMS bridge)."""

    question: str = Field(..., min_length=1, max_length=2000)
    state: Optional[str] = Field(None, max_length=64)
    crop: Optional[str] = Field(None, max_length=64)
    language_hint: Optional[str] = Field(None, max_length=8)


class TextReply(BaseModel):
    text: str
    language: str
    usage: dict


class ImageQuery(BaseModel):
    """Used by the WhatsApp webhook handler when the farmer sends a photo."""

    question: str = Field(..., min_length=1, max_length=2000)
    image_b64: str = Field(..., min_length=10)
    image_media_type: str = Field(..., min_length=5, max_length=64)
    state: Optional[str] = Field(None, max_length=64)
    crop: Optional[str] = Field(None, max_length=64)
    language_hint: Optional[str] = Field(None, max_length=8)


class USSDRequest(BaseModel):
    """Africa's Talking USSD gateway shape (the dominant Nigerian provider)."""

    sessionId: str
    serviceCode: str
    phoneNumber: str
    text: str = ""
