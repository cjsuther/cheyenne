from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class RecaudacionBase(BaseModel):
    id_recaudacion_lote: int
    importe_cobro: Decimal
    numero_control: Optional[str] = None
    numero_comprobante: Optional[str] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    fecha_cobro: Optional[datetime] = None
    codigo_barras: Optional[str] = None
    observacion: Optional[str] = None


class RecaudacionCreate(RecaudacionBase):
    pass


class RecaudacionUpdate(BaseModel):
    id_recaudacion_lote: Optional[int] = None
    importe_cobro: Optional[Decimal] = None
    numero_control: Optional[str] = None
    numero_comprobante: Optional[str] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    fecha_cobro: Optional[datetime] = None
    codigo_barras: Optional[str] = None
    observacion: Optional[str] = None


class RecaudacionResponse(BaseModel):
    id: int
    id_recaudacion_lote: int
    numero_control: Optional[str] = None
    numero_comprobante: Optional[str] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    numero_recibo: Optional[str] = None
    importe_cobro: Decimal
    fecha_cobro: Optional[datetime] = None
    codigo_barras: Optional[str] = None
    observacion: Optional[str] = None

    class Config:
        from_attributes = True
