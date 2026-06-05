from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.etiqueta import Etiqueta


class EtiquetaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, entidad: Optional[str] = None, id_entidad: Optional[int] = None) -> List[Etiqueta]:
        query = self.db.query(Etiqueta)
        if entidad:
            query = query.filter(Etiqueta.entidad == entidad)
        if id_entidad is not None:
            query = query.filter(Etiqueta.id_entidad == id_entidad)
        return query.offset(skip).limit(limit).all()

    def count(self, entidad: Optional[str] = None, id_entidad: Optional[int] = None) -> int:
        query = self.db.query(Etiqueta)
        if entidad:
            query = query.filter(Etiqueta.entidad == entidad)
        if id_entidad is not None:
            query = query.filter(Etiqueta.id_entidad == id_entidad)
        return query.count()

    def find_by_id(self, id: int) -> Etiqueta:
        etiqueta = self.db.query(Etiqueta).filter(Etiqueta.id == id).first()
        if not etiqueta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Etiqueta {id} no encontrada",
            )
        return etiqueta

    def add(self, data: dict) -> Etiqueta:
        etiqueta = Etiqueta(**data)
        self.db.add(etiqueta)
        self.db.commit()
        self.db.refresh(etiqueta)
        return etiqueta

    def remove(self, id: int):
        etiqueta = self.find_by_id(id)
        self.db.delete(etiqueta)
        self.db.commit()
