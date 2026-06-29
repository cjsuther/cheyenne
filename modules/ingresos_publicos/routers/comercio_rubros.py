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
from services.comercio_rubro_service import ComercioRubroService
from models.comercio_rubro import ComercioRubro
from schemas.comercio_rubro import ComercioRubroCreate, ComercioRubroUpdate, ComercioRubroResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/comercio-rubros", tags=["Comercio - Rubros"])


@router.get("", response_model=List[ComercioRubroResponse])
def list_rubros(request: Request, skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100),
                db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = db.query(ComercioRubro)
    query = filtered_query(query, ComercioRubro, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ComercioRubroResponse)
def get_rubro(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioRubroService(db).find_by_id(id)


@router.get("/by-comercio/{id_comercio}", response_model=List[ComercioRubroResponse])
def list_rubros_by_comercio(id_comercio: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioRubroService(db).list_by_comercio(id_comercio)


@router.post("", response_model=ComercioRubroResponse, status_code=201)
def create_rubro(data: ComercioRubroCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioRubroService(db).add(data.model_dump())


@router.put("/{id}", response_model=ComercioRubroResponse)
def update_rubro(id: int, data: ComercioRubroUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return ComercioRubroService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_rubro(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    ComercioRubroService(db).remove(id)
    return {"message": f"Rubro {id} dado de baja"}
