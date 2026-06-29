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
from services.vehiculo_valuacion_service import VehiculoValuacionService
from models.vehiculo_valuacion import VehiculoValuacion
from schemas.vehiculo_valuacion import (
    VehiculoValuacionCreate, VehiculoValuacionUpdate, VehiculoValuacionResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/vehiculo-valuaciones", tags=["Vehículo - Valuaciones (DNRPA)"])


@router.get("", response_model=List[VehiculoValuacionResponse])
def list_valuaciones(request: Request, skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100),
                     db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = db.query(VehiculoValuacion)
    query = filtered_query(query, VehiculoValuacion, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=VehiculoValuacionResponse)
def get_valuacion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return VehiculoValuacionService(db).find_by_id(id)


@router.post("", response_model=VehiculoValuacionResponse, status_code=201)
def create_valuacion(data: VehiculoValuacionCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return VehiculoValuacionService(db).add(data.model_dump())


@router.put("/{id}", response_model=VehiculoValuacionResponse)
def update_valuacion(id: int, data: VehiculoValuacionUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return VehiculoValuacionService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_valuacion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    VehiculoValuacionService(db).remove(id)
    return {"message": f"Valuacion vehicular {id} dada de baja"}
