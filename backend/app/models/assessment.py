from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from backend.app.db.session import Base

class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # 12 Exact Model Features
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    country = Column(String(80), nullable=False)
    academic_level = Column(String(40), nullable=False)
    most_used_platform = Column(String(40), nullable=False)
    purpose_of_use = Column(String(40), nullable=False)
    avg_daily_usage_hours = Column(Float, nullable=False)
    daily_unlocks = Column(Integer, nullable=False)
    study_hours = Column(Float, nullable=False)
    physical_activity_hours = Column(Float, nullable=False)
    sleep_hours_per_night = Column(Float, nullable=False)
    stress_level = Column(String(20), nullable=False)
    
    # Result
    predicted_mental_health_score = Column(Float, nullable=False)
    category = Column(String(30), nullable=False) # 'Resilient', 'Balanced', 'Moderate Strain', 'Elevated Strain'
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
