# ManSantulan (मन संतुलन) — Student Digital Wellness & Mental Balance

> **"Balance of Mind"** — An AI-powered, student-centered mental health analytics platform that predicts digital wellness balance from social media usage, academic routines, and sleep patterns.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/ML-scikit--learn-F7931E.svg)](https://scikit-learn.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%2B%20SQLAlchemy-003B57.svg)](https://www.sqlalchemy.org)
[![JWT](https://img.shields.io/badge/Auth-PyJWT%20%2B%20Bcrypt-black.svg)](https://pyjwt.readthedocs.io)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🌿 Overview & Philosophy

Modern students navigate intense academic pressures, endless notification streams, and algorithmic social media feeds. **ManSantulan** ("मन संतुलन" — *Balance of Mind*) transforms student wellness self-reflection from clinical, intimidating evaluations into a **warm, safe, and empowering** experience.

- **Non-Clinical Scoring**: Continuous 0–10 balance index framed through growth and equilibrium bands.
- **Empirical Machine Learning**: Random Forest regression trained on 5,000 real student lifestyle survey records.
- **24/7 Crisis De-escalation**: Direct one-click integration with Tele-MANAS (`14416`), iCall, and Vandrevala Foundation.
- **Sovereign Privacy**: Zero-knowledge data minimization, JSON data exports, and permanent one-click account deletion.

---

## 🚀 Quick Start & How to Run

### 1. Prerequisites
- Python 3.9+ (Python 3.10 / 3.11 / 3.12 / 3.13)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 2. Installation & Server Startup
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Initialize SQLite database & seed default demo student
python -m backend.app.db.init_db

# 3. Launch FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
*API is live at `http://127.0.0.1:8000` with interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.*

---

## 📁 System Architecture

```
ManSantulan/
├── backend/
│   ├── app/
│   │   ├── core/                  # Security (Bcrypt), JWT tokens, config
│   │   ├── db/                    # SQLAlchemy engine, session, init_db
│   │   ├── models/                # User, AssessmentRecord, AuditLog
│   │   ├── schemas/               # Pydantic schemas (User, StudentData)
│   │   ├── api/                   # Auth (JWT) & Predict routes
│   │   └── services/              # ML inference (RandomForestRegressor)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── css/                       # tokens.css, shell.css, components.css, animations.css
│   ├── js/                        # api.js (JWT client), app_shell.js, i18n.js
│   └── pages/
│       ├── public/                # about, features, how-it-works, team, contact, faq, privacy, terms, disclaimer, helplines, offline
│       ├── auth/                  # login, register, forgot-password, reset-password, verify-email, onboarding, profile, security, privacy-center
│       └── dashboard/             # student dashboard workspace
├── data/                          # Dataset CSV & Mental_Health_Model.pkl
├── main.py                        # Unified FastAPI server & route distributor
└── README.md
```

---

## 🔒 Default Demo Credentials
- **Student User**: `alex.sharma@university.edu` / `StudentPass123!`
- **Administrator**: `admin@mansantulan.in` / `AdminSecure2026!`
