"""
Base module template for creating new Cheyenne microservices.
Each module follows this pattern for consistency.
"""
import sys
import os
import asyncio
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx


security_scheme = HTTPBearer()

# Reintentos para la verificación de token contra seguridad (camino caliente de TODOS los módulos).
# Solo se reintenta ante fallos transitorios (red/5xx); un 401/403 es definitivo y no se reintenta.
AUTH_MAX_INTENTOS = 3
AUTH_TIMEOUT = 5.0
AUTH_BACKOFF = 0.2  # segundos, incremental por intento


def create_auth_dependency(seguridad_url: str):
    """Creates a dependency that validates tokens against the seguridad module (con reintentos)."""

    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    ) -> dict:
        token = credentials.credentials
        ultimo_error = None
        for intento in range(AUTH_MAX_INTENTOS):
            try:
                async with httpx.AsyncClient(timeout=AUTH_TIMEOUT) as client:
                    response = await client.get(
                        f"{seguridad_url}/auth/me",
                        headers={"Authorization": f"Bearer {token}"},
                    )
                if response.status_code == 200:
                    return response.json()
                if response.status_code in (401, 403):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Token inválido o sesión expirada",
                    )
                # 5xx u otros: transitorio -> reintentar
                ultimo_error = f"HTTP {response.status_code}"
            except httpx.RequestError as e:
                ultimo_error = str(e) or type(e).__name__
            if intento < AUTH_MAX_INTENTOS - 1:
                await asyncio.sleep(AUTH_BACKOFF * (intento + 1))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Servicio de seguridad no disponible ({ultimo_error})",
        )

    return get_current_user


def create_permission_dependency(seguridad_url: str, codigo_permiso: str):
    """Creates a dependency that checks permissions via the seguridad module."""
    get_current_user = create_auth_dependency(seguridad_url)

    async def require_permission(
        current_user: dict = Depends(get_current_user),
    ) -> dict:
        if current_user.get("superuser"):
            return current_user
        permisos = [p["codigo"] for p in current_user.get("permisos", [])]
        if codigo_permiso not in permisos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tiene el permiso '{codigo_permiso}'",
            )
        return current_user

    return require_permission
