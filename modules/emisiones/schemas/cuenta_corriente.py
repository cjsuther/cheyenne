from decimal import Decimal
from typing import Optional
from datetime import datetime, date

from pydantic import BaseModel


class CuentaCorrienteResponse(BaseModel):
    id: int
    id_emision: int
    id_contribuyente: int
    id_objeto_imponible: Optional[int] = None
    id_liquidacion: Optional[int] = None
    tipo_tributo: str
    periodo: Optional[str] = None
    cuota: Optional[int] = None
    concepto: Optional[str] = None
    monto_original: Optional[Decimal] = None
    monto_pagado: Optional[Decimal] = None
    saldo: Optional[Decimal] = None
    fecha_vencimiento: Optional[datetime] = None
    estado: str
    numero_comprobante: Optional[str] = None
    activo: bool = True

    class Config:
        from_attributes = True


class DeudaItem(CuentaCorrienteResponse):
    """Concepto de deuda con el recargo por mora ya calculado a hoy."""
    dias_mora: int = 0
    recargo: Decimal = Decimal("0")
    total_a_pagar: Decimal = Decimal("0")


class PagoRequest(BaseModel):
    importe: Decimal
    fecha_pago: Optional[date] = None


class PagoResponse(BaseModel):
    id: int
    estado: str
    capital_pagado: float
    recargo_mora: float
    saldo: float
