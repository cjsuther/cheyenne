from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class EmisionCreate(BaseModel):
    id_emision_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    numero_emision: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    cuota: Optional[int] = None
    importe_original: Decimal = Decimal("0")
    importe_descuento: Decimal = Decimal("0")
    importe_recargo: Decimal = Decimal("0")
    importe_total: Decimal = Decimal("0")
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    id_estado_emision: int = 10


class EmisionUpdate(BaseModel):
    id_emision_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    numero_emision: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    cuota: Optional[int] = None
    importe_original: Optional[Decimal] = None
    importe_descuento: Optional[Decimal] = None
    importe_recargo: Optional[Decimal] = None
    importe_total: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    id_estado_emision: Optional[int] = None


class EmisionDefinicionCreate(BaseModel):
    codigo: str
    nombre: str
    id_tipo_tributo: Optional[int] = None
    id_tasa: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo_desde: Optional[int] = None
    periodo_hasta: Optional[int] = None
    cuota_desde: Optional[int] = None
    cuota_hasta: Optional[int] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    activo: bool = True


class EmisionDefinicionUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    id_tipo_tributo: Optional[int] = None
    id_tasa: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo_desde: Optional[int] = None
    periodo_hasta: Optional[int] = None
    cuota_desde: Optional[int] = None
    cuota_hasta: Optional[int] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    activo: Optional[bool] = None


class EmisionResponse(BaseModel):
    id: int
    id_emision_definicion: Optional[int] = None
    id_cuenta: Optional[int] = None
    numero_emision: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    cuota: Optional[int] = None
    importe_original: Decimal
    importe_descuento: Decimal
    importe_recargo: Decimal
    importe_total: Decimal
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    id_estado_emision: int
    fecha_emision: datetime

    class Config:
        from_attributes = True


class EmisionDefinicionResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    id_tipo_tributo: Optional[int] = None
    id_tasa: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo_desde: Optional[int] = None
    periodo_hasta: Optional[int] = None
    cuota_desde: Optional[int] = None
    cuota_hasta: Optional[int] = None
    fecha_vencimiento_1: Optional[date] = None
    fecha_vencimiento_2: Optional[date] = None
    activo: bool

    class Config:
        from_attributes = True
