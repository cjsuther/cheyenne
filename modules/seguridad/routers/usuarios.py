from typing import List

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user, require_permission
from services.usuario_service import UsuarioService
from services.perfil_service import PerfilService
from services.permiso_efectivo_service import PermisoEfectivoService
from schemas.usuario import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioListResponse,
    BindPerfilesRequest,
)
from models.usuario import Usuario


class OverridePermisoRequest(BaseModel):
    id_permiso: int
    tipo: str  # 'grant' | 'deny'

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("", response_model=List[UsuarioListResponse])
def list_usuarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query(None),
    sort_dir: str = Query('asc'),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.list(skip=skip, limit=limit, sort_by=sort_by, sort_dir=sort_dir)


@router.get("/{id}", response_model=UsuarioResponse)
def get_usuario(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.find_by_id(id)


@router.post("", response_model=UsuarioResponse, status_code=201)
def create_usuario(
    data: UsuarioCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    usuario_data = data.model_dump(exclude={"password"})
    return service.add(usuario_data, data.password)


@router.put("/{id}", response_model=UsuarioResponse)
def update_usuario(
    id: int,
    data: UsuarioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_usuario(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    service.remove(id)
    return {"message": f"Usuario {id} eliminado"}


@router.put("/{id}/bind-perfiles", response_model=UsuarioResponse)
def bind_perfiles(
    id: int,
    data: BindPerfilesRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.bind_perfiles(id, data.perfil_ids)


@router.put("/{id}/unbind-perfiles", response_model=UsuarioResponse)
def unbind_perfiles(
    id: int,
    data: BindPerfilesRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.unbind_perfiles(id, data.perfil_ids)


@router.post("/find-by-ids", response_model=List[UsuarioListResponse])
def find_by_ids(
    ids: List[int],
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = UsuarioService(db)
    return service.find_by_ids(ids)


@router.get("/{id}/perfiles")
def list_perfiles_for_usuario(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    usuario_service = UsuarioService(db)
    usuario = usuario_service.find_by_id(id)
    perfil_service = PerfilService(db)
    return perfil_service.list_by_usuario(usuario.perfiles)


# ── Bloqueo por intentos fallidos ────────────────────────────────────
@router.post("/{id}/desbloquear", response_model=UsuarioResponse)
def desbloquear_usuario(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_permission("seguridad_desbloquear")),
):
    service = UsuarioService(db)
    return service.desbloquear(id)


# ── Permisos a nivel usuario (grant/deny) ────────────────────────────
@router.get("/{id}/permisos-override")
def list_permisos_override(
    id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_permission("seguridad_permisos_usuario")),
):
    UsuarioService(db).find_by_id(id)
    return PermisoEfectivoService(db).list_overrides(id)


@router.put("/{id}/permisos-override")
def set_permiso_override(
    id: int,
    data: OverridePermisoRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_permission("seguridad_permisos_usuario")),
):
    row = PermisoEfectivoService(db).set_override(id, data.id_permiso, data.tipo)
    return {"id": row.id, "id_usuario": row.id_usuario, "id_permiso": row.id_permiso, "tipo": row.tipo}


@router.delete("/{id}/permisos-override/{id_permiso}")
def clear_permiso_override(
    id: int,
    id_permiso: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_permission("seguridad_permisos_usuario")),
):
    PermisoEfectivoService(db).clear_override(id, id_permiso)
    return {"message": "Override eliminado"}
