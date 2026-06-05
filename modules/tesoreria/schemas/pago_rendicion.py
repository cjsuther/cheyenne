from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PagoRendicionBase(BaseModel):
    id_pago_rendicion_lote: int
    importe_pago: Decimal
    id_cuenta_pago: Optional[int] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    fecha_pago: Optional[datetime] = None
    codigo_barras: Optional[str] = None


class PagoRendicionCreate(PagoRendicionBase):
    pass


class PagoRendicionUpdate(BaseModel):
    id_pago_rendicion_lote: Optional[int] = None
    importe_pago: Optional[Decimal] = None
    id_cuenta_pago: Optional[int] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    fecha_pago: Optional[datetime] = None
    codigo_barras: Optional[str] = None


class PagoRendicionResponse(BaseModel):
    id: int
    id_pago_rendicion_lote: int
    id_cuenta_pago: Optional[int] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    importe_pago: Decimal
    fecha_pago: Optional[datetime] = None
    codigo_barras: Optional[str] = None

    class Config:
        from_attributes = True
