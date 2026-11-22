import joblib
import pandas as pd
import os
from backend.app.schemas.assessment import StudentData

# Path to the trained RandomForest model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "Mental_Health_Model.pkl")
if not os.path.exists(MODEL_PATH):
    # Fallback to data folder
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "Mental_Health_Model.pkl")

# Load model once on startup
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Warning: Failed to load Mental_Health_Model.pkl: {e}")

TOP_COUNTRIES = ['Other','India','USA','Canada','Australia','UK','Germany','Mexico','Turkey','France']

def predict_score(data: StudentData) -> float:
    """Run model inference against the 12 input features and return predicted mental health score."""
    if model is None:
        raise RuntimeError("ML model is not loaded.")
        
    country_group = data.country if data.country in TOP_COUNTRIES else "Other"

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

    pred = model.predict(input_row)[0]
    return round(float(pred), 2)

def categorize_score(score: float) -> tuple[str, list[str]]:
    """Generate supportive, non-clinical category and constructive habit tips."""
    if score >= 7.5:
        category = "Resilient Equilibrium"
        tips = [
            "Your digital habits and sleep duration provide strong protective buffers.",
            "Continue scheduling offline study blocks to preserve focus.",
            "Maintain your restorative sleep window and physical movement routine."
        ]
    elif score >= 6.0:
        category = "Balanced with Mild Strain"
        tips = [
            "Try putting your phone to charge outside the bedroom 30 minutes before sleep.",
            "Break long continuous study sessions with 5 minutes of eye and posture rest.",
            "Aim to convert 20 minutes of passive feed scrolling into an evening walk."
        ]
    elif score >= 4.5:
        category = "Noticeable Academic Strain"
        tips = [
            "Your unlock frequency indicates frequent digital task-switching; try batching notifications.",
            "Commit to a fixed sleep schedule for 5 consecutive nights to reset your circadian rhythm.",
            "Consider talking through exam pressure with a trusted peer, mentor, or counselor."
        ]
    else:
        category = "Elevated Strain & Sensory Overload"
        tips = [
            "Your nervous system is signaling significant fatigue from high screen exposure and stress.",
            "Step away from academic notifications and practice the 4-4-4-4 Box Breathing exercise.",
            "Support is confidential and free: consider reaching out to Tele-MANAS (14416) or your student counselor."
        ]
    return category, tips
