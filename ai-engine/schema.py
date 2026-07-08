from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UserProfile(BaseModel):
    user_id: str
    domain: str  # e.g., "Cybersecurity", "Nursing", "Java Dev"
    goal: str
    motivation: str

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class InterviewPayload(BaseModel):
    user_id: str
    domain: str
    transcript: List[ChatMessage]

class AnalysisResponse(BaseModel):
    technical_score: int
    soft_skills_score: int
    strengths: List[str]
    weaknesses: List[str]
    emotional_feedback: str
    next_roadmap_step: str
    metrics: Dict[str, Any]
