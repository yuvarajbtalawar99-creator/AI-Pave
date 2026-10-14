"""
AI-PAVE Authentication Schema Definitions
"""

from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = Field(default="inspector", description="User role: inspector, engineer, contractor, or admin")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="User password, minimum 6 characters")

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    credential: str = Field(..., description="Google ID Token JWT returned from Google Identity Services")
    client_id: Optional[str] = Field(default=None, description="Optional Google Client ID verification check")

class UserResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    auth_provider: str = "local"
    created_at: str
    last_login: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    avatar_url: Optional[str] = None
