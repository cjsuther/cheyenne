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
from models.multa import Multa

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/multas", tags=["Multas"])


class MultaCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_multa: int
    numero_multa: Optional[str] = None
    importe: Decimal
    fecha_vencimiento: Optional[date] = None
    id_estado_multa: int = 10
    detalle: Optional[str] = None


class MultaUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_multa: Optional[int] = None
    numero_multa: Optional[str] = None
    importe: Optional[Decimal] = None
    fecha_vencimiento: Optional[date] = None
    id_estado_multa: Optional[int] = None
    detalle: Optional[str] = None


class MultaResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_tipo_multa: int
    numero_multa: Optional[str] = None
    importe: Decimal
    fecha_alta: datetime
    fecha_vencimiento: Optional[date] = None
    id_estado_multa: int
    detalle: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[MultaResponse])
def list_multas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    id_cuenta: Optional[int] = Query(None),
    id_tipo_multa: Optional[int] = Query(None),
    id_estado_multa: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Multa)
    if id_cuenta is not None:
        query = query.filter(Multa.id_cuenta == id_cuenta)
    if id_tipo_multa is not None:
        query = query.filter(Multa.id_tipo_multa == id_tipo_multa)
    if id_estado_multa is not None:
        query = query.filter(Multa.id_estado_multa == id_estado_multa)
    query = filtered_query(query, Multa, dict(request.query_params), exclude={'skip', 'limit', 'id_cuenta', 'id_tipo_multa', 'id_estado_multa'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=MultaResponse)
def get_multa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    multa = db.query(Multa).filter(Multa.id == id).first()
    if not multa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Multa {id} no encontrada",
        )
    return multa


@router.get("/by-cuenta/{id_cuenta}", response_model=List[MultaResponse])
def list_multas_by_cuenta(
    id_cuenta: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return (
        db.query(Multa)
        .filter(Multa.id_cuenta == id_cuenta)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("", response_model=MultaResponse, status_code=201)
def create_multa(
    data: MultaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    multa = Multa(**data.model_dump())
    db.add(multa)
    db.commit()
    db.refresh(multa)
    return multa


@router.put("/{id}", response_model=MultaResponse)
def update_multa(
    id: int,
    data: MultaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    multa = db.query(Multa).filter(Multa.id == id).first()
    if not multa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Multa {id} no encontrada",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(multa, key, value)
    db.commit()
    db.refresh(multa)
    return multa


@router.delete("/{id}")
def delete_multa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    multa = db.query(Multa).filter(Multa.id == id).first()
    if not multa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Multa {id} no encontrada",
        )
    multa.id_estado_multa = 90  # Anulada
    db.commit()
    return {"message": f"Multa {id} anulada"}
