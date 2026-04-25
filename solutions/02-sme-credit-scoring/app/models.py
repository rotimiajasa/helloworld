from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class BusinessSector(str, Enum):
    RETAIL = "retail"
    WHOLESALE = "wholesale"
    AGRIBUSINESS = "agribusiness"
    SERVICES = "services"
    LIGHT_MANUFACTURING = "light_manufacturing"
    LOGISTICS = "logistics"
    HOSPITALITY = "hospitality"
    OTHER = "other"


class BankStatementSummary(BaseModel):
    """Aggregated 6-month bank/POS data, e.g. via Mono / Okra / direct
    Moniepoint or OPay terminal export."""

    months_observed: int = Field(..., ge=1, le=24)
    total_credits_kobo: int = Field(..., ge=0)
    total_debits_kobo: int = Field(..., ge=0)
    avg_monthly_balance_kobo: int = Field(..., ge=0)
    min_monthly_balance_kobo: int = Field(..., ge=-100_000_000_00)
    bounced_debits_count: int = Field(..., ge=0)
    distinct_inflow_payers: int = Field(..., ge=0)
    pos_terminal_volume_kobo: int = Field(0, ge=0)
    pos_active_days_per_month: float = Field(0, ge=0, le=31)


class ExistingObligation(BaseModel):
    lender: str
    outstanding_kobo: int = Field(..., ge=0)
    monthly_repayment_kobo: int = Field(..., ge=0)
    days_past_due: int = Field(0, ge=0)


class CreditApplication(BaseModel):
    application_id: str = Field(..., min_length=4, max_length=64)
    business_name: str
    bvn_hash: str = Field(..., max_length=128)
    sector: BusinessSector
    state: str
    business_age_months: int = Field(..., ge=0, le=600)
    employees: int = Field(..., ge=0, le=10_000)
    requested_amount_kobo: int = Field(..., ge=10_000_00)
    requested_tenor_months: int = Field(..., ge=1, le=60)
    statement: BankStatementSummary
    existing_obligations: list[ExistingObligation] = []
    has_inventory_app: bool = False
    has_supplier_credit: bool = False


class Decision(str, Enum):
    APPROVE = "approve"
    REVIEW = "review"
    DECLINE = "decline"


class ReasonCode(BaseModel):
    code: str
    impact: str  # "positive" or "negative"
    detail: str


class ScoreResponse(BaseModel):
    application_id: str
    pd_12m: float = Field(..., ge=0, le=1)
    score: int = Field(..., ge=300, le=850)
    decision: Decision
    recommended_amount_kobo: int
    recommended_tenor_months: int
    monthly_repayment_kobo: int
    reason_codes: list[ReasonCode]
    model_version: str
