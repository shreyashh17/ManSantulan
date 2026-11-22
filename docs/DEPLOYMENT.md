# ManSantulan (मन संतुलन) — Deployment & Setup Guide

## 1. Local Development Setup

### System Prerequisites
- Python 3.9, 3.10, 3.11, 3.12, or 3.13
- Git

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/shreyashh17/ManSantulan.git
cd ManSantulan

# 2. (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Initialize the database schema & seed demo users
python -m backend.app.db.init_db

# 6. Start the development server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 2. Environment Variables (`.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | `dev_secret_key_...` | HMAC secret for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | JWT Access Token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | JWT Refresh Token lifetime |
| `DATABASE_URL` | `sqlite:///./mansantulan.db` | SQLAlchemy connection string |
| `ENVIRONMENT` | `development` | `development` or `production` |

---

## 3. Production Deployment (Docker / VPS / Cloud)

For production environments:
1. Set a cryptographically strong `SECRET_KEY` in environment variables:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
2. Switch `DATABASE_URL` to PostgreSQL if high concurrent writes are expected:
   ```
   DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/mansantulan
   ```
3. Run behind a production reverse proxy (Nginx, Caddy) or production ASGI runner:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```
