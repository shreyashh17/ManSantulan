import os
import joblib
import pandas as pd
from fastapi import FastAPI, Depends, Header
from pydantic import BaseModel, Field
from typing import Literal, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

# Import modular backend
from backend.app.db.init_db import init_database
from backend.app.db.session import get_db
from backend.app.api.auth import router as auth_router
from backend.app.api.predict import router as predict_router
from backend.app.models.assessment import AssessmentRecord
from backend.app.core.security import decode_token

# Initialize database tables
init_database()

app = FastAPI(
    title="ManSantulan (मन संतुलन) — Student Mental Wellness API",
    version="2.0.0",
    description="Empirical Machine Learning & Mental Health Platform for Indian Students"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(predict_router, prefix="/api/v1")

# Mount Static Frontend Assets
if os.path.exists("frontend"):
    app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# --------------------------------------------------------------------------
# ORIGINAL ML MODEL & DATA DEFINITIONS (PRESERVED FOR BACKWARD COMPATIBILITY)
# --------------------------------------------------------------------------
model = joblib.load('Mental_Health_Model.pkl')
top_countries = ['Other','India','USA','Canada','Australia','UK','Germany','Mexico','Turkey','France']

class StudentData(BaseModel):
    age                     : int = Field(..., ge=10, le=100)
    gender                  : Literal['Male', 'Female']
    country                 : str
    academic_level          : Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat','Twitter','YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp','WeChat']
    purpose_of_use          : Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours   : float = Field(..., ge=0, le=24)
    daily_unlocks           : int   = Field(..., ge=0)
    study_hours             : float = Field(..., ge=0, le=24)
    physical_activity_hours : float = Field(..., ge=0, le=24)
    sleep_hours_per_night   : float = Field(..., ge=0, le=24)
    stress_level            : Literal['Medium', 'Low', 'Very High', 'High']

class PredictionResponse(BaseModel):
    predicted_mental_health_score: float
    category: Optional[str] = None
    action_tips: Optional[list[str]] = None

@app.post('/predict', response_model=PredictionResponse)
def predict(data: StudentData, authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    country_group = data.country if data.country in top_countries else "Other"

    input_row = pd.DataFrame([{
        'Age'                       : data.age,
        'Gender'                    : data.gender,
        'Country'                   : data.country,
        'Academic_Level'            : data.academic_level,
        'Most_Used_Platform'        : data.most_used_platform,
        'Purpose_Of_Use'            : data.purpose_of_use,
        'Avg_Daily_Usage_Hours'     : data.avg_daily_usage_hours,
        'Daily_Unlocks'             : data.daily_unlocks,
        'Study_Hours'               : data.study_hours,
        'Physical_Activity_Hours'   : data.physical_activity_hours,
        'Sleep_Hours_Per_Night'     : data.sleep_hours_per_night,
        'Stress_Level'              : data.stress_level,
        'Grouped_country'           : country_group
    }])

    prediction = round(float(model.predict(input_row)[0]), 2)
    
    # Generate tips
    if prediction >= 7.0:
        cat = "Resilient Equilibrium"
        tips = ["Maintain consistent sleep timing", "Continue outdoor study breaks", "Keep screen exposure moderate"]
    elif prediction >= 5.0:
        cat = "Moderate Strain"
        tips = ["Dim screen brightness 45 mins before bed", "Batch daily notifications", "Practice 4-4-4-4 Box Breathing"]
    else:
        cat = "Elevated Strain"
        tips = ["Prioritize restful sleep recovery", "Step away from algorithmic feeds", "Tele-MANAS (14416) is free & 24/7"]

    # Persist in DB if user is authenticated
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
        predicted_mental_health_score=prediction,
        category=cat
    )
    db.add(record)
    db.commit()

    return PredictionResponse(
        predicted_mental_health_score=prediction,
        category=cat,
        action_tips=tips
    )

# --------------------------------------------------------------------------
# HEALTH & ROUTE HANDLERS
# --------------------------------------------------------------------------
@app.get('/health')
def health():
    return {'status': 'ok', 'version': '2.0.0', 'database': 'connected'}

# Public Pages
@app.get('/')
@app.get('/app')
@app.get('/index.html')
def serve_home():
    return FileResponse('index.html')

@app.get('/about')
def serve_about():
    return FileResponse('frontend/pages/public/about.html')

@app.get('/features')
def serve_features():
    return FileResponse('frontend/pages/public/features.html')

@app.get('/how-it-works')
def serve_how_it_works():
    return FileResponse('frontend/pages/public/how-it-works.html')

@app.get('/team')
def serve_team():
    return FileResponse('frontend/pages/public/team.html')

@app.get('/contact')
def serve_contact():
    return FileResponse('frontend/pages/public/contact.html')

@app.get('/faq')
def serve_faq():
    return FileResponse('frontend/pages/public/faq.html')

@app.get('/privacy')
def serve_privacy():
    return FileResponse('frontend/pages/public/privacy.html')

@app.get('/terms')
def serve_terms():
    return FileResponse('frontend/pages/public/terms.html')

@app.get('/disclaimer')
def serve_disclaimer():
    return FileResponse('frontend/pages/public/disclaimer.html')

@app.get('/helplines')
def serve_helplines():
    return FileResponse('frontend/pages/public/helplines.html')

@app.get('/offline')
def serve_offline():
    return FileResponse('frontend/pages/public/offline.html')

@app.get('/404')
@app.get('/404.html')
def serve_404():
    return FileResponse('404.html')

# Auth & User Pages
@app.get('/login')
@app.get('/login.html')
def serve_login():
    return FileResponse('frontend/pages/auth/login.html')

@app.get('/register')
@app.get('/register.html')
def serve_register():
    return FileResponse('frontend/pages/auth/register.html')

@app.get('/forgot-password')
def serve_forgot_password():
    return FileResponse('frontend/pages/auth/forgot-password.html')

@app.get('/reset-password')
def serve_reset_password():
    return FileResponse('frontend/pages/auth/reset-password.html')

@app.get('/verify-email')
def serve_verify_email():
    return FileResponse('frontend/pages/auth/verify-email.html')

@app.get('/onboarding')
def serve_onboarding():
    return FileResponse('frontend/pages/auth/onboarding.html')

@app.get('/profile')
def serve_profile():
    return FileResponse('frontend/pages/auth/profile.html')

@app.get('/security')
def serve_security():
    return FileResponse('frontend/pages/auth/security.html')

@app.get('/privacy-center')
def serve_privacy_center():
    return FileResponse('frontend/pages/auth/privacy-center.html')

# Dashboard & Subpages
@app.get('/dashboard')
def serve_dashboard():
    return FileResponse('frontend/pages/dashboard/dashboard.html')

@app.get('/assessment')
@app.get('/assessment.html')
def serve_assessment():
    return FileResponse('assessment.html')

@app.get('/insights')
@app.get('/insights.html')
def serve_insights():
    return FileResponse('insights.html')

@app.get('/wellness')
@app.get('/wellness.html')
def serve_wellness():
    return FileResponse('wellness.html')

@app.get('/resources')
@app.get('/resources.html')
def serve_resources():
    return FileResponse('resources.html')

# Preserved Static Asset Handlers
@app.get('/style.css')
def serve_css():
    return FileResponse('style.css', media_type='text/css')

@app.get('/script.js')
def serve_script():
    return FileResponse('script.js', media_type='application/javascript')

@app.get('/auth.js')
def serve_auth():
    return FileResponse('auth.js', media_type='application/javascript')

@app.get('/i18n.js')
def serve_i18n():
    return FileResponse('i18n.js', media_type='application/javascript')
