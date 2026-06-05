from pydantic import BaseModel
from typing import Optional, List


class PerfilBase(BaseModel):
    codigo: str
    nombre: str


class PerfilCreate(PerfilBase):
    pass


class PerfilUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None


class PermisoEnPerfil(BaseModel):
    id: int
    codigo: str
    nombre: str
    descripcion: str
    sistema: str
    selected: bool = False

    class Config:
        from_attributes = True


class PerfilResponse(BaseModel):
    id: int
    codigo: str
    nombre: str

    class Config:
        from_attributes = True


class PerfilConPermisosResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    permisos: List[PermisoEnPerfil] = []

    class Config:
        from_attributes = True


class BindPermisosRequest(BaseModel):
    permiso_ids: List[int]
