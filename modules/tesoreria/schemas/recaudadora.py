from pydantic import BaseModel
from typing import Optional


class RecaudadoraBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    codigo_cliente: Optional[str] = None
    id_lugar_pago: Optional[int] = None
    id_metodo_importacion: Optional[int] = None


class RecaudadoraCreate(RecaudadoraBase):
    pass


class RecaudadoraUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    codigo_cliente: Optional[str] = None
    id_lugar_pago: Optional[int] = None
    id_metodo_importacion: Optional[int] = None


class RecaudadoraResponse(RecaudadoraBase):
    id: int

    class Config:
        from_attributes = True
