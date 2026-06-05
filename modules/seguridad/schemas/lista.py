from pydantic import BaseModel


class ListaResponse(BaseModel):
    id: int
    codigo: str
    tipo: str
    nombre: str
    orden: int

    class Config:
        from_attributes = True
