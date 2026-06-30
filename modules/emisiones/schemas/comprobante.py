from decimal import Decimal
from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class ComprobanteResponse(BaseModel):
    id: int
    id_emision: int
    id_contribuyente: int
    id_objeto_imponible: Optional[int] = None
    numero_comprobante: Optional[str] = None
    tipo_tributo: Optional[str] = None
    periodo: Optional[str] = None
    cantidad_lineas: int
    importe_a_cancelar: Optional[Decimal] = None
    importe_total: Optional[Decimal] = None
    codigo_barras: Optional[str] = None
    fecha_emision: Optional[datetime] = None
    estado: str
    activo: bool = True

    class Config:
        from_attributes = True
