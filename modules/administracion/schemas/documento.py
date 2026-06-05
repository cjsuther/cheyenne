from pydantic import BaseModel
from typing import Optional


class DocumentoBase(BaseModel):
    id_tipo_persona: int
    id_persona: int
    id_tipo_documento: int
    numero_documento: str
    principal: bool = False


class DocumentoCreate(DocumentoBase):
    pass


class DocumentoUpdate(BaseModel):
    id_tipo_documento: Optional[int] = None
    numero_documento: Optional[str] = None
    principal: Optional[bool] = None


class DocumentoResponse(DocumentoBase):
    id: int

    class Config:
        from_attributes = True
