from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.jurisdiccion import Jurisdiccion


class JurisdiccionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, ejercicio: Optional[int] = None, tipo: Optional[str] = None) -> List[Jurisdiccion]:
        query = self.db.query(Jurisdiccion)
        if ejercicio is not None:
            query = query.filter(Jurisdiccion.ejercicio == ejercicio)
        if tipo:
            query = query.filter(Jurisdiccion.tipo == tipo)
        return query.order_by(Jurisdiccion.orden).offset(skip).limit(limit).all()

    def count(self, ejercicio: Optional[int] = None, tipo: Optional[str] = None) -> int:
        query = self.db.query(Jurisdiccion)
        if ejercicio is not None:
            query = query.filter(Jurisdiccion.ejercicio == ejercicio)
        if tipo:
            query = query.filter(Jurisdiccion.tipo == tipo)
        return query.count()

    def find_by_id(self, id: int) -> Jurisdiccion:
        jurisdiccion = self.db.query(Jurisdiccion).filter(Jurisdiccion.id == id).first()
        if not jurisdiccion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Jurisdicción {id} no encontrada",
            )
        return jurisdiccion

    def add(self, data: dict) -> Jurisdiccion:
        jurisdiccion = Jurisdiccion(**data)
        self.db.add(jurisdiccion)
        self.db.commit()
        self.db.refresh(jurisdiccion)
        return jurisdiccion

    def modify(self, id: int, update_data: dict) -> Jurisdiccion:
        jurisdiccion = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(jurisdiccion, key, value)
        self.db.commit()
        self.db.refresh(jurisdiccion)
        return jurisdiccion

    def remove(self, id: int):
        jurisdiccion = self.find_by_id(id)
        self.db.delete(jurisdiccion)
        self.db.commit()
