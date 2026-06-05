from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.entidad_definicion import EntidadDefinicion


class EntidadDefinicionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[EntidadDefinicion]:
        return self.db.query(EntidadDefinicion).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(EntidadDefinicion).count()

    def find_by_id(self, id: int) -> EntidadDefinicion:
        definicion = self.db.query(EntidadDefinicion).filter(EntidadDefinicion.id == id).first()
        if not definicion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Definición de entidad {id} no encontrada",
            )
        return definicion

    def find_by_tipo(self, tipo: str) -> Optional[EntidadDefinicion]:
        return self.db.query(EntidadDefinicion).filter(EntidadDefinicion.tipo == tipo).first()

    def add(self, data: dict) -> EntidadDefinicion:
        definicion = EntidadDefinicion(**data)
        self.db.add(definicion)
        self.db.commit()
        self.db.refresh(definicion)
        return definicion

    def modify(self, id: int, update_data: dict) -> EntidadDefinicion:
        definicion = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(definicion, key, value)
        self.db.commit()
        self.db.refresh(definicion)
        return definicion

    def remove(self, id: int):
        definicion = self.find_by_id(id)
        self.db.delete(definicion)
        self.db.commit()
