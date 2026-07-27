"""Middleware de auditoría compartido.

Registra cada request (método, ruta, status, usuario, módulo, duración) enviándolo
de forma NO bloqueante al módulo `auditoria` (POST /eventos). Si auditoria no responde,
nunca falla ni demora el request principal (fire-and-forget + swallow de errores).
"""
import asyncio
import base64
import json
import logging
import os
import time

import httpx
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("audit")

# no auditar salud/documentación ni la verificación interna de token
SKIP_PATHS = {"/health", "/docs", "/openapi.json", "/redoc", "/favicon.ico", "/auth/me"}

AUDITORIA_URL = os.environ.get("AUDITORIA_URL", "http://auditoria:8000")
AUDIT_KEY = os.environ.get("AUDIT_INGEST_KEY", "cheyenne-audit")


def _usuario_desde_token(auth_header: str):
    """Decodifica el payload del JWT (sin verificar firma, solo para el rastro)."""
    try:
        if not auth_header.startswith("Bearer "):
            return None, None
        payload_b64 = auth_header[7:].split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        claims = json.loads(base64.urlsafe_b64decode(payload_b64))
        uid = claims.get("sub")
        try:
            uid = int(uid)
        except (TypeError, ValueError):
            uid = None
        return uid, claims.get("codigo") or claims.get("username")
    except Exception:
        return None, None


async def _post_evento(evento: dict):
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(f"{AUDITORIA_URL}/eventos", json=evento,
                              headers={"X-Audit-Token": AUDIT_KEY})
    except Exception as e:  # auditoria caída / timeout: no rompe el request
        logger.debug("no se pudo registrar el evento de auditoría: %s", e)


class AuditMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, modulo: str = None):
        super().__init__(app)
        self.modulo = modulo

    async def dispatch(self, request: Request, call_next):
        t0 = time.perf_counter()
        response = await call_next(request)

        path = request.url.path
        # evita ruido y el bucle de auditar la propia ingesta/listado de auditoria
        if request.method == "OPTIONS" or path in SKIP_PATHS or path.startswith("/eventos"):
            return response

        uid, uname = _usuario_desde_token(request.headers.get("authorization", ""))
        evento = {
            "modulo": self.modulo,
            "metodo": request.method,
            "path": path,
            "status_code": response.status_code,
            "id_usuario": uid,
            "usuario": uname,
            "ip": request.client.host if request.client else None,
            "duracion_ms": int((time.perf_counter() - t0) * 1000),
        }
        asyncio.create_task(_post_evento(evento))
        return response
