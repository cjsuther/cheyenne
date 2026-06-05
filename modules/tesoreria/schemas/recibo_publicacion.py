from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class ReciboPublicacionBase(BaseModel):
    id_recibo_publicacion_lote: int
    id_cuenta_pago: Optional[int] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    numero_recibo: Optional[str] = None
    periodo: Optional[str] = None
    cuota: Optional[int] = None
    importe_vencimiento_1: Optional[Decimal] = None
    importe_vencimiento_2: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    codigo_barras: Optional[str] = None


class ReciboPublicacionCreate(ReciboPublicacionBase):
    pass


class ReciboPublicacionUpdate(BaseModel):
    id_recibo_publicacion_lote: Optional[int] = None
    id_cuenta_pago: Optional[int] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    numero_recibo: Optional[str] = None
    periodo: Optional[str] = None
    cuota: Optional[int] = None
    importe_vencimiento_1: Optional[Decimal] = None
    importe_vencimiento_2: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    codigo_barras: Optional[str] = None


class ReciboPublicacionResponse(BaseModel):
    id: int
    id_recibo_publicacion_lote: int
    id_cuenta_pago: Optional[int] = None
    codigo_tipo_tributo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    numero_recibo: Optional[str] = None
    periodo: Optional[str] = None
    cuota: Optional[int] = None
    importe_vencimiento_1: Optional[Decimal] = None
    importe_vencimiento_2: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    codigo_barras: Optional[str] = None

    class Config:
        from_attributes = True
