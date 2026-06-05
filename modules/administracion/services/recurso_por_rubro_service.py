from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.recurso_por_rubro import RecursoPorRubro


class RecursoPorRubroService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, agrupamiento: Optional[str] = None) -> List[RecursoPorRubro]:
        query = self.db.query(RecursoPorRubro)
        if agrupamiento:
            query = query.filter(RecursoPorRubro.agrupamiento == agrupamiento)
        return query.order_by(RecursoPorRubro.orden).offset(skip).limit(limit).all()

    def count(self, agrupamiento: Optional[str] = None) -> int:
        query = self.db.query(RecursoPorRubro)
        if agrupamiento:
            query = query.filter(RecursoPorRubro.agrupamiento == agrupamiento)
        return query.count()

    def find_by_id(self, id: int) -> RecursoPorRubro:
        recurso = self.db.query(RecursoPorRubro).filter(RecursoPorRubro.id == id).first()
        if not recurso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recurso por rubro {id} no encontrado",
            )
        return recurso

    def add(self, data: dict) -> RecursoPorRubro:
        recurso = RecursoPorRubro(**data)
        self.db.add(recurso)
        self.db.commit()
        self.db.refresh(recurso)
        return recurso

    def modify(self, id: int, update_data: dict) -> RecursoPorRubro:
        recurso = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(recurso, key, value)
        self.db.commit()
        self.db.refresh(recurso)
        return recurso

    def remove(self, id: int):
        recurso = self.find_by_id(id)
        self.db.delete(recurso)
        self.db.commit()
