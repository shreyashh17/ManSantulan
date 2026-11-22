from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.db.session import get_db
from backend.app.models.assessment import AssessmentRecord
from backend.app.schemas.assessment import StudentData, PredictionResponse
from backend.app.services.ml_service import predict_score, categorize_score
from backend.app.core.security import decode_token

router = APIRouter(tags=["AI Assessment & Prediction"])

@router.post("/predict", response_model=PredictionResponse)
def handle_prediction(
    data: StudentData,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Core ML Prediction Endpoint.
    100% backward-compatible with original 12-feature input payload.
    """
    score = predict_score(data)
    category, tips = categorize_score(score)

    # If user is logged in, persist assessment record into database
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        if payload and payload.get("type") == "access":
            user_id = int(payload.get("sub"))

    record = AssessmentRecord(
        user_id=user_id,
        age=data.age,
        gender=data.gender,
        country=data.country,
        academic_level=data.academic_level,
        most_used_platform=data.most_used_platform,
        purpose_of_use=data.purpose_of_use,
        avg_daily_usage_hours=data.avg_daily_usage_hours,
        daily_unlocks=data.daily_unlocks,
        study_hours=data.study_hours,
        physical_activity_hours=data.physical_activity_hours,
        sleep_hours_per_night=data.sleep_hours_per_night,
        stress_level=data.stress_level,
        predicted_mental_health_score=score,
        category=category
    )
    db.add(record)
    db.commit()

    return PredictionResponse(
        predicted_mental_health_score=score,
        category=category,
        action_tips=tips
    )
