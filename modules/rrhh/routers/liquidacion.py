import sys
import os
from decimal import Decimal
from typing import Optional, List

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
    Concepto, TipoLiquidacion, Novedad, Legajo,
    LiquidacionProceso, LiquidacionRenglon, TotalesLiquidacion,
    TIPOS_CONCEPTO,
)
from services.liquidador import liquidar as _liquidar

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


# ═══ CONCEPTOS ════════════════════════════════════════════════════════
conceptos_router = APIRouter(prefix="/conceptos", tags=["Conceptos"])
_CON = ["id", "codigo", "descripcion", "tipo", "orden", "condicion", "cantidad",
        "base", "porcentaje", "formula", "aguinaldo", "activo"]


class ConceptoIn(BaseModel):
    codigo: str
    descripcion: str
    tipo: str = "H"
    orden: Decimal = Decimal("0")
    condicion: Optional[str] = None
    cantidad: Optional[str] = None
    base: Optional[str] = None
    porcentaje: Optional[str] = None
    formula: Optional[str] = None
    aguinaldo: bool = False
    activo: bool = True


def _valida_concepto(data):
    if data.tipo not in TIPOS_CONCEPTO:
        raise HTTPException(status_code=400, detail=f"Tipo inválido; use uno de {TIPOS_CONCEPTO}")


@conceptos_router.get("")
def listar_conceptos(request: Request, tipo: str = Query(None), skip: int = Query(0, ge=0),
                     limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Concepto).filter(Concepto.activo == True)
    if tipo:
        q = q.filter(Concepto.tipo == tipo)
    q = filtered_query(q, Concepto, dict(request.query_params),
                       exclude={"skip", "limit", "tipo"}, default_sort="orden")
    return [_ser(x, _CON) for x in q.offset(skip).limit(limit).all()]


