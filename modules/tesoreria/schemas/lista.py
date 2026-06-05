from pydantic import BaseModel
from typing import Optional


class ListaBase(BaseModel):
    codigo: str
    tipo: str
    nombre: str
    orden: int = 0


class ListaCreate(ListaBase):
    pass


class ListaUpdate(BaseModel):
    codigo: Optional[str] = None
    tipo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None


class ListaResponse(ListaBase):
    id: int

    class Config:
        from_attributes = True
