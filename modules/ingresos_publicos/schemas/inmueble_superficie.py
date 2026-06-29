from decimal import Decimal
from typing import Optional
from datetime import date, datetime

from pydantic import BaseModel


class InmuebleSuperficieCreate(BaseModel):
    id_inmueble: int
    id_tipo_superficie: Optional[int] = None
    clase: Optional[int] = None
    superficie: Decimal = Decimal("0")
    fecha_vigencia: Optional[date] = None
    activo: bool = True


class InmuebleSuperficieUpdate(BaseModel):
    id_tipo_superficie: Optional[int] = None
    clase: Optional[int] = None
    superficie: Optional[Decimal] = None
    fecha_vigencia: Optional[date] = None
    activo: Optional[bool] = None


class InmuebleSuperficieResponse(BaseModel):
    id: int
    id_inmueble: int
    id_tipo_superficie: Optional[int] = None
    clase: Optional[int] = None
    superficie: Decimal
    fecha_vigencia: Optional[date] = None
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
