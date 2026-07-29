import sys
import os
from datetime import date
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func, case
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.extracontable import MovimientoExtracontable, TIPOS_MOV

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


router = APIRouter(prefix="/extracontables", tags=["Fondos de terceros"])


def _ser(m: MovimientoExtracontable):
    return {
        "id": m.id, "concepto": m.concepto, "tipo": m.tipo, "importe": float(m.importe),
        "beneficiario": m.beneficiario, "referencia": m.referencia,
        "fecha": m.fecha.isoformat() if m.fecha else None,
        "observaciones": m.observaciones, "creado_por": m.creado_por,
        "created_at": m.created_at, "activo": m.activo,
    }


class MovExtraIn(BaseModel):
    concepto: str
    tipo: str
    importe: Decimal
    beneficiario: Optional[str] = None
    referencia: Optional[str] = None
    fecha: Optional[date] = None
    observaciones: Optional[str] = None


def _validar(data: MovExtraIn):
    if data.tipo not in TIPOS_MOV:
        raise HTTPException(status_code=400, detail=f"Tipo inválido. Use uno de: {', '.join(TIPOS_MOV)}")
    if data.importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
    if not data.concepto.strip():
        raise HTTPException(status_code=400, detail="El concepto es obligatorio")


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_read")
    q = db.query(MovimientoExtracontable).filter(MovimientoExtracontable.activo == True)
    q = filtered_query(q, MovimientoExtracontable, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_ser(m) for m in q.offset(skip).limit(limit).all()]


@router.get("/saldos")
def saldos(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Saldo por concepto = suma de ingresos - suma de egresos (fondos de terceros disponibles)."""
    _requiere(current_user, "contaduria_read")
    signo = case((MovimientoExtracontable.tipo == "ingreso", MovimientoExtracontable.importe),
                 else_=-MovimientoExtracontable.importe)
    rows = (db.query(
                MovimientoExtracontable.concepto,
                func.coalesce(func.sum(signo), 0).label("saldo"),
                func.count(MovimientoExtracontable.id).label("movimientos"))
            .filter(MovimientoExtracontable.activo == True)
            .group_by(MovimientoExtracontable.concepto)
            .order_by(MovimientoExtracontable.concepto).all())
    return [{"concepto": r.concepto, "saldo": float(r.saldo or 0), "movimientos": int(r.movimientos)} for r in rows]


@router.post("", status_code=201)
def crear(data: MovExtraIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_write")
    _validar(data)
    m = MovimientoExtracontable(**data.model_dump())
    m.concepto = m.concepto.strip()
    m.creado_por = _quien(current_user)
    db.add(m); db.commit(); db.refresh(m)
    return _ser(m)


@router.put("/{id}")
def editar(id: int, data: MovExtraIn, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_write")
    _validar(data)
    m = db.query(MovimientoExtracontable).filter(MovimientoExtracontable.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Movimiento inexistente")
    for k, v in data.model_dump().items():
        setattr(m, k, v)
    db.commit(); db.refresh(m)
    return _ser(m)


@router.delete("/{id}")
def baja(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_delete")
    m = db.query(MovimientoExtracontable).filter(MovimientoExtracontable.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Movimiento inexistente")
    m.activo = False; db.commit()
    return {"message": "dado de baja"}
