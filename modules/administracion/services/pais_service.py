from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.pais import Pais


class PaisService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Pais]:
        return self.db.query(Pais).order_by(Pais.orden).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Pais).count()

    def find_by_id(self, id: int) -> Pais:
        pais = self.db.query(Pais).filter(Pais.id == id).first()
        if not pais:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"País {id} no encontrado",
            )
        return pais

    def add(self, data: dict) -> Pais:
        pais = Pais(**data)
        self.db.add(pais)
        self.db.commit()
        self.db.refresh(pais)
        return pais

    def modify(self, id: int, update_data: dict) -> Pais:
        pais = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(pais, key, value)
        self.db.commit()
        self.db.refresh(pais)
        return pais

    def remove(self, id: int):
        pais = self.find_by_id(id)
        self.db.delete(pais)
        self.db.commit()
