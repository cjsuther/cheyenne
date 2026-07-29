import sys
import os
from typing import Optional
from decimal import Decimal

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.puesto_mercado import PuestoMercado

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/puestos-mercado", tags=["Puestos de Mercado"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class PuestoIn(BaseModel):
    id_contribuyente: Optional[int] = None
    mercado: Optional[str] = None
    puesto_numero: Optional[str] = None
    rubro: Optional[str] = None
    superficie: Optional[Decimal] = None
    activo: bool = True


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           id_contribuyente: Optional[int] = Query(None),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    q = db.query(PuestoMercado)
    if id_contribuyente is not None:
        q = q.filter(PuestoMercado.id_contribuyente == id_contribuyente)
    q = filtered_query(q, PuestoMercado, dict(request.query_params),
                       exclude={"skip", "limit", "id_contribuyente"}, default_sort="id")
    return q.offset(skip).limit(limit).all()


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(PuestoMercado).filter(PuestoMercado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Puesto {id} no encontrado")
    return x


@router.post("", status_code=201)
def crear(data: PuestoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = PuestoMercado(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}")
def editar(id: int, data: PuestoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(PuestoMercado).filter(PuestoMercado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Puesto {id} no encontrado")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(PuestoMercado).filter(PuestoMercado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Puesto {id} no encontrado")
    x.activo = False
    db.commit()
    return {"message": f"Puesto {id} dado de baja"}
