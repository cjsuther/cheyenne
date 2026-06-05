from pydantic import BaseModel


class EtiquetaBase(BaseModel):
    entidad: str
    id_entidad: int
    codigo: str


class EtiquetaCreate(EtiquetaBase):
    pass


class EtiquetaResponse(EtiquetaBase):
    id: int

    class Config:
        from_attributes = True
