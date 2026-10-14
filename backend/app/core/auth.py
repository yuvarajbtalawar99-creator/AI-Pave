"""
AI-PAVE Authentication and Security Core
Provides:
- Secure password hashing & verification (Bcrypt & PBKDF2-HMAC-SHA256)
- RFC 7519 Compliant JWT Token Generation & Verification (PyJWT + Fallback)
- Google OAuth ID Token Verification via Google's tokeninfo API
- FastAPI Dependency Injection for Current User Authentication
"""

import os
import json
import time
import base64
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple
import httpx
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.logging import logger
from app.database.repositories.user_repo import user_repo

# HTTP Bearer authentication scheme
security_bearer = HTTPBearer(auto_error=False)


# ==========================================
# 1. Password Hashing & Verification
# ==========================================

def hash_password(password: str) -> str:
    """
    Hashes a password securely.
    Uses bcrypt if available, otherwise PBKDF2-HMAC-SHA256 with 100,000 rounds.
    """
    try:
        import bcrypt
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")
    except Exception:
        # Secure PBKDF2 fallback
        salt = secrets.token_hex(16)
        key = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        )
        return f"pbkdf2_sha256$100000${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against the stored hash.
    Supports both bcrypt and pbkdf2_sha256 formats.
    """
    if not hashed_password:
        return False

    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            import bcrypt
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False

    if hashed_password.startswith("pbkdf2_sha256$"):
        try:
            parts = hashed_password.split("$")
            if len(parts) != 4:
                return False
            _, iterations_str, salt, stored_key = parts
            iterations = int(iterations_str)
            computed_key = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                iterations
            ).hex()
            return hmac.compare_digest(computed_key, stored_key)
        except Exception:
            return False

    return False


# ==========================================
# 2. JWT Generation & Verification
# ==========================================

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def _base64url_decode(data: str) -> bytes:
    padding = 4 - (len(data) % 4)
    if padding != 4:
        data += "=" * padding
    return base64.urlsafe_b64decode(data)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates an RFC 7519 HS256 JWT access token.
    Uses PyJWT if installed, otherwise pure standard library fallback.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
        "iss": "aipave-auth-system"
    })

    try:
        import jwt
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    except Exception:
        # Standard library HS256 implementation
        header = {"alg": "HS256", "typ": "JWT"}
        header_b64 = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
        payload_b64 = _base64url_encode(json.dumps(to_encode, separators=(",", ":")).encode("utf-8"))
        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        signature = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        sig_b64 = _base64url_encode(signature)
        return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates an HS256 JWT token.
    """
    try:
        import jwt
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except Exception:
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return None
            header_b64, payload_b64, sig_b64 = parts
            signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
            expected_sig = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
            actual_sig = _base64url_decode(sig_b64)
            if not hmac.compare_digest(expected_sig, actual_sig):
                return None
            payload_json = _base64url_decode(payload_b64).decode("utf-8")
            payload = json.loads(payload_json)
            # Check expiry
            exp = payload.get("exp")
            if exp and time.time() > exp:
                return None
            return payload
        except Exception:
            return None


# ==========================================
# 3. Google OAuth ID Token Verification
# ==========================================

async def verify_google_id_token(credential: str, expected_client_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Verifies a Google ID Token (from Google Identity Services / GSI)
    using Google's official tokeninfo endpoint.
    Returns decoded profile dict: email, full_name, avatar_url, google_id.
    """
    verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(verify_url)
        except Exception as e:
            logger.error("Failed to reach Google tokeninfo endpoint", error=str(e))
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to reach Google OAuth authentication servers."
            )

    if response.status_code != 200:
        logger.warning("Google tokeninfo returned non-200", status=response.status_code, body=response.text)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google OAuth credential."
        )

    info = response.json()

    # Verify audience if client ID is configured
    client_id_to_check = expected_client_id or settings.GOOGLE_CLIENT_ID
    if client_id_to_check and client_id_to_check.strip() != "":
        aud = info.get("aud")
        if aud != client_id_to_check:
            logger.warning("Google token audience mismatch", expected=client_id_to_check, received=aud)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google OAuth Client ID mismatch."
            )

    email = info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not provide an email address."
        )

    return {
        "email": email.lower(),
        "full_name": info.get("name") or email.split("@")[0].capitalize(),
        "avatar_url": info.get("picture"),
        "google_id": info.get("sub"),
        "email_verified": info.get("email_verified") in (True, "true"),
    }


# ==========================================
# 4. Current User FastAPI Dependencies
# ==========================================

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Dict[str, Any]:
    """
    Dependency that extracts and verifies current user from Bearer JWT.
    Raises 401 if missing or invalid.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account no longer exists",
        )

    return user


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Optional[Dict[str, Any]]:
    """
    Dependency that returns the current user if token is provided and valid,
    or None if unauthenticated.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
