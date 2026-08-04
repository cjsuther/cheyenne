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
from models.rrhh import PresupuestoCargo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


_PC = ["id", "anio", "id_categoria", "id_tipo_cargo", "objeto_gasto",
       "cantidad_cargos", "costo_anual", "activo"]


def _ser(x):
    out = {}
    for c in _PC:
        v = getattr(x, c)
        if isinstance(v, Decimal):
            v = float(v)
        out[c] = v
    return out


presupuesto_cargos_router = APIRouter(prefix="/presupuesto-cargos", tags=["Planta presupuestaria"])


class PresupuestoCargoIn(BaseModel):
    anio: int
    id_categoria: Optional[int] = None
    id_tipo_cargo: Optional[int] = None
    objeto_gasto: Optional[str] = None
    cantidad_cargos: int = 0
    costo_anual: Decimal = Decimal("0")
    activo: bool = True


@presupuesto_cargos_router.get("")
def listar(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
           limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(PresupuestoCargo).filter(PresupuestoCargo.activo == True)
    if anio:
        q = q.filter(PresupuestoCargo.anio == anio)
    q = filtered_query(q, PresupuestoCargo, dict(request.query_params),
                       exclude={"skip", "limit", "anio"}, default_sort="anio")
    return [_ser(x) for x in q.offset(skip).limit(limit).all()]


@presupuesto_cargos_router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(PresupuestoCargo).filter(PresupuestoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo presupuestado inexistente")
    return _ser(x)


@presupuesto_cargos_router.post("", status_code=201)
def crear(data: PresupuestoCargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = PresupuestoCargo(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x)


@presupuesto_cargos_router.put("/{id}")
def editar(id: int, data: PresupuestoCargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(PresupuestoCargo).filter(PresupuestoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo presupuestado inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x)


@presupuesto_cargos_router.delete("/{id}")
def borrar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(PresupuestoCargo).filter(PresupuestoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo presupuestado inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
