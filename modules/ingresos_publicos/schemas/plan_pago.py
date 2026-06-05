from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class PlanPagoCreate(BaseModel):
    id_plan_pago_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    cantidad_cuotas: int
    importe_total: Decimal = Decimal("0")
    importe_anticipo: Decimal = Decimal("0")
    importe_cuota: Decimal = Decimal("0")
    id_estado_plan: int = 10
    fecha_caducidad: Optional[date] = None


class PlanPagoUpdate(BaseModel):
    id_plan_pago_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    cantidad_cuotas: Optional[int] = None
    importe_total: Optional[Decimal] = None
    importe_anticipo: Optional[Decimal] = None
    importe_cuota: Optional[Decimal] = None
    id_estado_plan: Optional[int] = None
    fecha_caducidad: Optional[date] = None


class PlanPagoDefinicionCreate(BaseModel):
    codigo: str
    nombre: str
    id_tipo_tributo: Optional[int] = None
    cuota_minima: int = 1
    cuota_maxima: int = 12
    porcentaje_anticipo: Optional[Decimal] = None
    tasa_interes: Optional[Decimal] = None
    activo: bool = True
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None


class PlanPagoDefinicionUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    id_tipo_tributo: Optional[int] = None
    cuota_minima: Optional[int] = None
    cuota_maxima: Optional[int] = None
    porcentaje_anticipo: Optional[Decimal] = None
    tasa_interes: Optional[Decimal] = None
    activo: Optional[bool] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None


class PlanPagoResponse(BaseModel):
    id: int
    id_plan_pago_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    numero_plan: Optional[int] = None
    cantidad_cuotas: int
    importe_total: Decimal
    importe_anticipo: Decimal
    importe_cuota: Decimal
    id_estado_plan: int
    fecha_alta: datetime
    fecha_caducidad: Optional[date] = None

    class Config:
        from_attributes = True


class PlanPagoDefinicionResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    id_tipo_tributo: Optional[int] = None
    cuota_minima: int
    cuota_maxima: int
    porcentaje_anticipo: Optional[Decimal] = None
    tasa_interes: Optional[Decimal] = None
    activo: bool
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None

    class Config:
        from_attributes = True
