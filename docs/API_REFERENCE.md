# ManSantulan (मन संतुलन) — API Reference Guide

All API endpoints are served over HTTP with JSON payloads.

---

## 1. System Health

### `GET /health`
Returns system status, active version, and database connectivity.

**Response (200 OK):**
```json
{
  "status": "ok",
  "version": "2.0.0",
  "database": "connected"
}
```

---

## 2. Authentication Endpoints

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <access_token>
```

### `POST /api/auth/register`
Creates a new student account.

**Request Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@college.edu",
  "password": "StrongPassword123!",
  "age_group": "18-24",
  "consent": true
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "priya.sharma@college.edu",
    "name": "Priya Sharma",
    "role": "student",
    "age_group": "18-24",
    "preferred_language": "en"
  }
}
```

### `POST /api/auth/login`
Authenticates a user and returns access + refresh JWTs.

**Request Body:**
```json
{
  "email": "alex.sharma@university.edu",
  "password": "StudentPass123!"
}
```

### `POST /api/auth/refresh`
Exchanges a valid refresh token for a fresh access token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

### `GET /api/auth/me`
Returns the authenticated user's profile and assessment count.

---

## 3. Machine Learning Prediction Endpoint

### `POST /predict`
Runs inference on student lifestyle habits through the Random Forest model.

**Request Body:**
```json
{
  "age": 20,
  "gender": "Female",
  "academic_level": "Undergraduate",
  "country": "India",
  "primary_platform": "Instagram",
  "daily_usage_hours": 3.5,
  "sleep_hours": 7.0,
  "social_media_purpose": "Connecting with friends",
  "affects_sleep": "No",
  "stress_level": "Medium",
  "relationship_status": "Single",
  "conflict_frequency": "Rarely"
}
```

**Response (200 OK):**
```json
{
  "prediction": 6.84,
  "balance_score": 6.8,
  "status": "Balanced Rhythm",
  "summary": "Your digital habits show healthy equilibrium. Your sleep duration provides adequate cognitive recovery.",
  "strengths": [
    "Sufficient restorative sleep window (7.0 hrs)",
    "Moderated social media screen time (3.5 hrs)"
  ],
  "recommendations": [
    "Practice 5 minutes of 4-4-4-4 box breathing before study sessions",
    "Set an evening digital sunset 45 minutes before bedtime"
  ],
  "disclaimer": "This balance index is educational and non-clinical. For immediate crisis support, dial Tele-MANAS at 14416."
}
```
