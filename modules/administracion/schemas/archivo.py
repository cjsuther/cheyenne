from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArchivoBase(BaseModel):
    entidad: str
    id_entidad: int
    nombre: str
    path: str
    descripcion: Optional[str] = None


class ArchivoCreate(ArchivoBase):
    pass


class ArchivoUpdate(BaseModel):
    nombre: Optional[str] = None
    path: Optional[str] = None
    descripcion: Optional[str] = None


class ArchivoResponse(ArchivoBase):
    id: int
    id_usuario: Optional[int] = None
    fecha: Optional[datetime] = None

    class Config:
        from_attributes = True
