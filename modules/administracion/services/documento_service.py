from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.documento import Documento


class DocumentoService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_persona: Optional[int] = None, id_tipo_persona: Optional[int] = None) -> List[Documento]:
        query = self.db.query(Documento)
        if id_persona is not None:
            query = query.filter(Documento.id_persona == id_persona)
        if id_tipo_persona is not None:
            query = query.filter(Documento.id_tipo_persona == id_tipo_persona)
        return query.offset(skip).limit(limit).all()

    def count(self, id_persona: Optional[int] = None, id_tipo_persona: Optional[int] = None) -> int:
        query = self.db.query(Documento)
        if id_persona is not None:
            query = query.filter(Documento.id_persona == id_persona)
        if id_tipo_persona is not None:
            query = query.filter(Documento.id_tipo_persona == id_tipo_persona)
        return query.count()

    def find_by_id(self, id: int) -> Documento:
        documento = self.db.query(Documento).filter(Documento.id == id).first()
        if not documento:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Documento {id} no encontrado",
            )
        return documento

    def add(self, data: dict) -> Documento:
        documento = Documento(**data)
        self.db.add(documento)
        self.db.commit()
        self.db.refresh(documento)
        return documento

    def modify(self, id: int, update_data: dict) -> Documento:
        documento = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(documento, key, value)
        self.db.commit()
        self.db.refresh(documento)
        return documento

    def remove(self, id: int):
        documento = self.find_by_id(id)
        self.db.delete(documento)
        self.db.commit()
