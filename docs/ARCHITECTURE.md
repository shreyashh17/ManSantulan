# ManSantulan (मन संतुलन) — Architecture Specification

## 1. Overview & Core Philosophy

ManSantulan is an AI-powered student mental health analytics and wellness support platform. The system is engineered around three pillars:

1. **Non-Stigmatizing Design**: Replaces clinical labels with continuous 0–10 balance scores, supportive microcopy, and gentle visual guidance.
2. **Empirical ML Inference**: Uses a pre-trained scikit-learn Random Forest regression pipeline evaluating 12 key student lifestyle and social media dimensions.
3. **Data Privacy & Student Sovereignty**: Complete data isolation, client-side JWT management, zero external data sharing, and full GDPR-style export/deletion capability.

---

## 2. Directory Structure

```
ManSantulan/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py             # User registration, login, JWT token refresh, profile
│   │   │   └── predict.py          # ML scoring route with assessment persistence
│   │   ├── core/
│   │   │   ├── config.py           # App settings, secrets, and database paths
│   │   │   └── security.py         # Bcrypt hashing, PyJWT creation and verification
│   │   ├── db/
│   │   │   ├── init_db.py          # Table initialization and test student seeding
│   │   │   └── session.py          # SQLAlchemy 2.0 engine and SessionLocal
│   │   ├── models/
│   │   │   ├── assessment.py       # AssessmentRecord table (12 model features)
│   │   │   ├── audit.py            # AuditLog table for security events
│   │   │   └── user.py             # User table with role, preferences, lockout counters
│   │   ├── schemas/
│   │   │   ├── assessment.py       # Pydantic schemas for prediction input/output
│   │   │   └── user.py             # Pydantic schemas for auth requests and profiles
│   │   └── services/
│   │       └── ml_service.py       # Model loader and inference engine
├── frontend/
│   ├── css/
│   │   ├── animations.css          # Keyframes, fade-in, slide-up, reduced-motion
│   │   ├── components.css          # Cards, buttons, forms, badges, breadcrumbs, banners
│   │   ├── shell.css               # Sidebar, sticky topbar, search modal, notifications popover
│   │   └── tokens.css              # Design tokens (Sage, Calm Blue, Lavender, Cream, Coral, Slate)
│   ├── js/
│   │   ├── api.js                  # Centralized ApiClient class with JWT storage and auto-refresh
│   │   └── app_shell.js            # Sidebar toggle, theme switch, search (Ctrl+K), notifications
│   └── pages/
│       ├── auth/                   # login, register, forgot/reset-password, onboarding, profile, security, privacy-center
│       ├── dashboard/              # student dashboard with Chart.js weekly trend & affirmations
│       └── public/                 # about, features, how-it-works, team, contact, faq, privacy, terms, disclaimer, helplines, offline
├── data/
│   └── Student Social Media And Mental Health Impact.csv  # Anonymized student dataset
├── docs/                           # Architecture, API Reference, Deployment guides
├── index.html                      # Main landing page
├── main.py                         # FastAPI unified application and route dispatcher
├── Mental_Health_Model.pkl         # Trained Random Forest Regressor Pipeline
├── requirements.txt                # Python dependencies
└── README.md
```

---

## 3. Database Schema

The database runs on SQLite via SQLAlchemy 2.0 (compatible with PostgreSQL in production):

### Users Table (`users`)
- `id` (Integer, Primary Key)
- `email` (String, Unique, Indexed)
- `hashed_password` (String)
- `name` (String)
- `age_group` (String: `13-17`, `18-24`, `25-34`, `35+`)
- `role` (String: `student`, `counselor`, `admin`)
- `preferred_language` (String: `en`, `hi`, `mr`)
- `is_active` (Boolean, default: True)
- `is_verified` (Boolean, default: False)
- `failed_login_attempts` (Integer, default: 0)
- `locked_until` (DateTime, nullable)
- `created_at` (DateTime, default: UTC now)

### Assessment Records Table (`assessments`)
- `id` (Integer, Primary Key)
- `user_id` (Integer, ForeignKey to `users.id`, nullable for guest runs)
- `age` (Integer)
- `gender` (String)
- `academic_level` (String)
- `country` (String)
- `primary_platform` (String)
- `daily_usage_hours` (Float)
- `sleep_hours` (Float)
- `social_media_purpose` (String)
- `affects_sleep` (String: `Yes`/`No`)
- `stress_level` (String: `Low`, `Medium`, `High`, `Very High`)
- `relationship_status` (String)
- `conflict_frequency` (String)
- `predicted_score` (Float, 0.0 - 10.0)
- `status_label` (String)
- `created_at` (DateTime, default: UTC now)

---

## 4. Machine Learning Integration

The model is an empirical `RandomForestRegressor` pipeline loaded from `Mental_Health_Model.pkl`.

### Input Feature Matrix
1. `age` (Numeric)
2. `gender` (Categorical)
3. `academic_level` (Categorical)
4. `country` (Categorical)
5. `primary_platform` (Categorical)
6. `daily_usage_hours` (Numeric)
7. `sleep_hours` (Numeric)
8. `social_media_purpose` (Categorical)
9. `affects_sleep` (Categorical: `Yes`/`No`)
10. `stress_level` (Categorical: `Low`/`Medium`/`High`/`Very High`)
11. `relationship_status` (Categorical)
12. `conflict_frequency` (Categorical)

*Automatic Transformation*: Country is converted internally to `Grouped_country` to match the model pipeline encoding before inference.
