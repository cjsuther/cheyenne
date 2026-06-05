from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.expediente import Expediente


class ExpedienteService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, ejercicio: Optional[int] = None) -> List[Expediente]:
        query = self.db.query(Expediente)
        if ejercicio is not None:
            query = query.filter(Expediente.ejercicio == ejercicio)
        return query.order_by(Expediente.id.desc()).offset(skip).limit(limit).all()

    def count(self, ejercicio: Optional[int] = None) -> int:
        query = self.db.query(Expediente)
        if ejercicio is not None:
            query = query.filter(Expediente.ejercicio == ejercicio)
        return query.count()

    def find_by_id(self, id: int) -> Expediente:
        expediente = self.db.query(Expediente).filter(Expediente.id == id).first()
        if not expediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Expediente {id} no encontrado",
            )
        return expediente

    def add(self, data: dict) -> Expediente:
        expediente = Expediente(**data)
        self.db.add(expediente)
        self.db.commit()
        self.db.refresh(expediente)
        return expediente

    def modify(self, id: int, update_data: dict) -> Expediente:
        expediente = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(expediente, key, value)
        self.db.commit()
        self.db.refresh(expediente)
        return expediente

    def remove(self, id: int):
        expediente = self.find_by_id(id)
        self.db.delete(expediente)
        self.db.commit()
