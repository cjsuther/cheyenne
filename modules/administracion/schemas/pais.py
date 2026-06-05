from pydantic import BaseModel
from typing import Optional


class PaisBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0


class PaisCreate(PaisBase):
    pass


class PaisUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None


class PaisResponse(PaisBase):
    id: int

    class Config:
        from_attributes = True
