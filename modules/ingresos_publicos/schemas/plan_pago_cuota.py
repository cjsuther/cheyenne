from decimal import Decimal
from typing import List, Optional
from datetime import date

from pydantic import BaseModel


class PlanPagoCuotaResponse(BaseModel):
    id: int
    id_plan_pago: int
    numero_cuota: int
    capital: Decimal
    interes: Decimal
    importe: Decimal
    fecha_vencimiento: Optional[date] = None
    id_estado_cuota: int
    activo: bool

    class Config:
        from_attributes = True


class SimularPlanRequest(BaseModel):
    monto_total: Decimal
    cantidad_cuotas: int
    tasa_interes_pct: Decimal = Decimal("0")
    anticipo: Decimal = Decimal("0")


class CuotaSimulada(BaseModel):
    numero: int
    capital: Decimal
    interes: Decimal
    importe: Decimal
    saldo: Decimal


class SimularPlanResponse(BaseModel):
    monto_total: Decimal
    anticipo: Decimal
    monto_financiado: Decimal
    cantidad_cuotas: int
    total_intereses: Decimal
    total_a_pagar: Decimal
    cuotas: List[CuotaSimulada]
