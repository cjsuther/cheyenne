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
    beneficiarios_router, cuentas_router, op_router, egresos_router,
    cajas_router,
    recaudacion_lotes_router,
    recibo_publicacion_lotes_router,
    pago_rendicion_lotes_router,
    registro_contable_lotes_router,
    listas_router,
    entidades_router,
    dependencias_router,
    recaudadoras_router,
    archivos_router,
    observaciones_router,
    cheques_router, chequeras_router, ob_router, conc_router,
    retenciones_router, op_pago_router, prog_router, embargos_router, poderes_router,
)

# Ensure all models are imported so Base.metadata knows about them
import models  # noqa: F401

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Módulo Tesorería",
    description="Gestión de tesorería, recaudación, cajas, registros contables y rendiciones",
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

app.add_middleware(AuditMiddleware, modulo="tesoreria")

app.include_router(cajas_router)
app.include_router(recaudacion_lotes_router)
app.include_router(recibo_publicacion_lotes_router)
app.include_router(pago_rendicion_lotes_router)
app.include_router(registro_contable_lotes_router)
app.include_router(listas_router)
app.include_router(entidades_router)
app.include_router(beneficiarios_router)
app.include_router(cuentas_router)
app.include_router(op_router)
app.include_router(egresos_router)
app.include_router(dependencias_router)
app.include_router(recaudadoras_router)
app.include_router(archivos_router)
app.include_router(observaciones_router)
app.include_router(chequeras_router)
app.include_router(cheques_router)
app.include_router(ob_router)
app.include_router(conc_router)
app.include_router(retenciones_router)
app.include_router(op_pago_router)
app.include_router(prog_router)
app.include_router(embargos_router)
app.include_router(poderes_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "tesoreria"}
