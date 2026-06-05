import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.persona_fisica import PersonaFisica
from models.persona_juridica import PersonaJuridica
from services.persona_service import PersonaFisicaService, PersonaJuridicaService
from schemas.persona_fisica import PersonaFisicaCreate, PersonaFisicaUpdate, PersonaFisicaResponse
from schemas.persona_juridica import PersonaJuridicaCreate, PersonaJuridicaUpdate, PersonaJuridicaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/personas", tags=["Personas"])


# --- Personas Físicas ---

@router.get("/fisicas", response_model=List[PersonaFisicaResponse])
def list_personas_fisicas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PersonaFisica)
    if activo is not None:
        query = query.filter(PersonaFisica.activo == activo)
    query = filtered_query(query, PersonaFisica, dict(request.query_params), exclude={'skip', 'limit', 'activo'})
    return query.offset(skip).limit(limit).all()


@router.get("/fisicas/{id}", response_model=PersonaFisicaResponse)
def get_persona_fisica(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaFisicaService(db)
    return service.find_by_id(id)


@router.post("/fisicas", response_model=PersonaFisicaResponse, status_code=201)
def create_persona_fisica(
    data: PersonaFisicaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaFisicaService(db)
    return service.add(data.model_dump())


@router.put("/fisicas/{id}", response_model=PersonaFisicaResponse)
def update_persona_fisica(
    id: int,
    data: PersonaFisicaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaFisicaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/fisicas/{id}")
def delete_persona_fisica(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaFisicaService(db)
    service.remove(id)
    return {"message": f"Persona física {id} eliminada"}


# --- Personas Jurídicas ---

@router.get("/juridicas", response_model=List[PersonaJuridicaResponse])
def list_personas_juridicas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PersonaJuridica)
    if activo is not None:
        query = query.filter(PersonaJuridica.activo == activo)
    query = filtered_query(query, PersonaJuridica, dict(request.query_params), exclude={'skip', 'limit', 'activo'})
    return query.offset(skip).limit(limit).all()


@router.get("/juridicas/{id}", response_model=PersonaJuridicaResponse)
def get_persona_juridica(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaJuridicaService(db)
    return service.find_by_id(id)


@router.post("/juridicas", response_model=PersonaJuridicaResponse, status_code=201)
def create_persona_juridica(
    data: PersonaJuridicaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaJuridicaService(db)
    return service.add(data.model_dump())


@router.put("/juridicas/{id}", response_model=PersonaJuridicaResponse)
def update_persona_juridica(
    id: int,
    data: PersonaJuridicaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaJuridicaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/juridicas/{id}")
def delete_persona_juridica(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PersonaJuridicaService(db)
    service.remove(id)
    return {"message": f"Persona jurídica {id} eliminada"}
