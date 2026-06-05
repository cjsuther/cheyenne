from pydantic import BaseModel
from typing import Optional
from datetime import date


class PersonaFisicaBase(BaseModel):
    id_tipo_documento: int
    numero_documento: str
    id_nacionalidad: Optional[int] = None
    nombre: str
    apellido: str
    id_genero: Optional[int] = None
    id_estado_civil: Optional[int] = None
    profesion: Optional[str] = None
    matricula: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    fecha_defuncion: Optional[date] = None
    id_condicion_fiscal: Optional[int] = None
    activo: bool = True


class PersonaFisicaCreate(PersonaFisicaBase):
    pass


class PersonaFisicaUpdate(BaseModel):
    id_tipo_documento: Optional[int] = None
    numero_documento: Optional[str] = None
    id_nacionalidad: Optional[int] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    id_genero: Optional[int] = None
    id_estado_civil: Optional[int] = None
    profesion: Optional[str] = None
    matricula: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    fecha_defuncion: Optional[date] = None
    id_condicion_fiscal: Optional[int] = None
    activo: Optional[bool] = None


class PersonaFisicaResponse(PersonaFisicaBase):
    id: int

    class Config:
        from_attributes = True
