from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Channel(str, Enum):
    POS = "pos"
    WEB = "web"
    MOBILE = "mobile"
    USSD = "ussd"
    AGENCY = "agency"
    NIP = "nip"
    CARD_NOT_PRESENT = "cnp"


class Action(str, Enum):
    ALLOW = "allow"
    STEP_UP = "step_up"
    BLOCK = "block"


class Transaction(BaseModel):
    """Single inline transaction submitted for scoring.

    All amounts are kobo (1 NGN = 100 kobo) to keep integer math.
    """

    txn_id: str = Field(..., min_length=4, max_length=64)
    timestamp: datetime
    amount_kobo: int = Field(..., ge=0)
    channel: Channel
    sender_account: str = Field(..., min_length=10, max_length=20)
    beneficiary_account: str = Field(..., min_length=10, max_length=20)
    beneficiary_bank_code: str = Field(..., min_length=3, max_length=6)
    sender_bvn_hash: Optional[str] = Field(None, max_length=128)
    device_id: Optional[str] = Field(None, max_length=128)
    ip_address: Optional[str] = Field(None, max_length=64)
    geo_state: Optional[str] = Field(None, max_length=64)
    is_new_beneficiary: bool = False
    sender_kyc_tier: int = Field(1, ge=1, le=3)

    @field_validator("sender_account", "beneficiary_account")
    @classmethod
    def _digits_only(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("account number must be digits only")
        return v


class ScoreResponse(BaseModel):
    txn_id: str
    risk_score: int = Field(..., ge=0, le=100)
    action: Action
    reason_codes: list[str]
    model_version: str
    latency_ms: int


class FeedbackRequest(BaseModel):
    """Posted after the bank confirms whether a transaction was fraud.

    Used to retrain the model nightly.
    """

    txn_id: str
    is_fraud: bool
    fraud_type: Optional[str] = None
    notes: Optional[str] = None


class FeedbackResponse(BaseModel):
    txn_id: str
    accepted: bool
