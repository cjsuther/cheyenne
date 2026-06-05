import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.persona import Persona

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/personas", tags=["Personas"])


class PersonaResponse(BaseModel):
    id: int
    id_tipo_persona: int
    id_tipo_documento: int
    numero_documento: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    denominacion: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True


@router.get("", response_model=List[PersonaResponse])
def list_personas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    id_tipo_persona: Optional[int] = Query(None),
    q: Optional[str] = Query(None, min_length=3, description="Buscar por nombre, apellido, denominacion o documento"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Persona).filter(Persona.activo == True)
    if id_tipo_persona is not None:
        query = query.filter(Persona.id_tipo_persona == id_tipo_persona)
    if q:
        term = f"%{q}%"
        query = query.filter(
            or_(
                Persona.nombre.ilike(term),
                Persona.apellido.ilike(term),
                Persona.denominacion.ilike(term),
                Persona.numero_documento.ilike(term),
            )
        )
    query = filtered_query(query, Persona, dict(request.query_params), exclude={'skip', 'limit', 'id_tipo_persona', 'q'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=PersonaResponse)
def get_persona(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    from fastapi import HTTPException, status
    persona = db.query(Persona).filter(Persona.id == id).first()
    if not persona:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Persona {id} no encontrada")
    return persona
