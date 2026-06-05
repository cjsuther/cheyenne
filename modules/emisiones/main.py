import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import engine
from shared.database import Base
from routers import emisiones_router

# Import all models so they register with Base.metadata
import models  # noqa: F401

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Modulo Emisiones",
    description="Gestion de emisiones tributarias, liquidaciones y cuentas corrientes",
    version="1.0.0",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.environment == "development" else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Audit middleware
import asyncio
import logging
from datetime import datetime, timezone
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("emisiones.audit")


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


app.add_middleware(AuditMiddleware)

app.include_router(emisiones_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "emisiones"}
