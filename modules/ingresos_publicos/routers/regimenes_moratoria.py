import sys
import os
from typing import List, Optional
from datetime import date, datetime
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
from models.regimen_moratoria import RegimenMoratoria

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/regimenes-moratoria", tags=["Regimenes de Moratoria"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class RegimenCreate(BaseModel):
    nombre: str
    quita_intereses_pct: Decimal = Decimal("0")
    anticipo_pct: Decimal = Decimal("0")
    cuotas_max: int = 12
    tasa_financiacion: Decimal = Decimal("0")
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: bool = True


class RegimenUpdate(BaseModel):
    nombre: Optional[str] = None
    quita_intereses_pct: Optional[Decimal] = None
    anticipo_pct: Optional[Decimal] = None
    cuotas_max: Optional[int] = None
    tasa_financiacion: Optional[Decimal] = None
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: Optional[bool] = None


class RegimenResponse(BaseModel):
    id: int
    nombre: str
    quita_intereses_pct: Decimal
    anticipo_pct: Decimal
    cuotas_max: int
    tasa_financiacion: Decimal
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[RegimenResponse])
def list_regimenes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RegimenMoratoria)
    if activo is not None:
        query = query.filter(RegimenMoratoria.activo == activo)
    query = filtered_query(query, RegimenMoratoria, dict(request.query_params),
                           exclude={"skip", "limit", "activo"}, default_sort="id")
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RegimenResponse)
def get_regimen(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    x = db.query(RegimenMoratoria).filter(RegimenMoratoria.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Regimen {id} no encontrado")
    return x


@router.post("", response_model=RegimenResponse, status_code=201)
def create_regimen(data: RegimenCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_planes")
    x = RegimenMoratoria(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}", response_model=RegimenResponse)
def update_regimen(id: int, data: RegimenUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_planes")
    x = db.query(RegimenMoratoria).filter(RegimenMoratoria.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Regimen {id} no encontrado")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def delete_regimen(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_planes")
    x = db.query(RegimenMoratoria).filter(RegimenMoratoria.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Regimen {id} no encontrado")
    x.activo = False; db.commit()
    return {"message": f"Regimen {id} dado de baja"}
