import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import engine
from shared.database import Base
from shared.audit_middleware import AuditMiddleware
from routers import incidencias_router, listas_router, eventos_router, estadisticas_router, alertas_router

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Módulo Auditoría",
    description="Gestión de incidencias y auditoría del sistema",
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

app.add_middleware(AuditMiddleware, modulo="auditoria")

app.include_router(incidencias_router)
app.include_router(listas_router)
app.include_router(eventos_router)
app.include_router(estadisticas_router)
app.include_router(alertas_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "auditoria"}
