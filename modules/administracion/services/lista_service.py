from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.lista import Lista


class ListaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, tipo: str = None) -> List[Lista]:
        query = self.db.query(Lista)
        if tipo:
            query = query.filter(Lista.tipo == tipo)
        return query.order_by(Lista.orden).all()

    def count(self, tipo: Optional[str] = None) -> int:
        query = self.db.query(Lista)
        if tipo:
            query = query.filter(Lista.tipo == tipo)
        return query.count()

    def find_by_id(self, id: int) -> Lista:
        lista = self.db.query(Lista).filter(Lista.id == id).first()
        if not lista:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lista {id} no encontrada",
            )
        return lista

    def add(self, data: dict) -> Lista:
        lista = Lista(**data)
        self.db.add(lista)
        self.db.commit()
        self.db.refresh(lista)
        return lista

    def modify(self, id: int, update_data: dict) -> Lista:
        lista = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(lista, key, value)
        self.db.commit()
        self.db.refresh(lista)
        return lista

    def remove(self, id: int):
        lista = self.find_by_id(id)
        self.db.delete(lista)
        self.db.commit()
