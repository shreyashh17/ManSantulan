from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text
from backend.app.db.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    action = Column(String(80), nullable=False) # 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOCKOUT', 'REGISTER', 'PASSWORD_RESET', 'DATA_EXPORT', 'ACCOUNT_DELETED'
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
