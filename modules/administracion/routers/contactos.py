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
from models.contacto import Contacto
from schemas.contacto import ContactoCreate, ContactoUpdate, ContactoResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/contactos", tags=["Contactos"])


@router.get("", response_model=List[ContactoResponse])
def list_contactos(
    request: Request,
    entidad: Optional[str] = Query(None),
    id_entidad: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Contacto)
    if entidad:
        query = query.filter(Contacto.entidad == entidad)
    if id_entidad is not None:
        query = query.filter(Contacto.id_entidad == id_entidad)
    query = filtered_query(query, Contacto, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ContactoResponse)
def get_contacto(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    contacto = db.query(Contacto).filter(Contacto.id == id).first()
    if not contacto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contacto {id} no encontrado",
        )
    return contacto


@router.post("", response_model=ContactoResponse, status_code=201)
def create_contacto(
    data: ContactoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    contacto = Contacto(**data.model_dump())
    db.add(contacto)
    db.commit()
    db.refresh(contacto)
    return contacto


@router.put("/{id}", response_model=ContactoResponse)
def update_contacto(
    id: int,
    data: ContactoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    contacto = db.query(Contacto).filter(Contacto.id == id).first()
    if not contacto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contacto {id} no encontrado",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(contacto, key, value)
    db.commit()
    db.refresh(contacto)
    return contacto


@router.delete("/{id}")
def delete_contacto(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    contacto = db.query(Contacto).filter(Contacto.id == id).first()
    if not contacto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contacto {id} no encontrado",
        )
    db.delete(contacto)
    db.commit()
    return {"message": f"Contacto {id} eliminado"}
