from pydantic import BaseModel , EmailStr
from typing import Optional

class HelpRequestBase(BaseModel):
    title: str
    description: str
    category: str
    urgency: str
    city: str

class HelpRequestCreate(HelpRequestBase):
    pass

class HelpRequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    urgency: Optional[str] = None
    city: Optional[str] = None
    status: Optional[str] = None

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    city: Optional[str] = None
    role: Optional[str] = "both"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OfferCreate(BaseModel):
    request_id: str
    helper_id: str
    message: Optional[str] = None
    proposed_reward: Optional[float] = None


class MessageCreate(BaseModel):
    request_id: Optional[str] = None
    sender_id: str
    receiver_id: str
    content: str


class RatingCreate(BaseModel):
    request_id: str
    reviewer_id: str
    reviewed_id: str
    rating: int
    comment: Optional[str] = None


class PaymentCreate(BaseModel):
    request_id: str
    payer_id: str
    receiver_id: str
    amount: float
    method: Optional[str] = "cash"