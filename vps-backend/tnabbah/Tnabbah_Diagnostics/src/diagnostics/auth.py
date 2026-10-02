"""
Supabase JWT authentication helpers for tnabbah diagnostics.

The mobile app/web SPA authenticates with Supabase Auth and receives a
signed JWT. The algorithm depends on the project's signing key:

  * Asymmetric (ES256 / RS256) — the current Supabase default, e.g. an
    ECC (P-256) signing key. Verified against the project's public keys
    fetched from ``{SUPABASE_URL}/auth/v1/.well-known/jwks.json``.
  * Symmetric (HS256) — legacy, verified with ``SUPABASE_JWT_SECRET``.

The token's ``alg`` header is inspected and the matching verifier is used,
so the backend keeps working across a signing-key rotation. Every protected
endpoint in this backend must:

  1) Extract the bearer token from the ``Authorization`` header.
  2) Verify the signature + expiry (JWKS for ES256/RS256, secret for HS256).
  3) Use the ``sub`` claim as the canonical user id.
  4) Refuse the request if the user id in the body/path/query does not
     match the authenticated user (``ensure_owner``).

Environment variables:
    SUPABASE_URL             — required for ES256/RS256 (asymmetric) tokens;
                               used to locate the project's JWKS endpoint.
    SUPABASE_JWT_SECRET      — required only for legacy HS256 tokens.
    SUPABASE_JWT_AUDIENCE    — defaults to "authenticated".
    TNABBAH_DISABLE_AUTH     — "true" to bypass JWT in local dev only.
    TNABBAH_DEV_USER_ID      — required when auth is disabled, used as
                               the synthetic user id for every request.
"""
from __future__ import annotations

import logging
import os
from typing import Optional

from fastapi import Header, HTTPException, status

try:
    import jwt  # PyJWT
except ImportError:  # pragma: no cover - dependency missing
    jwt = None  # type: ignore[assignment]

logger = logging.getLogger(__name__)

# Env vars are read lazily (at request time) rather than at import time. This
# guarantees correct values regardless of when python-dotenv's load_dotenv()
# runs relative to this module being imported.
def _jwt_secret() -> str:
    return os.getenv("SUPABASE_JWT_SECRET", "").strip()


def _supabase_url() -> str:
    return os.getenv("SUPABASE_URL", "").strip().rstrip("/")


def _jwt_audience() -> str:
    return os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated").strip() or "authenticated"


def _auth_disabled() -> bool:
    return os.getenv("TNABBAH_DISABLE_AUTH", "false").lower() in ("true", "1", "yes", "on")


def _dev_user_id() -> str:
    return os.getenv("TNABBAH_DEV_USER_ID", "").strip()


# Lazily-created JWKS client for verifying asymmetric (ES256/RS256) Supabase
# tokens. PyJWKClient fetches and caches the project's public signing keys
# from {SUPABASE_URL}/auth/v1/.well-known/jwks.json.
_jwks_client = None


def _get_jwks_client():
    """Return a cached PyJWKClient for the Supabase project, or None."""
    global _jwks_client
    url = _supabase_url()
    if jwt is None or not url:
        return None
    if _jwks_client is None:
        jwks_url = f"{url}/auth/v1/.well-known/jwks.json"
        _jwks_client = jwt.PyJWKClient(jwks_url)
    return _jwks_client


def _extract_bearer(authorization: Optional[str]) -> str:
    """Return the raw token from a ``Bearer <token>`` header, or 401."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    parts = authorization.split(None, 1)
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return parts[1].strip()


def verify_supabase_jwt(token: str) -> str:
    """Verify a Supabase JWT and return the ``sub`` (user id) claim.

    Supports both signing schemes Supabase may use:
      * HS256 — symmetric, verified with ``SUPABASE_JWT_SECRET`` (legacy).
      * ES256 / RS256 — asymmetric signing keys, verified against the
        project's public JWKS (``SUPABASE_URL`` must be set).

    The algorithm is read from the token header and the matching verifier
    is used, so the backend keeps working across a signing-key rotation.
    """
    if jwt is None:
        logger.error("PyJWT not installed; cannot verify Supabase token")
        raise HTTPException(status_code=503, detail="Authentication not configured")

    try:
        alg = str(jwt.get_unverified_header(token).get("alg") or "").upper()
    except jwt.InvalidTokenError as exc:
        logger.debug("Malformed JWT header: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    try:
        if alg == "HS256":
            secret = _jwt_secret()
            if not secret:
                logger.error("SUPABASE_JWT_SECRET is not set; cannot verify HS256 token")
                raise HTTPException(status_code=503, detail="Authentication not configured")
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                audience=_jwt_audience(),
                options={"require": ["exp", "sub"]},
            )
        elif alg in ("ES256", "RS256"):
            client = _get_jwks_client()
            if client is None:
                logger.error("SUPABASE_URL is not set; cannot verify %s token via JWKS", alg)
                raise HTTPException(status_code=503, detail="Authentication not configured")
            try:
                signing_key = client.get_signing_key_from_jwt(token)
            except Exception as exc:  # PyJWKClientError / network failures
                logger.error("Failed to fetch JWKS signing key: %s", exc)
                raise HTTPException(status_code=503, detail="Authentication not configured")
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                audience=_jwt_audience(),
                options={"require": ["exp", "sub"]},
            )
        else:
            logger.warning("Unsupported JWT algorithm: %s", alg)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unsupported token algorithm",
                headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )
    except jwt.InvalidTokenError as exc:
        logger.debug("JWT verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": 'Bearer error="invalid_token"'},
        )

    sub = str(payload.get("sub") or "").strip()
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing sub")
    return sub


async def current_user(
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
) -> str:
    """FastAPI dependency returning the authenticated Supabase user id.

    Setting ``TNABBAH_DISABLE_AUTH=true`` together with ``TNABBAH_DEV_USER_ID``
    bypasses verification — local development only. Never enable in production.
    """
    if _auth_disabled():
        dev_user_id = _dev_user_id()
        if not dev_user_id:
            raise HTTPException(
                status_code=503,
                detail="Auth disabled but TNABBAH_DEV_USER_ID not set",
            )
        logger.warning("⚠️ Auth disabled — using TNABBAH_DEV_USER_ID for request")
        return dev_user_id

    token = _extract_bearer(authorization)
    return verify_supabase_jwt(token)


def ensure_owner(authenticated_uid: str, requested_user_id: str) -> None:
    """403 if the JWT subject does not match the user_id in the request."""
    if not requested_user_id or authenticated_uid != requested_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id does not match authenticated user",
        )
