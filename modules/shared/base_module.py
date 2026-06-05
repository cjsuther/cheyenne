"""
Base module template for creating new Cheyenne microservices.
Each module follows this pattern for consistency.
"""
import sys
import os
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx


security_scheme = HTTPBearer()


def create_auth_dependency(seguridad_url: str):
    """Creates a dependency that validates tokens against the seguridad module."""

    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    ) -> dict:
        token = credentials.credentials
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{seguridad_url}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=10.0,
                )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token inválido o sesión expirada",
                )
            return response.json()
        except httpx.RequestError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Servicio de seguridad no disponible",
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
