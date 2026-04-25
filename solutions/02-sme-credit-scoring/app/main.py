from __future__ import annotations

import os

from fastapi import Depends, FastAPI, Header, HTTPException, status

from .features import extract
from .models import CreditApplication, ScoreResponse
from .scoring import MODEL_VERSION, recommend_terms, score_application

app = FastAPI(
    title="Naija SME Credit Scoring API",
    version="0.1.0",
    description=(
        "Alternative-data credit scoring for Nigerian MSMEs. "
        "Submit a credit application with bank/POS statement summary and "
        "obligations; receive PD, score, decision, and recommended terms."
    ),
)


def _require_api_key(x_api_key: str | None = Header(default=None)) -> str:
    expected = os.getenv("CREDIT_API_KEY")
    if expected is None:
        return "demo"
    if x_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid api key"
        )
    return x_api_key


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_version": MODEL_VERSION}


@app.post("/v1/score", response_model=ScoreResponse)
def score(
    app_in: CreditApplication, _: str = Depends(_require_api_key)
) -> ScoreResponse:
    fv = extract(app_in)
    result = score_application(app_in, fv)
    amt, tenor, repayment, decision = recommend_terms(app_in, result.pd_12m)

    return ScoreResponse(
        application_id=app_in.application_id,
        pd_12m=round(result.pd_12m, 4),
        score=result.score,
        decision=decision,
        recommended_amount_kobo=amt,
        recommended_tenor_months=tenor,
        monthly_repayment_kobo=repayment,
        reason_codes=result.reasons,
        model_version=MODEL_VERSION,
    )
