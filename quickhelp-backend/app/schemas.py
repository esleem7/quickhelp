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