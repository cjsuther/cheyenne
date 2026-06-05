from pydantic import BaseModel
from typing import Optional


class EntidadBase(BaseModel):
    codigo: str
    tipo: str
    nombre: str
    orden: int = 0
    dato1: Optional[str] = None
    dato2: Optional[str] = None
    dato3: Optional[str] = None
    dato4: Optional[str] = None
    dato5: Optional[str] = None
    dato6: Optional[str] = None
    dato7: Optional[str] = None
    dato8: Optional[str] = None
    dato9: Optional[str] = None
    dato10: Optional[str] = None


class EntidadCreate(EntidadBase):
    pass


class EntidadUpdate(BaseModel):
    codigo: Optional[str] = None
    tipo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    dato1: Optional[str] = None
    dato2: Optional[str] = None
    dato3: Optional[str] = None
    dato4: Optional[str] = None
    dato5: Optional[str] = None
    dato6: Optional[str] = None
    dato7: Optional[str] = None
    dato8: Optional[str] = None
    dato9: Optional[str] = None
    dato10: Optional[str] = None


class EntidadResponse(EntidadBase):
    id: int

    class Config:
        from_attributes = True
