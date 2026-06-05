import sys
import os
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.archivo import Archivo
from schemas.archivo import ArchivoCreate, ArchivoResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/archivos", tags=["Archivos"])


@router.get("", response_model=List[ArchivoResponse])
def list_archivos(
    request: Request,
    entidad: str = Query(...),
    id_entidad: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = (
        db.query(Archivo)
        .filter(Archivo.entidad == entidad, Archivo.id_entidad == id_entidad)
    )
    query = filtered_query(query, Archivo, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.order_by(Archivo.fecha.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=ArchivoResponse, status_code=201)
def create_archivo(
    data: ArchivoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = Archivo(
        **data.model_dump(),
        id_usuario=current_user.get("id"),
        fecha=datetime.utcnow(),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_archivo(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Archivo).filter(Archivo.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Archivo {id} no encontrado")
    db.delete(item)
    db.commit()
    return {"message": f"Archivo {id} eliminado"}
