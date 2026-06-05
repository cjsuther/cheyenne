from pydantic import BaseModel
from typing import Optional
from datetime import date


class SubTasaBase(BaseModel):
    id_tasa: int
    codigo: str
    descripcion: str
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None


class SubTasaCreate(SubTasaBase):
    pass


class SubTasaUpdate(BaseModel):
    codigo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None


class SubTasaResponse(SubTasaBase):
    id: int

    class Config:
        from_attributes = True
