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
from models.pais import Pais
from services.pais_service import PaisService
from schemas.pais import PaisCreate, PaisUpdate, PaisResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/paises", tags=["Países"])


@router.get("", response_model=List[PaisResponse])
def list_paises(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Pais)
    query = filtered_query(query, Pais, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=PaisResponse)
def get_pais(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PaisService(db)
    return service.find_by_id(id)


@router.post("", response_model=PaisResponse, status_code=201)
def create_pais(
    data: PaisCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PaisService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=PaisResponse)
def update_pais(
    id: int,
    data: PaisUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PaisService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_pais(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PaisService(db)
    service.remove(id)
    return {"message": f"País {id} eliminado"}
