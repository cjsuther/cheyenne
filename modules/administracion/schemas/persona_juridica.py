from pydantic import BaseModel
from typing import Optional
from datetime import date


class PersonaJuridicaBase(BaseModel):
    id_tipo_documento: int
    numero_documento: str
    denominacion: str
    nombre_fantasia: Optional[str] = None
    id_forma_juridica: Optional[int] = None
    fecha_constitucion: Optional[date] = None
    mes_cierre: Optional[int] = None
    activo: bool = True


class PersonaJuridicaCreate(PersonaJuridicaBase):
    pass


class PersonaJuridicaUpdate(BaseModel):
    id_tipo_documento: Optional[int] = None
    numero_documento: Optional[str] = None
    denominacion: Optional[str] = None
    nombre_fantasia: Optional[str] = None
    id_forma_juridica: Optional[int] = None
    fecha_constitucion: Optional[date] = None
    mes_cierre: Optional[int] = None
    activo: Optional[bool] = None


class PersonaJuridicaResponse(PersonaJuridicaBase):
    id: int

    class Config:
        from_attributes = True
