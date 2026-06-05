from pydantic import BaseModel
from typing import Optional


class EntidadDefinicionBase(BaseModel):
    tipo: str
    nombre1: Optional[str] = None
    nombre2: Optional[str] = None
    nombre3: Optional[str] = None
    nombre4: Optional[str] = None
    nombre5: Optional[str] = None
    nombre6: Optional[str] = None
    nombre7: Optional[str] = None
    nombre8: Optional[str] = None
    nombre9: Optional[str] = None
    nombre10: Optional[str] = None
    tipo_dato1: Optional[str] = None
    tipo_dato2: Optional[str] = None
    tipo_dato3: Optional[str] = None
    tipo_dato4: Optional[str] = None
    tipo_dato5: Optional[str] = None
    tipo_dato6: Optional[str] = None
    tipo_dato7: Optional[str] = None
    tipo_dato8: Optional[str] = None
    tipo_dato9: Optional[str] = None
    tipo_dato10: Optional[str] = None


class EntidadDefinicionCreate(EntidadDefinicionBase):
    pass


class EntidadDefinicionUpdate(BaseModel):
    nombre1: Optional[str] = None
    nombre2: Optional[str] = None
    nombre3: Optional[str] = None
    nombre4: Optional[str] = None
    nombre5: Optional[str] = None
    nombre6: Optional[str] = None
    nombre7: Optional[str] = None
    nombre8: Optional[str] = None
    nombre9: Optional[str] = None
    nombre10: Optional[str] = None
    tipo_dato1: Optional[str] = None
    tipo_dato2: Optional[str] = None
    tipo_dato3: Optional[str] = None
    tipo_dato4: Optional[str] = None
    tipo_dato5: Optional[str] = None
    tipo_dato6: Optional[str] = None
    tipo_dato7: Optional[str] = None
    tipo_dato8: Optional[str] = None
    tipo_dato9: Optional[str] = None
    tipo_dato10: Optional[str] = None


class EntidadDefinicionResponse(EntidadDefinicionBase):
    id: int

    class Config:
        from_attributes = True
