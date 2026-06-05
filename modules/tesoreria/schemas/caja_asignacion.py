from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CajaAsignacionBase(BaseModel):
    id_caja: int
    id_usuario: int
    fecha_apertura: datetime
    importe_saldo_inicial: Decimal


class CajaAsignacionCreate(CajaAsignacionBase):
    pass


class CajaAsignacionUpdate(BaseModel):
    fecha_cierre: Optional[datetime] = None
    importe_saldo_final: Optional[Decimal] = None
    importe_cobro: Optional[Decimal] = None
    importe_cobro_efectivo: Optional[Decimal] = None
    id_recaudacion_lote: Optional[int] = None


class CajaAsignacionResponse(BaseModel):
    id: int
    id_caja: int
    id_usuario: int
    fecha_apertura: datetime
    fecha_cierre: Optional[datetime] = None
    importe_saldo_inicial: Decimal
    importe_saldo_final: Optional[Decimal] = None
    importe_cobro: Decimal = Decimal("0")
    importe_cobro_efectivo: Decimal = Decimal("0")
    id_recaudacion_lote: Optional[int] = None

    class Config:
        from_attributes = True
