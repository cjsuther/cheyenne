import sys
import os
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.exencion import Exencion

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/exenciones", tags=["Exenciones"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class ExencionCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    id_tasa: Optional[int] = None
    motivo: Optional[str] = None
    porcentaje: Decimal = Decimal("100")
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    acto_administrativo: Optional[str] = None
    activo: bool = True


class ExencionUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    id_tasa: Optional[int] = None
    motivo: Optional[str] = None
    porcentaje: Optional[Decimal] = None
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    acto_administrativo: Optional[str] = None
    activo: Optional[bool] = None


class ExencionResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    id_tasa: Optional[int] = None
    motivo: Optional[str] = None
    porcentaje: Decimal
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    acto_administrativo: Optional[str] = None
    activo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


def _vigentes_query(db: Session, hoy: date):
    """Filtra exenciones activas y con vigencia que abarca `hoy` (fechas null = sin límite)."""
    return (
        db.query(Exencion)
        .filter(Exencion.activo == True)  # noqa: E712
        .filter(or_(Exencion.vigencia_desde == None, Exencion.vigencia_desde <= hoy))  # noqa: E711
        .filter(or_(Exencion.vigencia_hasta == None, Exencion.vigencia_hasta >= hoy))  # noqa: E711
    )


# ── Consulta de vigentes (ANTES de /{id}) — la usa emisiones al liquidar ──

@router.get("/vigentes", response_model=List[ExencionResponse])
def exenciones_vigentes(
    id_cuenta: Optional[int] = Query(None),
    id_contribuyente: Optional[int] = Query(None),
    id_tasa: Optional[int] = Query(None),
    fecha: Optional[date] = Query(None, description="Fecha de referencia; por defecto hoy"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Exenciones vigentes de una cuenta/contribuyente a una fecha. Consumido por emisiones (HTTP)."""
    if id_cuenta is None and id_contribuyente is None:
        raise HTTPException(status_code=400, detail="Indique id_cuenta o id_contribuyente")
    hoy = fecha or date.today()
    q = _vigentes_query(db, hoy)
    conds = []
    if id_cuenta is not None:
        conds.append(Exencion.id_cuenta == id_cuenta)
    if id_contribuyente is not None:
        conds.append(Exencion.id_contribuyente == id_contribuyente)
    q = q.filter(or_(*conds))
    if id_tasa is not None:
        # exención específica de la tasa o exención general (id_tasa null)
        q = q.filter(or_(Exencion.id_tasa == id_tasa, Exencion.id_tasa == None))  # noqa: E711
    return q.order_by(Exencion.id).all()


@router.get("", response_model=List[ExencionResponse])
def list_exenciones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    id_cuenta: Optional[int] = Query(None),
    id_contribuyente: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "ingresos_exenciones")
    query = db.query(Exencion)
    if id_cuenta is not None:
        query = query.filter(Exencion.id_cuenta == id_cuenta)
    if id_contribuyente is not None:
        query = query.filter(Exencion.id_contribuyente == id_contribuyente)
    query = filtered_query(query, Exencion, dict(request.query_params),
                           exclude={"skip", "limit", "id_cuenta", "id_contribuyente"}, default_sort="id")
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ExencionResponse)
def get_exencion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_exenciones")
    x = db.query(Exencion).filter(Exencion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Exencion {id} no encontrada")
    return x


@router.post("", response_model=ExencionResponse, status_code=201)
def create_exencion(data: ExencionCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_exenciones")
    if data.id_cuenta is None and data.id_contribuyente is None:
        raise HTTPException(status_code=400, detail="Indique id_cuenta o id_contribuyente")
    x = Exencion(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}", response_model=ExencionResponse)
def update_exencion(id: int, data: ExencionUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_exenciones")
    x = db.query(Exencion).filter(Exencion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Exencion {id} no encontrada")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def delete_exencion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_exenciones")
    x = db.query(Exencion).filter(Exencion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Exencion {id} no encontrada")
    x.activo = False; db.commit()
    return {"message": f"Exencion {id} dada de baja"}
