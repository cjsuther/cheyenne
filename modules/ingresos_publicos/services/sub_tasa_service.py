from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.sub_tasa import SubTasa


class SubTasaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_tasa: Optional[int] = None) -> List[SubTasa]:
        query = self.db.query(SubTasa)
        if id_tasa is not None:
            query = query.filter(SubTasa.id_tasa == id_tasa)
        return query.offset(skip).limit(limit).all()

    def count(self, id_tasa: Optional[int] = None) -> int:
        query = self.db.query(SubTasa)
        if id_tasa is not None:
            query = query.filter(SubTasa.id_tasa == id_tasa)
        return query.count()

    def find_by_id(self, id: int) -> SubTasa:
        sub_tasa = self.db.query(SubTasa).filter(SubTasa.id == id).first()
        if not sub_tasa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Sub-tasa {id} no encontrada",
            )
        return sub_tasa

    def add(self, data: dict) -> SubTasa:
        sub_tasa = SubTasa(**data)
        self.db.add(sub_tasa)
        self.db.commit()
        self.db.refresh(sub_tasa)
        return sub_tasa

    def modify(self, id: int, update_data: dict) -> SubTasa:
        sub_tasa = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(sub_tasa, key, value)
        self.db.commit()
        self.db.refresh(sub_tasa)
        return sub_tasa

    def remove(self, id: int):
        sub_tasa = self.find_by_id(id)
        self.db.delete(sub_tasa)
        self.db.commit()
