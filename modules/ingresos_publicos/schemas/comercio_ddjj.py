from decimal import Decimal
from typing import Optional
from datetime import date, datetime

from pydantic import BaseModel


class ComercioDDJJCreate(BaseModel):
    id_comercio: int
    id_rubro: Optional[int] = None
    periodo: int
    mes: Optional[int] = None
    ingresos_declarados: Decimal = Decimal("0")
    fecha_presentacion: Optional[date] = None
    activo: bool = True


class ComercioDDJJUpdate(BaseModel):
    id_rubro: Optional[int] = None
    periodo: Optional[int] = None
    mes: Optional[int] = None
    ingresos_declarados: Optional[Decimal] = None
    fecha_presentacion: Optional[date] = None
    activo: Optional[bool] = None


class ComercioDDJJResponse(BaseModel):
    id: int
    id_comercio: int
    id_rubro: Optional[int] = None
    periodo: int
    mes: Optional[int] = None
    ingresos_declarados: Decimal
    fecha_presentacion: Optional[date] = None
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
