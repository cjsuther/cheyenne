from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.emision import Emision


class EmisionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, activo: Optional[bool] = None) -> List[Emision]:
        query = self.db.query(Emision)
        if activo is not None:
            query = query.filter(Emision.activo == activo)
        return query.offset(skip).limit(limit).all()

    def count(self, activo: Optional[bool] = None) -> int:
        query = self.db.query(Emision)
        if activo is not None:
            query = query.filter(Emision.activo == activo)
        return query.count()

    def find_by_id(self, id: int) -> Emision:
        emision = self.db.query(Emision).filter(Emision.id == id).first()
        if not emision:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Emision {id} no encontrada",
            )
        return emision

    def add(self, data: dict) -> Emision:
        emision = Emision(**data)
        self.db.add(emision)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def modify(self, id: int, update_data: dict) -> Emision:
        emision = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(emision, key, value)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def remove(self, id: int):
        emision = self.find_by_id(id)
        emision.activo = False
        self.db.commit()
