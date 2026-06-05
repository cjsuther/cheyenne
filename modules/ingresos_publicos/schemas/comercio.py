from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComercioCreate(BaseModel):
    id_cuenta: int
    cuit: Optional[str] = None
    nombre_fantasia: Optional[str] = None
    id_categoria: Optional[int] = None
    gran_contribuyente: bool = False
    activo: bool = True


class ComercioUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    cuit: Optional[str] = None
    nombre_fantasia: Optional[str] = None
    id_categoria: Optional[int] = None
    gran_contribuyente: Optional[bool] = None
    activo: Optional[bool] = None


class ComercioResponse(BaseModel):
    id: int
    id_cuenta: int
    cuit: Optional[str] = None
    nombre_fantasia: Optional[str] = None
    id_categoria: Optional[int] = None
    gran_contribuyente: bool
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
