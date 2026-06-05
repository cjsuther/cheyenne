from pydantic import BaseModel
from typing import Optional


class ContactoBase(BaseModel):
    entidad: str
    id_entidad: int
    id_tipo_contacto: int
    detalle: str


class ContactoCreate(ContactoBase):
    pass


class ContactoUpdate(BaseModel):
    id_tipo_contacto: Optional[int] = None
    detalle: Optional[str] = None


class ContactoResponse(ContactoBase):
    id: int

    class Config:
        from_attributes = True
