from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    age_group: str = Field(default="18-24")
    consent: bool = Field(default=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    role: str
    age_group: str
    is_verified: bool
    primary_language: str
    wellness_goals: str
    reminder_frequency: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenRefresh(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class VerifyEmailRequest(BaseModel):
    token: str

class OnboardingUpdate(BaseModel):
    primary_language: Optional[str] = "en"
    wellness_goals: Optional[List[str]] = []
    reminder_frequency: Optional[str] = "daily"

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age_group: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
