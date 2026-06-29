from decimal import Decimal
from typing import Optional
from datetime import date, datetime

from pydantic import BaseModel


class InmuebleValuacionCreate(BaseModel):
    id_inmueble: int
    id_tipo_valuacion: Optional[int] = None
    ejercicio: Optional[int] = None
    valor: Decimal = Decimal("0")
    fecha_vigencia: Optional[date] = None
    activo: bool = True


class InmuebleValuacionUpdate(BaseModel):
    id_tipo_valuacion: Optional[int] = None
    ejercicio: Optional[int] = None
    valor: Optional[Decimal] = None
    fecha_vigencia: Optional[date] = None
    activo: Optional[bool] = None


class InmuebleValuacionResponse(BaseModel):
    id: int
    id_inmueble: int
    id_tipo_valuacion: Optional[int] = None
    ejercicio: Optional[int] = None
    valor: Decimal
    fecha_vigencia: Optional[date] = None
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
