from backend.app.db.session import engine, Base
from backend.app.models.user import User
from backend.app.models.audit import AuditLog
from backend.app.models.assessment import AssessmentRecord
from backend.app.core.security import hash_password
from sqlalchemy.orm import Session

def init_database():
    """Create all database tables if they do not exist and seed default admin/student."""
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        # Check if default demo user exists
        demo = db.query(User).filter(User.email == "alex.sharma@university.edu").first()
        if not demo:
            demo_user = User(
                name="Alex Sharma",
                email="alex.sharma@university.edu",
                hashed_password=hash_password("StudentPass123!"),
                role="user",
                age_group="18-24",
                consent_given=True,
                is_verified=True,
                primary_language="en",
                wellness_goals='["Better Sleep", "Reduce Screen Time"]',
                reminder_frequency="daily"
            )
            db.add(demo_user)
            db.commit()

        # Check if admin exists
        admin = db.query(User).filter(User.email == "admin@mansantulan.in").first()
        if not admin:
            admin_user = User(
                name="Platform Admin",
                email="admin@mansantulan.in",
                hashed_password=hash_password("AdminSecure2026!"),
                role="admin",
                age_group="25-34",
                consent_given=True,
                is_verified=True,
                primary_language="en",
                wellness_goals='[]',
                reminder_frequency="none"
            )
            db.add(admin_user)
            db.commit()

if __name__ == "__main__":
    init_database()
    print("Database initialized successfully with seeded users.")
