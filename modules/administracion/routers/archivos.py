import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.archivo import Archivo
from schemas.archivo import ArchivoCreate, ArchivoUpdate, ArchivoResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/archivos", tags=["Archivos"])


@router.get("", response_model=List[ArchivoResponse])
def list_archivos(
    request: Request,
    entidad: Optional[str] = Query(None),
    id_entidad: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Archivo)
    if entidad:
        query = query.filter(Archivo.entidad == entidad)
    if id_entidad is not None:
        query = query.filter(Archivo.id_entidad == id_entidad)
    query = filtered_query(query, Archivo, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.order_by(Archivo.fecha.desc()).offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ArchivoResponse)
def get_archivo(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    archivo = db.query(Archivo).filter(Archivo.id == id).first()
    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Archivo {id} no encontrado",
        )
    return archivo


@router.post("", response_model=ArchivoResponse, status_code=201)
def create_archivo(
    data: ArchivoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    archivo = Archivo(
        **data.model_dump(),
        id_usuario=current_user.get("id"),
    )
    db.add(archivo)
    db.commit()
    db.refresh(archivo)
    return archivo


@router.put("/{id}", response_model=ArchivoResponse)
def update_archivo(
    id: int,
    data: ArchivoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    archivo = db.query(Archivo).filter(Archivo.id == id).first()
    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Archivo {id} no encontrado",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(archivo, key, value)
    db.commit()
    db.refresh(archivo)
    return archivo


@router.delete("/{id}")
def delete_archivo(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    archivo = db.query(Archivo).filter(Archivo.id == id).first()
    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Archivo {id} no encontrado",
        )
    db.delete(archivo)
    db.commit()
    return {"message": f"Archivo {id} eliminado"}
