from pydantic import BaseModel
from typing import Optional


class LocalidadBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    id_provincia: int


class LocalidadCreate(LocalidadBase):
    pass


class LocalidadUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    id_provincia: Optional[int] = None


class LocalidadResponse(LocalidadBase):
    id: int

    class Config:
        from_attributes = True
