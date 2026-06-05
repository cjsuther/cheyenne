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
from services.emision_service import EmisionService
from models.emision import Emision
from models.emision_definicion import EmisionDefinicion
from schemas.emision import (
    EmisionCreate, EmisionUpdate, EmisionResponse,
    EmisionDefinicionCreate, EmisionDefinicionUpdate, EmisionDefinicionResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/emisiones", tags=["Emisiones"])


# ── Definiciones de Emisión (ANTES de /{id} para evitar conflicto) ───

@router.get("/definiciones", response_model=List[EmisionDefinicionResponse])
def list_emision_definiciones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(EmisionDefinicion)
    if activo is not None:
        query = query.filter(EmisionDefinicion.activo == activo)
    query = filtered_query(query, EmisionDefinicion, dict(request.query_params), exclude={'skip', 'limit', 'activo'})
    return query.offset(skip).limit(limit).all()


@router.get("/definiciones/{id}", response_model=EmisionDefinicionResponse)
def get_emision_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.find_definicion_by_id(id)


@router.post("/definiciones", response_model=EmisionDefinicionResponse, status_code=201)
def create_emision_definicion(
    data: EmisionDefinicionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.add_definicion(data.model_dump())


@router.put("/definiciones/{id}", response_model=EmisionDefinicionResponse)
def update_emision_definicion(
    id: int,
    data: EmisionDefinicionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.modify_definicion(id, data.model_dump(exclude_unset=True))


@router.delete("/definiciones/{id}")
def delete_emision_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    service.remove_definicion(id)
    return {"message": f"Definicion de emision {id} desactivada"}


# ── Emisiones ────────────────────────────────────────────────────────

@router.get("", response_model=List[EmisionResponse])
def list_emisiones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    ejercicio: Optional[int] = Query(None),
    periodo: Optional[int] = Query(None),
    id_estado_emision: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Emision)
    if ejercicio is not None:
        query = query.filter(Emision.ejercicio == ejercicio)
    if periodo is not None:
        query = query.filter(Emision.periodo == periodo)
    if id_estado_emision is not None:
        query = query.filter(Emision.id_estado_emision == id_estado_emision)
    query = filtered_query(query, Emision, dict(request.query_params), exclude={'skip', 'limit', 'ejercicio', 'periodo', 'id_estado_emision'})
    return query.offset(skip).limit(limit).all()


@router.get("/by-cuenta/{id_cuenta}", response_model=List[EmisionResponse])
def list_emisiones_by_cuenta(
    id_cuenta: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.list_by_cuenta(id_cuenta, skip=skip, limit=limit)


@router.get("/{id}", response_model=EmisionResponse)
def get_emision(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.find_by_id(id)


@router.post("", response_model=EmisionResponse, status_code=201)
def create_emision(
    data: EmisionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=EmisionResponse)
def update_emision(
    id: int,
    data: EmisionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_emision(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    service.remove(id)
    return {"message": f"Emision {id} anulada"}
