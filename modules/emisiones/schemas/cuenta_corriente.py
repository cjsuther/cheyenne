from decimal import Decimal
from typing import Optional
from datetime import datetime

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
