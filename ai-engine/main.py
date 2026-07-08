from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from schema import UserProfile, InterviewPayload, AnalysisResponse
from agents_logic import CareerAgents
from auth import router as auth_router
from typing import Optional
import os
import uvicorn

# Security: Internal Secret Authentication
INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "careerlens_default_67890")

async def verify_internal_auth(x_internal_secret: str = Header(...)):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Internal Access Only")
    return True

app = FastAPI(title="CareerLensAI Grand Scale Engine")
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Enable CORS for internal communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "CareerLensAI AI-Engine Online"}

@app.get("/next-question")
async def get_question(domain: str, history: Optional[str] = "", _ = Depends(verify_internal_auth)):
    """Trigger the Interviewer Agent to generate the next question."""
    question = await CareerAgents.get_interviewer_question(domain, history.split("|||") if history else [])
    return {"question": question}

@app.post("/analyze-session", response_model=AnalysisResponse)
async def analyze_session(payload: InterviewPayload, _ = Depends(verify_internal_auth)):
    """The Interconnection: Orchestrates Analyst and Support Agents."""
    try:
        # 1. Trigger Deep Analysis Agent
        analysis = await CareerAgents.run_deep_analysis(payload.transcript, payload.domain)
        
        # 2. Trigger Emotional Support Agent based on Analysis
        support_msg = await CareerAgents.get_support_advise(analysis["emotional_status"])
        
        # 3. Dynamic Roadmap Update (The 'Overseer' Logic)
        next_step = "Advanced Projects & Certifications" if analysis["technical_score"] > 85 else "Fundamental Mastery & Peer Review"

        return AnalysisResponse(
            technical_score=analysis["technical_score"],
            soft_skills_score=analysis["soft_skills_score"],
            strengths=analysis["strengths"],
            weaknesses=analysis["weaknesses"],
            emotional_feedback=support_msg,
            next_roadmap_step=next_step,
            metrics=analysis
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
