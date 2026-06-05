from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PagoContadoCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_tributo: Optional[int] = None
    importe: Decimal
    id_pasarela_pago: Optional[int] = None
    id_transaccion_externa: Optional[str] = None
    codigo_barras: Optional[str] = None


class PagoContadoResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_tipo_tributo: Optional[int] = None
    importe: Decimal
    fecha_pago: datetime
    id_pasarela_pago: Optional[int] = None
    id_transaccion_externa: Optional[str] = None
    id_estado_pago: int
    codigo_barras: Optional[str] = None

    class Config:
        from_attributes = True


class PlanPagoCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_plan_pago_definicion: Optional[int] = None
    cantidad_cuotas: int
    importe_total: Decimal = Decimal("0")
    importe_anticipo: Decimal = Decimal("0")
    importe_cuota: Decimal = Decimal("0")


class PlanPagoResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_plan_pago_definicion: Optional[int] = None
    cantidad_cuotas: int
    importe_total: Decimal
    importe_anticipo: Decimal
    importe_cuota: Decimal
    id_estado_plan: int
    fecha_alta: datetime

    class Config:
        from_attributes = True
