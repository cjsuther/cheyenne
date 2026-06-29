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
from services.comercio_ddjj_service import ComercioDDJJService
from models.comercio_ddjj import ComercioDDJJ
from schemas.comercio_ddjj import ComercioDDJJCreate, ComercioDDJJUpdate, ComercioDDJJResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/comercio-ddjj", tags=["Comercio - DD.JJ."])


@router.get("", response_model=List[ComercioDDJJResponse])
def list_ddjj(request: Request, skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100),
              db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = db.query(ComercioDDJJ)
    query = filtered_query(query, ComercioDDJJ, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ComercioDDJJResponse)
def get_ddjj(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioDDJJService(db).find_by_id(id)


@router.get("/by-comercio/{id_comercio}", response_model=List[ComercioDDJJResponse])
def list_ddjj_by_comercio(id_comercio: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioDDJJService(db).list_by_comercio(id_comercio)


@router.post("", response_model=ComercioDDJJResponse, status_code=201)
def create_ddjj(data: ComercioDDJJCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioDDJJService(db).add(data.model_dump())


@router.put("/{id}", response_model=ComercioDDJJResponse)
def update_ddjj(id: int, data: ComercioDDJJUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioDDJJService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_ddjj(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    ComercioDDJJService(db).remove(id)
    return {"message": f"DDJJ {id} dada de baja"}
