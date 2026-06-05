import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.registro_contable_service import RegistroContableService
from models.registro_contable_lote import RegistroContableLote
from models.registro_contable import RegistroContable
from schemas.registro_contable_lote import (
    RegistroContableLoteCreate,
    RegistroContableLoteUpdate,
    RegistroContableLoteResponse,
)
from schemas.registro_contable import (
    RegistroContableCreate,
    RegistroContableUpdate,
    RegistroContableResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/registro-contable-lotes", tags=["Registro Contable Lotes"])


@router.get("", response_model=List[RegistroContableLoteResponse])
def list_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RegistroContableLote)
    query = filtered_query(query, RegistroContableLote, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RegistroContableLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    return service.find_lote_by_id(id)


@router.post("", response_model=RegistroContableLoteResponse, status_code=201)
def create_lote(
    data: RegistroContableLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    return service.add_lote(data.model_dump())


@router.put("/{id}", response_model=RegistroContableLoteResponse)
def update_lote(
    id: int,
    data: RegistroContableLoteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    return service.modify_lote(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    service.remove_lote(id)
    return {"message": f"RegistroContableLote {id} eliminado"}


@router.get("/{id_lote}/registros", response_model=List[RegistroContableResponse])
def list_registros(
    request: Request,
    id_lote: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RegistroContable).filter(RegistroContable.id_registro_contable_lote == id_lote)
    query = filtered_query(query, RegistroContable, dict(request.query_params), exclude={'skip', 'limit', 'id_lote'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_lote}/registros", response_model=RegistroContableResponse, status_code=201)
def create_registro(
    id_lote: int,
    data: RegistroContableCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    registro_data = data.model_dump()
    registro_data["id_registro_contable_lote"] = id_lote
    return service.add_registro(registro_data)


@router.put("/registros/{id}", response_model=RegistroContableResponse)
def update_registro(
    id: int,
    data: RegistroContableUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    return service.modify_registro(id, data.model_dump(exclude_unset=True))


@router.delete("/registros/{id}")
def delete_registro(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RegistroContableService(db)
    service.remove_registro(id)
    return {"message": f"RegistroContable {id} eliminado"}
