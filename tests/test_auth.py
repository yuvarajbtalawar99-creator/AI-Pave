"""
AI-PAVE Authentication Test Suite
Tests:
- Password hashing & verification
- JWT creation, decoding, and expiration
- User registration (Signup)
- User authentication (Login)
- Duplicate user detection
- Bearer token authentication & /auth/me profile
- Auth configuration endpoint
"""

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.main import app
from app.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.database.repositories.user_repo import user_repo

client = TestClient(app)

def test_password_hashing_and_verification():
    raw_password = "PavementSecret@2026"
    hashed = hash_password(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

def test_jwt_token_creation_and_decoding():
    payload = {"sub": "usr_test_123", "email": "test@pavement.org", "role": "inspector"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    assert len(token) > 20

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded.get("sub") == "usr_test_123"
    assert decoded.get("email") == "test@pavement.org"
    assert decoded.get("role") == "inspector"

def test_auth_config_endpoint():
    response = client.get("/api/v1/auth/config")
    assert response.status_code == 200
    data = response.json()
    assert "google_client_id" in data
    assert "project_name" in data

def test_user_signup_and_login_flow():
    unique_email = f"inspector.test_{Path(__file__).stat().st_mtime_ns}@transport.org"
    password = "SecurePassword123!"

    # 1. Signup
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": unique_email,
            "password": password,
            "full_name": "Test Highway Inspector",
            "role": "inspector",
        },
    )
    assert signup_res.status_code == 201
    signup_data = signup_res.json()
    assert "access_token" in signup_data
    token = signup_data["access_token"]
    assert signup_data["user"]["email"] == unique_email.lower()
    assert signup_data["user"]["full_name"] == "Test Highway Inspector"

    # 2. Reject Duplicate Signup
    dup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "email": unique_email,
            "password": password,
            "full_name": "Duplicate Inspector",
            "role": "inspector",
        },
    )
    assert dup_res.status_code == 400

    # 3. Successful Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": password},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # 4. Bad Password Login
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": "WrongPassword"},
    )
    assert bad_login.status_code == 401

    # 5. Access Protected /auth/me Profile
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == unique_email.lower()
    assert me_data["role"] == "inspector"

    # 6. Unauthenticated /auth/me returns 401
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401
