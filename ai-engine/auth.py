import os
import secrets
import re
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from twilio.rest import Client
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# In-memory stores
# Format for otp_store: { "+91XXXXXXXXXX": {"otp": "123456", "expires_at": 1620000000.0} }
otp_store: Dict[str, Dict[str, float]] = {}
# Format for rate_limit_store: { "+91XXXXXXXXXX": [1620000000.0, ...] }
rate_limit_store: Dict[str, List[float]] = {}

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

class SendOTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str

def validate_phone_number(phone_number: str) -> bool:
    """Validate E.164 formatting, e.g. +91XXXXXXXXXX"""
    pattern = re.compile(r"^\+[1-9]\d{1,14}$")
    return bool(pattern.match(phone_number))

def check_rate_limit(phone_number: str) -> bool:
    """Max 3 requests per 10 minutes (600 seconds)"""
    now = time.time()
    history = rate_limit_store.get(phone_number, [])
    # Filter out requests older than 10 minutes
    recent = [req_time for req_time in history if now - req_time <= 600]
    rate_limit_store[phone_number] = recent
    
    if len(recent) >= 3:
        return False
    
    rate_limit_store[phone_number].append(now)
    return True

@router.post("/send-otp")
async def send_otp(request: SendOTPRequest):
    phone_number = request.phone_number
    
    if not validate_phone_number(phone_number):
        return {"message": "Invalid phone number"}
    
    if not check_rate_limit(phone_number):
        raise HTTPException(status_code=429, detail="Too many requests. Max 3 OTPs per 10 minutes.")

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
        raise HTTPException(status_code=500, detail="Twilio credentials are not configured properly.")

    # Generate a secure random 6-digit OTP
    otp = "".join(str(secrets.randbelow(10)) for _ in range(6))
    
    # Store OTP with a 2-minute expiration (120 seconds)
    otp_store[phone_number] = {
        "otp": otp,
        "expires_at": time.time() + 120
    }
    
    try:
        # Use Twilio API to send the OTP via SMS
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=f"Your OTP is {otp}",
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        return {"message": "OTP sent successfully via SMS"}
    except Exception as e:
        # Prevent OTP from being leaked if sending fails
        if phone_number in otp_store:
            del otp_store[phone_number]
        # In production this error logging should not expose the OTP
        raise HTTPException(status_code=500, detail="Failed to send SMS.")

@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    phone_number = request.phone_number
    user_otp = request.otp
    
    if not validate_phone_number(phone_number):
        return {"message": "Invalid phone number"}
        
    stored_data = otp_store.get(phone_number)
    
    if not stored_data:
        return {"message": "Invalid or expired OTP"}
        
    if time.time() > stored_data["expires_at"]:
        del otp_store[phone_number]
        return {"message": "Invalid or expired OTP"}
        
    if stored_data["otp"] == user_otp:
        # Clean up memory, mark verified
        del otp_store[phone_number]
        return {"message": "OTP verified successfully"}
        
    return {"message": "Invalid or expired OTP"}
