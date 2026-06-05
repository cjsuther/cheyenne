from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class ReciboPublicacionLoteBase(BaseModel):
    numero_lote: int
    fecha_lote: date


class ReciboPublicacionLoteCreate(ReciboPublicacionLoteBase):
    pass


class ReciboPublicacionLoteUpdate(BaseModel):
    numero_lote: Optional[int] = None
    fecha_lote: Optional[date] = None
    casos: Optional[int] = None
    importe_total_1: Optional[Decimal] = None
    importe_total_2: Optional[Decimal] = None


class ReciboPublicacionLoteResponse(BaseModel):
    id: int
    numero_lote: int
    fecha_lote: date
    casos: int = 0
    importe_total_1: Decimal = Decimal("0")
    importe_total_2: Decimal = Decimal("0")

    class Config:
        from_attributes = True
