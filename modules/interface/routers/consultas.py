from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from services.consulta_service import ConsultaService
from schemas.consulta import ConsultaCreate, ConsultaResponse

router = APIRouter(prefix="/consultas", tags=["Consultas"])


@router.get("", response_model=List[ConsultaResponse])
def list_consultas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = ConsultaService(db)
    return service.list(skip=skip, limit=limit)


@router.post("", response_model=ConsultaResponse, status_code=201)
def create_consulta(
    data: ConsultaCreate,
    db: Session = Depends(get_db),
):
    service = ConsultaService(db)
    return service.create(data.model_dump())
