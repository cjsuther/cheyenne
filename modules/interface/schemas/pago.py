from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PagoNotificacionCreate(BaseModel):
    id_pasarela_pago: int
    id_transaccion_externa: str
    comprobante_ref: Optional[str] = None
    importe: Decimal
    estado: str
    datos_notificacion: Optional[str] = None


class PagoNotificacionResponse(BaseModel):
    id: int
    id_pasarela_pago: int
    id_transaccion_externa: str
    comprobante_ref: Optional[str] = None
    importe: Decimal
    estado: str
    datos_notificacion: Optional[str] = None
    fecha_notificacion: datetime
    procesado: bool
    fecha_proceso: Optional[datetime] = None
    impacto_ok: bool = False
    impacto_detalle: Optional[str] = None

    class Config:
        from_attributes = True
