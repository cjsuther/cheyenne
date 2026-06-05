from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class RecaudacionLoteBase(BaseModel):
    numero_lote: int
    fecha_lote: date
    id_origen_recaudacion: Optional[int] = None
    id_recaudadora: Optional[int] = None
    fecha_acreditacion: Optional[date] = None


class RecaudacionLoteCreate(RecaudacionLoteBase):
    pass


class RecaudacionLoteUpdate(BaseModel):
    numero_lote: Optional[int] = None
    fecha_lote: Optional[date] = None
    casos: Optional[int] = None
    id_usuario_proceso: Optional[int] = None
    fecha_proceso: Optional[datetime] = None
    id_origen_recaudacion: Optional[int] = None
    id_recaudadora: Optional[int] = None
    fecha_acreditacion: Optional[date] = None
    importe_total: Optional[Decimal] = None
    importe_neto: Optional[Decimal] = None
    path_archivo_recaudacion: Optional[str] = None
    nombre_archivo_recaudacion: Optional[str] = None


class RecaudacionLoteResponse(BaseModel):
    id: int
    numero_lote: int
    fecha_lote: date
    casos: int = 0
    id_usuario_proceso: Optional[int] = None
    fecha_proceso: Optional[datetime] = None
    id_origen_recaudacion: Optional[int] = None
    id_recaudadora: Optional[int] = None
    fecha_acreditacion: Optional[date] = None
    importe_total: Decimal = Decimal("0")
    importe_neto: Decimal = Decimal("0")
    path_archivo_recaudacion: Optional[str] = None
    nombre_archivo_recaudacion: Optional[str] = None

    class Config:
        from_attributes = True
