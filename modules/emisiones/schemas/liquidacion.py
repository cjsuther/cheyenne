from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from decimal import Decimal


class LiquidacionResponse(BaseModel):
    id: int
    id_emision: int
    id_contribuyente: int
    id_objeto_imponible: Optional[int] = None
    tipo: str
    periodo: Optional[str] = None
    cuota: Optional[int] = None
    base_imponible: Optional[Decimal] = None
    alicuota: Optional[Decimal] = None
    monto_calculado: Optional[Decimal] = None
    monto_bonificacion: Optional[Decimal] = None
    monto_recargo: Optional[Decimal] = None
    monto_final: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[datetime] = None
    fecha_vencimiento_2: Optional[datetime] = None
    estado: str
    numero_comprobante: Optional[str] = None
    detalle_calculo: Optional[Any] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True
