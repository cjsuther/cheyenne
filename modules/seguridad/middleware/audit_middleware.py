import asyncio
import logging
from datetime import datetime, timezone
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("seguridad.audit")


async def _log_audit(method: str, path: str, status_code: int, user_info: str):
    logger.info(
        "AUDIT | %s | %s %s | status=%d | user=%s",
        datetime.now(timezone.utc).isoformat(),
        method,
        path,
        status_code,
        user_info,
    )


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        user_info = "anonymous"
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            user_info = f"token:{auth_header[7:20]}..."

        asyncio.create_task(
            _log_audit(
                request.method,
                str(request.url.path),
                response.status_code,
                user_info,
            )
        )

        return response
