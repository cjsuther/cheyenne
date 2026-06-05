from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class DeclaracionJuradaItemCreate(BaseModel):
    id_rubro: Optional[int] = None
    codigo_rubro: Optional[str] = None
    descripcion: Optional[str] = None
    importe: Decimal = Decimal("0")
    cantidad: Decimal = Decimal("0")
    base_imponible: Decimal = Decimal("0")
    alicuota: Decimal = Decimal("0")


class DeclaracionJuradaItemResponse(BaseModel):
    id: int
    id_declaracion_jurada: int
    id_rubro: Optional[int] = None
    codigo_rubro: Optional[str] = None
    descripcion: Optional[str] = None
    importe: Decimal
    cantidad: Decimal
    base_imponible: Decimal
    alicuota: Decimal

    class Config:
        from_attributes = True


class DeclaracionJuradaCreate(BaseModel):
    id_cuenta: int
    id_modelo_declaracion: Optional[int] = None
    anio: int
    mes: int
    numero_declaracion: Optional[str] = None
    fecha_presentacion: Optional[datetime] = None
    importe_total: Decimal = Decimal("0")
    items: List[DeclaracionJuradaItemCreate] = []


class DeclaracionJuradaResponse(BaseModel):
    id: int
    id_cuenta: int
    id_modelo_declaracion: Optional[int] = None
    anio: int
    mes: int
    numero_declaracion: Optional[str] = None
    fecha_presentacion: Optional[datetime] = None
    id_estado_declaracion: int
    importe_total: Decimal
    items: List[DeclaracionJuradaItemResponse] = []

    class Config:
        from_attributes = True
