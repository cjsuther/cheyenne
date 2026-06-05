from pydantic import BaseModel
from typing import Optional


class DependenciaBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0


class DependenciaCreate(DependenciaBase):
    pass


class DependenciaUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None


class DependenciaResponse(DependenciaBase):
    id: int

    class Config:
        from_attributes = True
