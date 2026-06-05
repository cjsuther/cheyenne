from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from decimal import Decimal


class BoletaCreate(BaseModel):
    id_tipo_tributo: Optional[int] = None
    numero_cuenta: Optional[str] = None
    numero_recibo: Optional[str] = None
    importe: Decimal
    fecha_vencimiento: Optional[date] = None
    codigo_barras: Optional[str] = None


class BoletaResponse(BaseModel):
    id: int
    id_tipo_tributo: Optional[int] = None
    numero_cuenta: Optional[str] = None
    numero_recibo: Optional[str] = None
    importe: Decimal
    fecha_generacion: datetime
    fecha_vencimiento: Optional[date] = None
    codigo_barras: Optional[str] = None
    id_estado_boleta: int

    class Config:
        from_attributes = True
