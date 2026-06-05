from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from services.boleta_service import BoletaService
from schemas.boleta import BoletaCreate, BoletaResponse

router = APIRouter(prefix="/boletas", tags=["Boletas"])


@router.get("", response_model=List[BoletaResponse])
def list_boletas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = BoletaService(db)
    return service.list(skip=skip, limit=limit)


@router.get("/by-cuenta/{numero}", response_model=List[BoletaResponse])
def get_boletas_by_cuenta(
    numero: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = BoletaService(db)
    return service.find_by_cuenta(numero, skip=skip, limit=limit)


@router.get("/{id}", response_model=BoletaResponse)
def get_boleta(
    id: int,
    db: Session = Depends(get_db),
):
    service = BoletaService(db)
    return service.find_by_id(id)


@router.post("", response_model=BoletaResponse, status_code=201)
def generate_boleta(
    data: BoletaCreate,
    db: Session = Depends(get_db),
):
    service = BoletaService(db)
    return service.generate_boleta(data.model_dump())
