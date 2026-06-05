import sys
import os
from typing import List, Optional
from datetime import date, datetime

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.certificado import Certificado

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/certificados", tags=["Certificados"])


class CertificadoCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_certificado: int
    numero_certificado: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: int = 10
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None


class CertificadoUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_certificado: Optional[int] = None
    numero_certificado: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: Optional[int] = None
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None


class CertificadoResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_tipo_certificado: int
    numero_certificado: Optional[str] = None
    fecha_emision: datetime
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: int
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None

    class Config:
        from_attributes = True


@router.get("", response_model=List[CertificadoResponse])
def list_certificados(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    id_cuenta: Optional[int] = Query(None),
    id_tipo_certificado: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Certificado)
    if id_cuenta is not None:
        query = query.filter(Certificado.id_cuenta == id_cuenta)
    if id_tipo_certificado is not None:
        query = query.filter(Certificado.id_tipo_certificado == id_tipo_certificado)
    query = filtered_query(query, Certificado, dict(request.query_params), exclude={'skip', 'limit', 'id_cuenta', 'id_tipo_certificado'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=CertificadoResponse)
def get_certificado(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    return certificado


@router.post("", response_model=CertificadoResponse, status_code=201)
def create_certificado(
    data: CertificadoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = Certificado(**data.model_dump())
    db.add(certificado)
    db.commit()
    db.refresh(certificado)
    return certificado


@router.put("/{id}", response_model=CertificadoResponse)
def update_certificado(
    id: int,
    data: CertificadoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(certificado, key, value)
    db.commit()
    db.refresh(certificado)
    return certificado


@router.delete("/{id}")
def delete_certificado(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    certificado.id_estado_certificado = 90  # Anulado
    db.commit()
    return {"message": f"Certificado {id} anulado"}
