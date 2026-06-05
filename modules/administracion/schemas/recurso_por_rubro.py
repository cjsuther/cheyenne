from pydantic import BaseModel
from typing import Optional
from datetime import date


class RecursoPorRubroBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    presupuesto: Optional[str] = None
    agrupamiento: Optional[str] = None
    nivel: Optional[int] = None
    fecha_baja: Optional[date] = None


class RecursoPorRubroCreate(RecursoPorRubroBase):
    pass


class RecursoPorRubroUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    presupuesto: Optional[str] = None
    agrupamiento: Optional[str] = None
    nivel: Optional[int] = None
    fecha_baja: Optional[date] = None


class RecursoPorRubroResponse(RecursoPorRubroBase):
    id: int

    class Config:
        from_attributes = True
