from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class RegistroContableBase(BaseModel):
    id_registro_contable_lote: int
    id_recaudacion: Optional[int] = None
    fecha_ingreso: Optional[date] = None
    cuenta_contable: Optional[str] = None
    jurisdiccion: Optional[str] = None
    recurso_por_rubro: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    ejercicio: Optional[int] = None
    codigo_forma_pago: Optional[str] = None
    importe: Decimal = Decimal("0")


class RegistroContableCreate(RegistroContableBase):
    pass


class RegistroContableUpdate(BaseModel):
    id_registro_contable_lote: Optional[int] = None
    id_recaudacion: Optional[int] = None
    fecha_ingreso: Optional[date] = None
    cuenta_contable: Optional[str] = None
    jurisdiccion: Optional[str] = None
    recurso_por_rubro: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    ejercicio: Optional[int] = None
    codigo_forma_pago: Optional[str] = None
    importe: Optional[Decimal] = None


class RegistroContableResponse(BaseModel):
    id: int
    id_registro_contable_lote: int
    id_recaudacion: Optional[int] = None
    fecha_ingreso: Optional[date] = None
    cuenta_contable: Optional[str] = None
    jurisdiccion: Optional[str] = None
    recurso_por_rubro: Optional[str] = None
    codigo_lugar_pago: Optional[str] = None
    ejercicio: Optional[int] = None
    codigo_forma_pago: Optional[str] = None
    importe: Decimal = Decimal("0")

    class Config:
        from_attributes = True
