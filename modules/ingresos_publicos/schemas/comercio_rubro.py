from typing import Optional
from datetime import date, datetime

from pydantic import BaseModel


class ComercioRubroCreate(BaseModel):
    id_comercio: int
    id_rubro: int
    principal: bool = False
    activo: bool = True


class ComercioRubroUpdate(BaseModel):
    id_rubro: Optional[int] = None
    principal: Optional[bool] = None
    fecha_baja: Optional[date] = None
    activo: Optional[bool] = None


class ComercioRubroResponse(BaseModel):
    id: int
    id_comercio: int
    id_rubro: int
    principal: bool
    fecha_alta: datetime
    fecha_baja: Optional[date] = None
    activo: bool

    class Config:
        from_attributes = True
