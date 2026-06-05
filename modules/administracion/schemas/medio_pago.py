from pydantic import BaseModel
from typing import Optional


class MedioPagoBase(BaseModel):
    id_tipo_persona: int
    id_persona: int
    id_tipo_medio_pago: int
    titular: str
    numero: str
    banco: Optional[str] = None
    alias: Optional[str] = None


class MedioPagoCreate(MedioPagoBase):
    pass


class MedioPagoUpdate(BaseModel):
    id_tipo_medio_pago: Optional[int] = None
    titular: Optional[str] = None
    numero: Optional[str] = None
    banco: Optional[str] = None
    alias: Optional[str] = None


class MedioPagoResponse(MedioPagoBase):
    id: int

    class Config:
        from_attributes = True
