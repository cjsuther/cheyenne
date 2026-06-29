from decimal import Decimal
from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class InmuebleFrenteCreate(BaseModel):
    id_inmueble: int
    id_calle: Optional[int] = None
    numero: Optional[str] = None
    metros: Decimal = Decimal("0")
    ochava: bool = False
    activo: bool = True


class InmuebleFrenteUpdate(BaseModel):
    id_calle: Optional[int] = None
    numero: Optional[str] = None
    metros: Optional[Decimal] = None
    ochava: Optional[bool] = None
    activo: Optional[bool] = None


class InmuebleFrenteResponse(BaseModel):
    id: int
    id_inmueble: int
    id_calle: Optional[int] = None
    numero: Optional[str] = None
    metros: Decimal
    ochava: bool
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
