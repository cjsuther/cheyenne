import sys, os
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import engine
from shared.database import Base
from shared.audit_middleware import AuditMiddleware
from routers import (
    cuentas_router, ejercicios_router, asientos_router, libros_router,
    transacciones_router, reglas_router, mapeo_router,
)
import models  # noqa: F401

settings = get_settings()
app = FastAPI(title="Cheyenne - Módulo Contabilidad",
              description="Contabilidad general: plan de cuentas, ejercicios, asientos (partida doble) y libros",
              version="1.0.0", redirect_slashes=False)
app.add_middleware(CORSMiddleware, allow_origins=["*"] if settings.environment == "development" else [],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(AuditMiddleware, modulo="contabilidad")
for r in (cuentas_router, ejercicios_router, asientos_router, libros_router,
          transacciones_router, reglas_router, mapeo_router):
    app.include_router(r)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "contabilidad"}
