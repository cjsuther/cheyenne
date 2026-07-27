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
from routers import (
    personas_router,
    expedientes_router,
    listas_router,
    entidades_router,
    direcciones_router,
    contactos_router,
    archivos_router,
    observaciones_router,
    documentos_router,
    medios_pago_router,
    etiquetas_router,
    entidad_definiciones_router,
    paises_router,
    provincias_router,
    localidades_router,
    cuentas_contables_router,
    jurisdicciones_router,
    recursos_por_rubro_router,
)

# Import all models so they register with Base.metadata
import models  # noqa: F401

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Módulo Administración",
    description="Gestión de personas, expedientes, entidades y datos administrativos",
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


app.add_middleware(AuditMiddleware, modulo="administracion")

app.include_router(personas_router)
app.include_router(expedientes_router)
app.include_router(listas_router)
app.include_router(entidades_router)
app.include_router(direcciones_router)
app.include_router(contactos_router)
app.include_router(archivos_router)
app.include_router(observaciones_router)
app.include_router(documentos_router)
app.include_router(medios_pago_router)
app.include_router(etiquetas_router)
app.include_router(entidad_definiciones_router)
app.include_router(paises_router)
app.include_router(provincias_router)
app.include_router(localidades_router)
app.include_router(cuentas_contables_router)
app.include_router(jurisdicciones_router)
app.include_router(recursos_por_rubro_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "administracion"}
