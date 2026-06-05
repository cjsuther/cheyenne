from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.permiso_service import PermisoService
from schemas.permiso import PermisoCreate, PermisoUpdate, PermisoResponse
from models.usuario import Usuario

router = APIRouter(prefix="/permisos", tags=["Permisos"])


@router.get("", response_model=List[PermisoResponse])
def list_permisos(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    return service.list(skip=skip, limit=limit)


@router.get("/{id}", response_model=PermisoResponse)
def get_permiso(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    return service.find_by_id(id)


@router.post("", response_model=PermisoResponse, status_code=201)
def create_permiso(
    data: PermisoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=PermisoResponse)
def update_permiso(
    id: int,
    data: PermisoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_permiso(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    service.remove(id)
    return {"message": f"Permiso {id} eliminado"}


@router.get("/check/{usuario_id}/{codigo_permiso}")
def check_permiso(
    usuario_id: int,
    codigo_permiso: str,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PermisoService(db)
    has_permission = service.check_permisos(usuario_id, codigo_permiso)
    return {"has_permission": has_permission}
