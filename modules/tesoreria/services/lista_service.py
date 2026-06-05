from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.lista import Lista


class ListaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, tipo: str = None, skip: int = 0, limit: int = 100) -> List[Lista]:
        query = self.db.query(Lista)
        if tipo:
            query = query.filter(Lista.tipo == tipo)
        return query.order_by(Lista.orden).offset(skip).limit(limit).all()

    def count(self, tipo: str = None) -> int:
        query = self.db.query(Lista)
        if tipo:
            query = query.filter(Lista.tipo == tipo)
        return query.count()

    def find_by_id(self, id: int) -> Lista:
        item = self.db.query(Lista).filter(Lista.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lista {id} no encontrada",
            )
        return item

    def add(self, data: dict) -> Lista:
        item = Lista(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> Lista:
        item = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove(self, id: int):
        item = self.find_by_id(id)
        self.db.delete(item)
        self.db.commit()
