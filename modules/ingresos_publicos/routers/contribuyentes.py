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
from services.contribuyente_service import ContribuyenteService
from models.contribuyente import Contribuyente
from schemas.contribuyente import ContribuyenteCreate, ContribuyenteUpdate, ContribuyenteResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/contribuyentes", tags=["Contribuyentes"])


@router.get("", response_model=List[ContribuyenteResponse])
def list_contribuyentes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Contribuyente)
    query = filtered_query(query, Contribuyente, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ContribuyenteResponse)
def get_contribuyente(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ContribuyenteService(db)
    return service.find_by_id(id)


@router.get("/by-documento/{tipo}/{numero}", response_model=ContribuyenteResponse)
def get_contribuyente_by_documento(
    tipo: int,
    numero: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ContribuyenteService(db)
    contribuyente = service.find_by_documento(tipo, numero)
    if not contribuyente:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contribuyente con documento {tipo}/{numero} no encontrado",
        )
    return contribuyente


@router.post("", response_model=ContribuyenteResponse, status_code=201)
def create_contribuyente(
    data: ContribuyenteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ContribuyenteService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=ContribuyenteResponse)
def update_contribuyente(
    id: int,
    data: ContribuyenteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ContribuyenteService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_contribuyente(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ContribuyenteService(db)
    service.remove(id)
    return {"message": f"Contribuyente {id} dado de baja"}
