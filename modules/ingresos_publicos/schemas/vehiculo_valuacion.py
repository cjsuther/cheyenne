from decimal import Decimal
from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class VehiculoValuacionCreate(BaseModel):
    codigo_modelo: str
    anio: int
    ejercicio: Optional[int] = None
    valor: Decimal = Decimal("0")
    activo: bool = True


class VehiculoValuacionUpdate(BaseModel):
    codigo_modelo: Optional[str] = None
    anio: Optional[int] = None
    ejercicio: Optional[int] = None
    valor: Optional[Decimal] = None
    activo: Optional[bool] = None


class VehiculoValuacionResponse(BaseModel):
    id: int
    codigo_modelo: str
    anio: int
    ejercicio: Optional[int] = None
    valor: Decimal
    activo: bool
    fecha_alta: datetime

    class Config:
        from_attributes = True
