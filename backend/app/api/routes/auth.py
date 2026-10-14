"""
AI-PAVE Authentication API Routes
Endpoints:
- POST /api/v1/auth/signup: Local email/password registration
- POST /api/v1/auth/login: Local email/password authentication
- POST /api/v1/auth/google: Google OAuth ID token verification & sign-in / registration
- GET  /api/v1/auth/me: Retrieve current authenticated user profile
- PUT  /api/v1/auth/me: Update current user profile
- GET  /api/v1/auth/config: Retrieve public auth configuration (e.g. Google Client ID)
- POST /api/v1/auth/logout: Logout user
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends

from app.core.config import settings
from app.core.logging import logger
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_google_id_token,
    get_current_user,
)
from app.database.repositories.user_repo import user_repo
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    GoogleAuthRequest,
    UserResponse,
    TokenResponse,
    UpdateUserRequest,
)

router = APIRouter(prefix="/auth")


def _format_user_response(user_doc: Dict[str, Any]) -> UserResponse:
    return UserResponse(
        user_id=user_doc["user_id"],
        email=user_doc["email"],
        full_name=user_doc.get("full_name", ""),
        role=user_doc.get("role", "inspector"),
        avatar_url=user_doc.get("avatar_url"),
        auth_provider=user_doc.get("auth_provider", "local"),
        created_at=user_doc.get("created_at", datetime.now(timezone.utc).isoformat()),
        last_login=user_doc.get("last_login"),
    )


@router.get("/config", summary="Get Public Auth Configuration")
async def get_auth_config():
    """Returns client-safe authentication configurations (like Google Client ID)."""
    return {
        "google_client_id": settings.GOOGLE_CLIENT_ID or "",
        "project_name": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
    }


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Register New User")
async def signup(payload: UserCreate):
    """
    Registers a new user with email, password, and designated role.
    """
    email_clean = payload.email.strip().lower()
    
    # Check if user already exists
    existing = user_repo.get_by_email(email_clean)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email '{email_clean}' already exists. Please sign in instead."
        )

    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    hashed = hash_password(payload.password)

    user_doc = {
        "user_id": user_id,
        "email": email_clean,
        "full_name": payload.full_name.strip(),
        "role": payload.role or "inspector",
        "hashed_password": hashed,
        "avatar_url": None,
        "auth_provider": "local",
        "google_id": None,
        "created_at": now_iso,
        "last_login": now_iso,
    }

    user_repo.save(user_doc)
    logger.info("New user registered", user_id=user_id, email=email_clean, role=user_doc["role"])

    token = create_access_token({
        "sub": user_id,
        "email": email_clean,
        "role": user_doc["role"],
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_format_user_response(user_doc),
    )


@router.post("/login", response_model=TokenResponse, summary="Sign In with Email and Password")
async def login(payload: UserLogin):
    """
    Authenticates an existing user via email and password.
    """
    email_clean = payload.email.strip().lower()
    user = user_repo.get_by_email(email_clean)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Check if user only registered via Google
    if not user.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account was registered using Google. Please click 'Continue with Google' to sign in."
        )

    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    user_repo.update(user["user_id"], {"last_login": now_iso})
    user["last_login"] = now_iso

    token = create_access_token({
        "sub": user["user_id"],
        "email": user["email"],
        "role": user.get("role", "inspector"),
    })

    logger.info("User signed in successfully", user_id=user["user_id"], email=email_clean)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_format_user_response(user),
    )


@router.post("/google", response_model=TokenResponse, summary="Sign In or Sign Up with Google")
async def google_auth(payload: GoogleAuthRequest):
    """
    Authenticates a user via Google OAuth 2.0 Identity Token.
    If the user does not exist yet, an account is automatically created.
    """
    profile = await verify_google_id_token(payload.credential, payload.client_id)
    google_id = profile["google_id"]
    email = profile["email"]
    now_iso = datetime.now(timezone.utc).isoformat()

    # Look up by Google ID or by Email
    user = user_repo.get_by_google_id(google_id)
    if not user:
        user = user_repo.get_by_email(email)

    if user:
        # Existing user - update Google link and details
        updates = {
            "google_id": google_id,
            "last_login": now_iso,
        }
        if profile.get("avatar_url") and not user.get("avatar_url"):
            updates["avatar_url"] = profile["avatar_url"]
        if not user.get("full_name") and profile.get("full_name"):
            updates["full_name"] = profile["full_name"]

        user_repo.update(user["user_id"], updates)
        user.update(updates)
        logger.info("Google user signed in", user_id=user["user_id"], email=email)
    else:
        # New user - auto-register
        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "full_name": profile["full_name"],
            "role": "inspector",
            "hashed_password": None,
            "avatar_url": profile.get("avatar_url"),
            "auth_provider": "google",
            "google_id": google_id,
            "created_at": now_iso,
            "last_login": now_iso,
        }
        user_repo.save(user)
        logger.info("New user registered via Google", user_id=user_id, email=email)

    token = create_access_token({
        "sub": user["user_id"],
        "email": user["email"],
        "role": user.get("role", "inspector"),
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_format_user_response(user),
    )


@router.get("/me", response_model=UserResponse, summary="Get Current Logged-in User Profile")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns the user profile for the Bearer token in the request header.
    """
    return _format_user_response(current_user)


@router.put("/me", response_model=UserResponse, summary="Update Current User Profile")
async def update_me(
    payload: UpdateUserRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Updates the profile information of the current logged-in user.
    """
    updates = {}
    if payload.full_name is not None and payload.full_name.strip():
        updates["full_name"] = payload.full_name.strip()
    if payload.role is not None and payload.role.strip():
        updates["role"] = payload.role.strip()
    if payload.avatar_url is not None:
        updates["avatar_url"] = payload.avatar_url.strip()

    if updates:
        user_repo.update(current_user["user_id"], updates)
        current_user.update(updates)

    return _format_user_response(current_user)


@router.post("/logout", summary="Logout User")
async def logout():
    """
    Stateless JWT logout endpoint.
    """
    return {"message": "Successfully logged out of AI-PAVE."}
