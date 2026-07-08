# CareerLensAI 🚀

An AI-powered career guidance platform that helps students assess skills, practice mock interviews, explore learning roadmaps, and connect with recruiters.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite, React Router, Framer Motion |
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| AI Engine | Python, FastAPI, Google Gemini (via LangChain) |

---

## Project Structure

```
carrerlensAI/
├── src/                    # React frontend
│   ├── pages/              # All page components + their CSS
│   ├── components/         # Shared reusable components
│   ├── context/            # Auth & Theme context providers
│   ├── api/                # Axios API client config
│   └── router.jsx          # App routing
│
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── models/             # Mongoose data models
│   ├── middleware/         # Auth & error middleware
│   └── scripts/            # One-time DB setup scripts
│
├── ai-engine/              # Python FastAPI AI service
│   ├── main.py             # FastAPI app + endpoints
│   ├── agents_logic.py     # AI agent orchestration
│   └── schema.py           # Pydantic request/response schemas
│
└── public/                 # Static assets (logo, etc.)
```

---

## Running the Project

You need **3 terminals** running simultaneously.

### 1. Backend (Node.js)
```powershell
cd server
npm run dev        # dev mode with nodemon
# npm start        # production mode
```
Runs on: `http://localhost:5000` (or as set in `server/.env`)

### 2. AI Engine (Python / FastAPI)
```powershell
# Activate virtual environment first
.\.venv\Scripts\Activate.ps1

python ai-engine/main.py
```
Runs on: `http://localhost:8001`

### 3. Frontend (React / Vite)
```powershell
npm run dev
```
Runs on: `http://localhost:5173`

> **Start order:** Backend → AI Engine → Frontend

---

## One-Time Database Setup

After starting the backend for the first time:

```powershell
# Seed roadmap data
node server/scripts/seed.js

# Create admin account
node server/scripts/seed_admin.js
```

To look up an OTP from the database (dev utility):
```powershell
node server/scripts/get_otp.js
```

---

## Features

- 🎯 **Mock Interviews** — AI-driven interview sessions with real-time feedback
- 📊 **Profile Analysis** — Resume & skill gap analysis
- 🗺️ **Learning Roadmaps** — Role-based & skill-based learning paths
- 🧠 **Skill Evaluation** — Timed assessments with scoring
- 💬 **Messaging** — Student ↔ Recruiter communication
- 🧑‍💼 **Recruiter Dashboard** — Job posting & candidate scanning
- 🔐 **Admin Dashboard** — User management & platform oversight
