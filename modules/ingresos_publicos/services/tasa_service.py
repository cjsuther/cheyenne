from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.tasa import Tasa


class TasaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_tipo_tributo: Optional[int] = None) -> List[Tasa]:
        query = self.db.query(Tasa)
        if id_tipo_tributo is not None:
            query = query.filter(Tasa.id_tipo_tributo == id_tipo_tributo)
        return query.offset(skip).limit(limit).all()

    def count(self, id_tipo_tributo: Optional[int] = None) -> int:
        query = self.db.query(Tasa)
        if id_tipo_tributo is not None:
            query = query.filter(Tasa.id_tipo_tributo == id_tipo_tributo)
        return query.count()

    def find_by_id(self, id: int) -> Tasa:
        tasa = self.db.query(Tasa).filter(Tasa.id == id).first()
        if not tasa:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tasa {id} no encontrada",
            )
        return tasa

    def add(self, data: dict) -> Tasa:
        tasa = Tasa(**data)
        self.db.add(tasa)
        self.db.commit()
        self.db.refresh(tasa)
        return tasa

    def modify(self, id: int, update_data: dict) -> Tasa:
        tasa = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(tasa, key, value)
        self.db.commit()
        self.db.refresh(tasa)
        return tasa

    def remove(self, id: int):
        tasa = self.find_by_id(id)
        self.db.delete(tasa)
        self.db.commit()
