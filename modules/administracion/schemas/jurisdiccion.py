from pydantic import BaseModel
from typing import Optional


class JurisdiccionBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    ejercicio: Optional[int] = None
    agrupamiento: Optional[str] = None
    nivel: Optional[int] = None
    tipo: Optional[str] = None


class JurisdiccionCreate(JurisdiccionBase):
    pass


class JurisdiccionUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    ejercicio: Optional[int] = None
    agrupamiento: Optional[str] = None
    nivel: Optional[int] = None
    tipo: Optional[str] = None


class JurisdiccionResponse(JurisdiccionBase):
    id: int

    class Config:
        from_attributes = True
