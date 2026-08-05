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
    categorias_router, tipos_cargo_router, cargos_funciones_router, niveles_laboral_router,
    tipos_relacion_router, oficinas_router, parentescos_router, tipos_antiguedad_router,
    sindicatos_router, obras_sociales_router,
    legajos_router, legajo_cargos_router, antiguedades_router, familiares_router,
    presupuesto_cargos_router,
    conceptos_router, tipos_liquidacion_router, novedades_router,
    liquidar_router, procesos_router,
    motivos_ausencia_router, ausencias_router, licencias_anuales_router,
    horas_extra_router, embargos_router,
    ganancias_deducciones_router, ganancias_escala_router, ganancias_resumen_router,
    legajo_ganancias_router,
    integracion_router,
)
import models  # noqa: F401

settings = get_settings()
app = FastAPI(title="Cheyenne - Módulo Recursos Humanos",
              description="RRHH: maestros, legajo, cargos, antigüedad, familiares, planta, conceptos y liquidación",
              version="2.0.0", redirect_slashes=False)
app.add_middleware(CORSMiddleware, allow_origins=["*"] if settings.environment == "development" else [],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(AuditMiddleware, modulo="rrhh")
for r in (categorias_router, tipos_cargo_router, cargos_funciones_router, niveles_laboral_router,
          tipos_relacion_router, oficinas_router, parentescos_router, tipos_antiguedad_router,
          sindicatos_router, obras_sociales_router,
          legajos_router, legajo_cargos_router, antiguedades_router, familiares_router,
          presupuesto_cargos_router,
          conceptos_router, tipos_liquidacion_router, novedades_router,
          liquidar_router, procesos_router,
          motivos_ausencia_router, ausencias_router, licencias_anuales_router,
          horas_extra_router, embargos_router,
          ganancias_deducciones_router, ganancias_escala_router, ganancias_resumen_router,
          legajo_ganancias_router,
          integracion_router):
    app.include_router(r)


@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "module": "rrhh"}
