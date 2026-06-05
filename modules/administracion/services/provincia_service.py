from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.provincia import Provincia


class ProvinciaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_pais: Optional[int] = None) -> List[Provincia]:
        query = self.db.query(Provincia)
        if id_pais is not None:
            query = query.filter(Provincia.id_pais == id_pais)
        return query.order_by(Provincia.orden).offset(skip).limit(limit).all()

    def count(self, id_pais: Optional[int] = None) -> int:
        query = self.db.query(Provincia)
        if id_pais is not None:
            query = query.filter(Provincia.id_pais == id_pais)
        return query.count()

    def find_by_id(self, id: int) -> Provincia:
        provincia = self.db.query(Provincia).filter(Provincia.id == id).first()
        if not provincia:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provincia {id} no encontrada",
            )
        return provincia

    def add(self, data: dict) -> Provincia:
        provincia = Provincia(**data)
        self.db.add(provincia)
        self.db.commit()
        self.db.refresh(provincia)
        return provincia

    def modify(self, id: int, update_data: dict) -> Provincia:
        provincia = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(provincia, key, value)
        self.db.commit()
        self.db.refresh(provincia)
        return provincia

    def remove(self, id: int):
        provincia = self.find_by_id(id)
        self.db.delete(provincia)
        self.db.commit()
