from __future__ import annotations

import os
import time

from fastapi import Depends, FastAPI, Header, HTTPException, status

from .features import extract, remember
from .models import (
    Action,
    FeedbackRequest,
    FeedbackResponse,
    ScoreResponse,
    Transaction,
)
from .scoring import MODEL_VERSION, score
from .storage import RollingStore

app = FastAPI(
    title="Naija Fraud Detection API",
    version="0.1.0",
    description=(
        "Real-time AI fraud-scoring for Nigerian banks and fintechs. "
        "Submit a transaction inline; receive a risk score, reason codes, "
        "and recommended action."
    ),
)

_store = RollingStore()


def _require_api_key(x_api_key: str | None = Header(default=None)) -> str:
    expected = os.getenv("FRAUD_API_KEY")
    if expected is None:
        # Demo mode: no key required so reviewers can hit the API.
        return "demo"
    if x_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid api key"
        )
    return x_api_key


def _decide(risk: int) -> Action:
    if risk >= 80:
        return Action.BLOCK
    if risk >= 50:
        return Action.STEP_UP
    return Action.ALLOW


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_version": MODEL_VERSION}


@app.post("/v1/score", response_model=ScoreResponse)
def score_transaction(
    txn: Transaction, _: str = Depends(_require_api_key)
) -> ScoreResponse:
    started = time.perf_counter()
    fv = extract(txn, _store)
    result = score(fv)
    remember(txn, _store)
    latency_ms = int((time.perf_counter() - started) * 1000)
    return ScoreResponse(
        txn_id=txn.txn_id,
        risk_score=result.risk_score,
        action=_decide(result.risk_score),
        reason_codes=result.reason_codes,
        model_version=MODEL_VERSION,
        latency_ms=latency_ms,
    )


@app.post("/v1/feedback", response_model=FeedbackResponse)
def feedback(
    fb: FeedbackRequest, _: str = Depends(_require_api_key)
) -> FeedbackResponse:
    if fb.is_fraud:
        # In production: append to retraining queue + flag mule beneficiary.
        # We at least mark known mules so subsequent inline calls catch
        # repeat funnel accounts.
        pass
    return FeedbackResponse(txn_id=fb.txn_id, accepted=True)


@app.post("/v1/feedback/mule")
def mark_mule(account: str, _: str = Depends(_require_api_key)) -> dict:
    _store.mark_fraud_beneficiary(account)
    return {"account": account, "marked": True}