@conceptos_router.get("/{id}")
def obtener_concepto(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Concepto).filter(Concepto.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Concepto inexistente")
    return _ser(x, _CON)


@conceptos_router.post("", status_code=201)
def crear_concepto(data: ConceptoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_concepto(data)
    codigo = data.codigo.strip()
    if db.query(Concepto).filter(Concepto.codigo == codigo).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
    payload = data.model_dump()
    payload["codigo"] = codigo
    x = Concepto(**payload); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _CON)


@conceptos_router.put("/{id}")
def editar_concepto(id: int, data: ConceptoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_concepto(data)
    x = db.query(Concepto).filter(Concepto.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Concepto inexistente")
    for k, v in data.model_dump().items():
        if k == "codigo":
            v = v.strip()
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _CON)


@conceptos_router.delete("/{id}")
def borrar_concepto(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Concepto).filter(Concepto.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Concepto inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ TIPOS DE LIQUIDACIÓN ═════════════════════════════════════════════
tipos_liquidacion_router = APIRouter(prefix="/tipos-liquidacion", tags=["Tipos de Liquidación"])
_TL = ["id", "codigo", "descripcion", "activo"]


class TipoLiquidacionIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


@tipos_liquidacion_router.get("")
def listar_tl(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
              db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(TipoLiquidacion).filter(TipoLiquidacion.activo == True)
    q = filtered_query(q, TipoLiquidacion, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_ser(x, _TL) for x in q.offset(skip).limit(limit).all()]


@tipos_liquidacion_router.get("/{id}")
def obtener_tl(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(TipoLiquidacion).filter(TipoLiquidacion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tipo de liquidación inexistente")
    return _ser(x, _TL)


@tipos_liquidacion_router.post("", status_code=201)
def crear_tl(data: TipoLiquidacionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    codigo = data.codigo.strip()
    if db.query(TipoLiquidacion).filter(TipoLiquidacion.codigo == codigo).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
    payload = data.model_dump()
    payload["codigo"] = codigo
    x = TipoLiquidacion(**payload); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _TL)


@tipos_liquidacion_router.put("/{id}")
def editar_tl(id: int, data: TipoLiquidacionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(TipoLiquidacion).filter(TipoLiquidacion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tipo de liquidación inexistente")
    for k, v in data.model_dump().items():
        if k == "codigo":
            v = v.strip()
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _TL)


@tipos_liquidacion_router.delete("/{id}")
def borrar_tl(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(TipoLiquidacion).filter(TipoLiquidacion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tipo de liquidación inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ NOVEDADES ════════════════════════════════════════════════════════
novedades_router = APIRouter(prefix="/novedades", tags=["Novedades"])
_NOV = ["id", "id_legajo", "variable", "valor", "anio", "mes", "descripcion", "activo"]


class NovedadIn(BaseModel):
    id_legajo: Optional[int] = None
    variable: str
    valor: Decimal = Decimal("0")
    anio: Optional[int] = None
    mes: Optional[int] = None
    descripcion: Optional[str] = None
    activo: bool = True


@novedades_router.get("")
def listar_nov(request: Request, id_legajo: int = Query(None), anio: int = Query(None),
               mes: int = Query(None), skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Novedad).filter(Novedad.activo == True)
    if id_legajo is not None:
        q = q.filter(Novedad.id_legajo == id_legajo)
    if anio is not None:
        q = q.filter(Novedad.anio == anio)
    if mes is not None:
        q = q.filter(Novedad.mes == mes)
    q = filtered_query(q, Novedad, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "anio", "mes"}, default_sort="id")
    return [_ser(x, _NOV) for x in q.offset(skip).limit(limit).all()]


@novedades_router.get("/{id}")
def obtener_nov(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Novedad).filter(Novedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Novedad inexistente")
    return _ser(x, _NOV)


@novedades_router.post("", status_code=201)
def crear_nov(data: NovedadIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if data.id_legajo is not None and not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = Novedad(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _NOV)


@novedades_router.put("/{id}")
def editar_nov(id: int, data: NovedadIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Novedad).filter(Novedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Novedad inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _NOV)


@novedades_router.delete("/{id}")
def borrar_nov(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Novedad).filter(Novedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Novedad inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ LIQUIDAR ═════════════════════════════════════════════════════════
liquidar_router = APIRouter(prefix="/liquidar", tags=["Liquidación"])


class LiquidarIn(BaseModel):
    anio: int
    mes: int
    tipo_liq: str
    valor_modulo: Decimal
    legajos_ids: Optional[List[int]] = None


@liquidar_router.post("")
def ejecutar_liquidacion(data: LiquidarIn, db: Session = Depends(get_db),
                         current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not (1 <= data.mes <= 12):
        raise HTTPException(status_code=400, detail="Mes inválido (1-12)")
    quien = current_user.get("username") or current_user.get("email") or str(current_user.get("id", ""))
    try:
        resumen = _liquidar(db, data.anio, data.mes, data.tipo_liq.strip(),
                            data.valor_modulo, legajos_ids=data.legajos_ids, quien=quien)
    except Exception as ex:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al liquidar: {ex}")
    return resumen


# ═══ PROCESOS DE LIQUIDACIÓN ══════════════════════════════════════════
procesos_router = APIRouter(prefix="/liquidacion-procesos", tags=["Procesos de Liquidación"])
_PROC = ["id", "anio", "mes", "id_tipo_liquidacion", "tipo_liq", "valor_modulo", "estado",
         "cantidad_legajos", "total_haberes", "total_retenciones", "total_neto",
         "creado_por", "activo"]
_TOT = ["id", "id_proceso", "id_legajo", "legajo_numero", "apellido_nombre", "haberes",
        "asig_familiar", "exentos", "retenciones", "descuentos", "aportes_patronales",
        "neto", "numero_recibo"]


@procesos_router.get("")
def listar_procesos(request: Request, anio: int = Query(None), mes: int = Query(None),
                    tipo_liq: str = Query(None), skip: int = Query(0, ge=0),
                    limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                    current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(LiquidacionProceso).filter(LiquidacionProceso.activo == True)
    if anio is not None:
        q = q.filter(LiquidacionProceso.anio == anio)
    if mes is not None:
        q = q.filter(LiquidacionProceso.mes == mes)
    if tipo_liq:
        q = q.filter(LiquidacionProceso.tipo_liq == tipo_liq)
    q = filtered_query(q, LiquidacionProceso, dict(request.query_params),
                       exclude={"skip", "limit", "anio", "mes", "tipo_liq"}, default_sort="id")
    return [_ser(x, _PROC) for x in q.offset(skip).limit(limit).all()]


@procesos_router.get("/{id}")
def obtener_proceso(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(LiquidacionProceso).filter(LiquidacionProceso.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Proceso inexistente")
    out = _ser(x, _PROC)
    out["totales"] = [_ser(t, _TOT) for t in
                      db.query(TotalesLiquidacion).filter(TotalesLiquidacion.id_proceso == id)
                      .order_by(TotalesLiquidacion.id).all()]
    return out
