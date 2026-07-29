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
    contribuyentes_router,
    cuentas_router,
    inmuebles_router,
    inmueble_valuaciones_router,
    inmueble_superficies_router,
    inmueble_frentes_router,
    padron_router,
    vehiculos_router,
    vehiculo_valuaciones_router,
    comercio_rubros_router,
    comercio_ddjj_router,
    comercios_router,
    emisiones_router,
    planes_pago_router,
    listas_router,
    certificados_router,
    multas_router,
    tasas_router,
    sub_tasas_router,
    personas_router,
    exenciones_router,
    titulares_router,
    regimenes_moratoria_router,
    fondeaderos_router,
    servicios_medidos_router,
    puestos_mercado_router,
    derechos_construccion_router,
)

# Import all models so they register with Base.metadata
import models  # noqa: F401

settings = get_settings()

app = FastAPI(
    title="Cheyenne - Módulo Ingresos Públicos",
    description="Gestión de tributos, contribuyentes, cuentas, emisiones y planes de pago",
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

app.add_middleware(AuditMiddleware, modulo="ingresos_publicos")

app.include_router(contribuyentes_router)
app.include_router(cuentas_router)
app.include_router(inmuebles_router)
app.include_router(inmueble_valuaciones_router)
app.include_router(inmueble_superficies_router)
app.include_router(inmueble_frentes_router)
app.include_router(padron_router)
app.include_router(vehiculos_router)
app.include_router(vehiculo_valuaciones_router)
app.include_router(comercio_rubros_router)
app.include_router(comercio_ddjj_router)
app.include_router(comercios_router)
app.include_router(emisiones_router)
app.include_router(planes_pago_router)
app.include_router(listas_router)
app.include_router(certificados_router)
app.include_router(multas_router)
app.include_router(tasas_router)
app.include_router(sub_tasas_router)
app.include_router(personas_router)
app.include_router(exenciones_router)
app.include_router(titulares_router)
app.include_router(regimenes_moratoria_router)
app.include_router(fondeaderos_router)
app.include_router(servicios_medidos_router)
app.include_router(puestos_mercado_router)
app.include_router(derechos_construccion_router)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "ingresos-publicos"}
