from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class TasaBase(BaseModel):
    codigo: str
    id_tipo_tributo: Optional[int] = None
    id_categoria_tasa: Optional[int] = None
    descripcion: str
    porcentaje_descuento: Optional[Decimal] = None


class TasaCreate(TasaBase):
    pass


class TasaUpdate(BaseModel):
    codigo: Optional[str] = None
    id_tipo_tributo: Optional[int] = None
    id_categoria_tasa: Optional[int] = None
    descripcion: Optional[str] = None
    porcentaje_descuento: Optional[Decimal] = None


class TasaResponse(TasaBase):
    id: int

    class Config:
        from_attributes = True
