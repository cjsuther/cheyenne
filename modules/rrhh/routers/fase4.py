"""FASE 4: Impuesto a las Ganancias (4ta categoría) y SAC (RRHH).

CRUD de deducciones personales anuales y escala progresiva, más consulta del resumen
mensual acumulado por legajo. La liquidación en sí la produce el motor (liquidador.py):
en el mensual retiene Ganancias por método mensualizado acumulado y en el SAC (tipo_liq
'SAC') liquida los conceptos marcados aguinaldo=True y retiene Ganancias sobre el SAC.

Sigue los patrones del módulo: auth create_auth_dependency + _requiere, filtered_query,
soft-delete `activo`, skip/limit<=100, serialización de Decimal.
"""
import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.rrhh import (
    Legajo, GananciasDeduccion, GananciasEscala, GananciasResumen, CONCEPTOS_DEDUCCION,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _ser(x, cols):
    out = {}
    for c in cols:
        v = getattr(x, c)
        if isinstance(v, Decimal):
            v = float(v)
        out[c] = v
    return out


# ═══ DEDUCCIONES PERSONALES ANUALES ═══════════════════════════════════
ganancias_deducciones_router = APIRouter(prefix="/ganancias-deducciones", tags=["Ganancias - Deducciones"])
_DED = ["id", "anio", "concepto", "importe_anual", "activo"]


class DeduccionIn(BaseModel):
    anio: int
    concepto: str
    importe_anual: Decimal = Decimal("0")
    activo: bool = True


def _valida_ded(data):
    if data.concepto not in CONCEPTOS_DEDUCCION:
        raise HTTPException(status_code=400, detail=f"Concepto inválido; use uno de {CONCEPTOS_DEDUCCION}")


@ganancias_deducciones_router.get("")
def listar_deducciones(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
                       limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(GananciasDeduccion).filter(GananciasDeduccion.activo == True)
    if anio is not None:
        q = q.filter(GananciasDeduccion.anio == anio)
    q = filtered_query(q, GananciasDeduccion, dict(request.query_params),
                       exclude={"skip", "limit", "anio"}, default_sort="concepto")
    return [_ser(x, _DED) for x in q.offset(skip).limit(limit).all()]


@ganancias_deducciones_router.get("/{id}")
def obtener_deduccion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(GananciasDeduccion).filter(GananciasDeduccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Deducción inexistente")
    return _ser(x, _DED)


@ganancias_deducciones_router.post("", status_code=201)
def crear_deduccion(data: DeduccionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_ded(data)
    dup = db.query(GananciasDeduccion).filter(
        GananciasDeduccion.anio == data.anio, GananciasDeduccion.concepto == data.concepto,
        GananciasDeduccion.activo == True).first()
    if dup:
        raise HTTPException(status_code=409, detail=f"Ya existe {data.concepto} para {data.anio}")
    x = GananciasDeduccion(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _DED)


@ganancias_deducciones_router.put("/{id}")
def editar_deduccion(id: int, data: DeduccionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_ded(data)
    x = db.query(GananciasDeduccion).filter(GananciasDeduccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Deducción inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _DED)


@ganancias_deducciones_router.delete("/{id}")
def borrar_deduccion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(GananciasDeduccion).filter(GananciasDeduccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Deducción inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ ESCALA PROGRESIVA (art. 94) ══════════════════════════════════════
ganancias_escala_router = APIRouter(prefix="/ganancias-escala", tags=["Ganancias - Escala"])
_ESC = ["id", "anio", "tramo", "desde", "hasta", "fijo", "porcentaje", "excedente_sobre", "activo"]


class EscalaIn(BaseModel):
    anio: int
    tramo: int = 0
    desde: Decimal = Decimal("0")
    hasta: Optional[Decimal] = None
    fijo: Decimal = Decimal("0")
    porcentaje: Decimal = Decimal("0")
    excedente_sobre: Decimal = Decimal("0")
    activo: bool = True


@ganancias_escala_router.get("")
def listar_escala(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
                  limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(GananciasEscala).filter(GananciasEscala.activo == True)
    if anio is not None:
        q = q.filter(GananciasEscala.anio == anio)
    q = filtered_query(q, GananciasEscala, dict(request.query_params),
                       exclude={"skip", "limit", "anio"}, default_sort="desde")
    return [_ser(x, _ESC) for x in q.offset(skip).limit(limit).all()]


@ganancias_escala_router.get("/{id}")
def obtener_escala(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(GananciasEscala).filter(GananciasEscala.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tramo inexistente")
    return _ser(x, _ESC)


@ganancias_escala_router.post("", status_code=201)
def crear_escala(data: EscalaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = GananciasEscala(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _ESC)


@ganancias_escala_router.put("/{id}")
def editar_escala(id: int, data: EscalaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(GananciasEscala).filter(GananciasEscala.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tramo inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _ESC)


@ganancias_escala_router.delete("/{id}")
def borrar_escala(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(GananciasEscala).filter(GananciasEscala.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tramo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ RESUMEN MENSUAL ACUMULADO ════════════════════════════════════════
ganancias_resumen_router = APIRouter(prefix="/ganancias-resumen", tags=["Ganancias - Resumen"])
_RES = ["id", "id_legajo", "anio", "mes", "id_proceso", "rem_neta_gravada", "deducciones",
        "ganancia_neta_acum", "impuesto_acum", "retencion_mes", "es_sac"]


@ganancias_resumen_router.get("")
def listar_resumen(request: Request, id_legajo: int = Query(None), anio: int = Query(None),
                   skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=100),
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(GananciasResumen)
    if id_legajo is not None:
        q = q.filter(GananciasResumen.id_legajo == id_legajo)
    if anio is not None:
        q = q.filter(GananciasResumen.anio == anio)
    q = filtered_query(q, GananciasResumen, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "anio"}, default_sort="mes")
    return [_ser(x, _RES) for x in q.offset(skip).limit(limit).all()]


# ═══ GANANCIAS POR LEGAJO (vista 360) ═════════════════════════════════
legajo_ganancias_router = APIRouter(prefix="/legajos", tags=["Ganancias - Legajo"])


@legajo_ganancias_router.get("/{id}/ganancias")
def ganancias_legajo(id: int, anio: int = Query(...), db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    """Detalle mensual del impuesto a las ganancias del legajo para el año dado,
    con totales anuales (retención acumulada e impuesto al último mes liquidado)."""
    _requiere(current_user, "rrhh_read")
    leg = db.query(Legajo).filter(Legajo.id == id).first()
    if not leg:
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    filas = (db.query(GananciasResumen)
             .filter(GananciasResumen.id_legajo == id, GananciasResumen.anio == anio)
             .order_by(GananciasResumen.mes, GananciasResumen.es_sac, GananciasResumen.id).all())
    total_retenido = sum((f.retencion_mes for f in filas), Decimal(0))
    impuesto_ultimo = max((f.impuesto_acum for f in filas), default=Decimal(0))
    return {
        "id_legajo": id,
        "apellido_nombre": leg.apellido_nombre,
        "anio": anio,
        "total_retenido": float(total_retenido),
        "impuesto_determinado": float(impuesto_ultimo),
        "meses": [_ser(f, _RES) for f in filas],
    }
