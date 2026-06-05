from pydantic import BaseModel
from typing import Optional


class ProvinciaBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    id_pais: int


class ProvinciaCreate(ProvinciaBase):
    pass


class ProvinciaUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    id_pais: Optional[int] = None


class ProvinciaResponse(ProvinciaBase):
    id: int

    class Config:
        from_attributes = True
