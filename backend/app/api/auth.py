from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import json
import secrets

from backend.app.db.session import get_db
from backend.app.models.user import User, UserRole
from backend.app.models.audit import AuditLog
from backend.app.models.assessment import AssessmentRecord
from backend.app.schemas.user import (
    UserCreate, UserLogin, UserOut, Token, TokenRefresh,
    ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest,
    OnboardingUpdate, ProfileUpdate, PasswordChange
)
from backend.app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, decode_token
)
from backend.app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication & Security"])

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    """Dependency to extract and validate the JWT Bearer token and return the User model."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired or is invalid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")
    return user

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, request: Request, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists.")
    
    hashed = hash_password(data.password)
    verification_token = secrets.token_urlsafe(32)
    
    new_user = User(
        name=data.name.strip(),
        email=clean_email,
        hashed_password=hashed,
        role=UserRole.USER.value,
        age_group=data.age_group,
        consent_given=data.consent,
        is_verified=True, # Auto-verified for student dev convenience
        verification_token=verification_token,
        wellness_goals="[]"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Security audit log
    audit = AuditLog(
        user_id=new_user.id,
        action="REGISTER",
        ip_address=request.client.host if request.client else None,
        details=f"User registered with email {clean_email}"
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(subject=new_user.id, extra_claims={"role": new_user.role, "name": new_user.name})
    refresh_token = create_refresh_token(subject=new_user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(new_user)
    )

@router.post("/login", response_model=Token)
def login(data: UserLogin, request: Request, db: Session = Depends(get_db)):
    clean_email = data.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    ip = request.client.host if request.client else None

    if not user:
        db.add(AuditLog(action="LOGIN_FAILURE", ip_address=ip, details=f"Unknown email {clean_email}"))
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    # Check account lockout
    if user.is_locked():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account temporarily locked due to repeated failed logins. Please try again in 15 minutes."
        )

    # Verify password
    if not verify_password(data.password, user.hashed_password):
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
            user.lockout_until = datetime.now(timezone.utc) + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
            db.add(AuditLog(user_id=user.id, action="LOCKOUT", ip_address=ip, details="Max failed attempts reached."))
        else:
            db.add(AuditLog(user_id=user.id, action="LOGIN_FAILURE", ip_address=ip, details=f"Attempt {user.failed_login_attempts}"))
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    # Successful login: reset failed counter
    user.failed_login_attempts = 0
    user.lockout_until = None
    db.add(AuditLog(user_id=user.id, action="LOGIN_SUCCESS", ip_address=ip, details="Login successful"))
    db.commit()

    access_token = create_access_token(subject=user.id, extra_claims={"role": user.role, "name": user.name})
    refresh_token = create_refresh_token(subject=user.id)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user)
    )

@router.post("/refresh", response_model=Token)
def refresh_token(data: TokenRefresh, db: Session = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token.")
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    new_access = create_access_token(subject=user.id, extra_claims={"role": user.role, "name": user.name})
    new_refresh = create_refresh_token(subject=user.id)

    return Token(
        access_token=new_access,
        refresh_token=new_refresh,
        user=UserOut.model_validate(user)
    )

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)

@router.put("/onboarding", response_model=UserOut)
def update_onboarding(data: OnboardingUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.primary_language:
        current_user.primary_language = data.primary_language
    if data.wellness_goals is not None:
        current_user.wellness_goals = json.dumps(data.wellness_goals)
    if data.reminder_frequency:
        current_user.reminder_frequency = data.reminder_frequency
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)

@router.put("/profile", response_model=UserOut)
def update_profile(data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.name:
        current_user.name = data.name.strip()
    if data.age_group:
        current_user.age_group = data.age_group
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)

@router.post("/change-password")
def change_password(data: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password.")
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if user:
        user.reset_token = secrets.token_urlsafe(32)
        db.commit()
        # In production, send email with reset link. For student local testing, return token in payload.
        return {"message": "Password reset token generated.", "reset_token": user.reset_token}
    return {"message": "If this email is registered, password reset instructions have been dispatched."}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == data.token).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")
    user.hashed_password = hash_password(data.new_password)
    user.reset_token = None
    db.commit()
    return {"message": "Password has been successfully reset. You may now log in."}

@router.get("/privacy-export")
def export_user_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Export all user records for compliance with data portability."""
    assessments = db.query(AssessmentRecord).filter(AssessmentRecord.user_id == current_user.id).all()
    user_data = {
        "user_profile": {
            "name": current_user.name,
            "email": current_user.email,
            "age_group": current_user.age_group,
            "primary_language": current_user.primary_language,
            "wellness_goals": current_user.wellness_goals,
            "created_at": current_user.created_at.isoformat()
        },
        "assessments": [
            {
                "id": a.id,
                "score": a.predicted_mental_health_score,
                "category": a.category,
                "avg_daily_usage_hours": a.avg_daily_usage_hours,
                "daily_unlocks": a.daily_unlocks,
                "sleep_hours_per_night": a.sleep_hours_per_night,
                "created_at": a.created_at.isoformat()
            } for a in assessments
        ]
    }
    return user_data

@router.delete("/privacy-delete")
def delete_user_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Permanently delete user profile and associated assessment records."""
    db.query(AssessmentRecord).filter(AssessmentRecord.user_id == current_user.id).delete()
    db.query(AuditLog).filter(AuditLog.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()
    return {"message": "Your account and all associated personal data have been permanently removed."}
