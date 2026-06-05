from pydantic import BaseModel
from typing import Optional


class PermisoBase(BaseModel):
    codigo: str
    nombre: str
    descripcion: str = ""
    sistema: str = ""
    id_modulo: int = 0


class PermisoCreate(PermisoBase):
    pass


class PermisoUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    sistema: Optional[str] = None
    id_modulo: Optional[int] = None


class PermisoResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    descripcion: str
    sistema: str
    id_modulo: int

    class Config:
        from_attributes = True


class PermisoConSeleccion(BaseModel):
    id: int
    codigo: str
    nombre: str
    descripcion: str
    sistema: str
    id_modulo: int
    selected: bool = False

    class Config:
        from_attributes = True
