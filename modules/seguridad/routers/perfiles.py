from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.perfil_service import PerfilService
from services.permiso_service import PermisoService
from schemas.perfil import (
    PerfilCreate,
    PerfilUpdate,
    PerfilResponse,
    PerfilConPermisosResponse,
    BindPermisosRequest,
)
from models.usuario import Usuario

router = APIRouter(prefix="/perfiles", tags=["Perfiles"])


@router.get("", response_model=List[PerfilResponse])
def list_perfiles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query(None),
    sort_dir: str = Query('asc'),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.list(skip=skip, limit=limit, sort_by=sort_by, sort_dir=sort_dir)


@router.get("/{id}", response_model=PerfilResponse)
def get_perfil(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.find_by_id(id)


@router.post("", response_model=PerfilResponse, status_code=201)
def create_perfil(
    data: PerfilCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=PerfilResponse)
def update_perfil(
    id: int,
    data: PerfilUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_perfil(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    service.remove(id)
    return {"message": f"Perfil {id} eliminado"}


@router.put("/{id}/bind-permisos", response_model=PerfilResponse)
def bind_permisos(
    id: int,
    data: BindPermisosRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.bind_permisos(id, data.permiso_ids)


@router.put("/{id}/unbind-permisos", response_model=PerfilResponse)
def unbind_permisos(
    id: int,
    data: BindPermisosRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = PerfilService(db)
    return service.unbind_permisos(id, data.permiso_ids)


@router.get("/{id}/permisos")
def list_permisos_for_perfil(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    perfil_service = PerfilService(db)
    perfil = perfil_service.find_by_id(id)
    permiso_service = PermisoService(db)
    return permiso_service.list_by_perfil(perfil.permisos)
