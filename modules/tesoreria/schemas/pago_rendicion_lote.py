from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class PagoRendicionLoteBase(BaseModel):
    numero_lote: int
    fecha_lote: date


class PagoRendicionLoteCreate(PagoRendicionLoteBase):
    pass


class PagoRendicionLoteUpdate(BaseModel):
    numero_lote: Optional[int] = None
    fecha_lote: Optional[date] = None
    casos: Optional[int] = None
    importe_total: Optional[Decimal] = None
    id_usuario_proceso: Optional[int] = None
    fecha_proceso: Optional[datetime] = None
    fecha_confirmacion: Optional[datetime] = None


class PagoRendicionLoteResponse(BaseModel):
    id: int
    numero_lote: int
    fecha_lote: date
    casos: int = 0
    importe_total: Decimal = Decimal("0")
    id_usuario_proceso: Optional[int] = None
    fecha_proceso: Optional[datetime] = None
    fecha_confirmacion: Optional[datetime] = None

    class Config:
        from_attributes = True
