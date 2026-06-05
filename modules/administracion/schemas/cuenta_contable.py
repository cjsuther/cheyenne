from pydantic import BaseModel
from typing import Optional


class CuentaContableBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    agrupamiento: Optional[str] = None


class CuentaContableCreate(CuentaContableBase):
    pass


class CuentaContableUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    agrupamiento: Optional[str] = None


class CuentaContableResponse(CuentaContableBase):
    id: int

    class Config:
        from_attributes = True
