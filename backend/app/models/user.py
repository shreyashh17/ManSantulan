from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
import enum
from backend.app.db.session import Base

class UserRole(str, enum.Enum):
    USER = "user"
    COUNSELOR = "counselor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), default=UserRole.USER.value, nullable=False)
    age_group = Column(String(30), default="18-24", nullable=False)
    consent_given = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    
    # Account lockout & security
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    lockout_until = Column(DateTime, nullable=True)
    
    # Onboarding & personalization
    primary_language = Column(String(10), default="en", nullable=False) # 'en', 'hi', 'mr'
    wellness_goals = Column(Text, default="[]", nullable=False) # JSON encoded string
    reminder_frequency = Column(String(30), default="daily", nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def is_locked(self) -> bool:
        """Check if user account is currently under temporary security lockout."""
        if self.lockout_until and datetime.now(timezone.utc) < self.lockout_until.replace(tzinfo=timezone.utc):
            return True
        return False
