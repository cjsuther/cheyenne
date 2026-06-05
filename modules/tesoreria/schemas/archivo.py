from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArchivoCreate(BaseModel):
    entidad: str
    id_entidad: int
    nombre: str
    path: str
    descripcion: Optional[str] = None


class ArchivoResponse(BaseModel):
    id: int
    entidad: str
    id_entidad: int
    nombre: str
    path: str
    descripcion: Optional[str] = None
    id_usuario: Optional[int] = None
    fecha: datetime

    class Config:
        from_attributes = True
