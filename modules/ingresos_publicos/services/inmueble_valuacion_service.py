from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.inmueble_valuacion import InmuebleValuacion


class InmuebleValuacionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[InmuebleValuacion]:
        return self.db.query(InmuebleValuacion).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(InmuebleValuacion).count()

    def find_by_id(self, id: int) -> InmuebleValuacion:
        item = self.db.query(InmuebleValuacion).filter(InmuebleValuacion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Valuacion {id} no encontrada",
            )
        return item

    def list_by_inmueble(self, id_inmueble: int) -> List[InmuebleValuacion]:
        return (
            self.db.query(InmuebleValuacion)
            .filter(InmuebleValuacion.id_inmueble == id_inmueble, InmuebleValuacion.activo == True)
            .all()
        )

    def add(self, data: dict) -> InmuebleValuacion:
        item = InmuebleValuacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> InmuebleValuacion:
        item = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove(self, id: int):
        item = self.find_by_id(id)
        item.activo = False
        self.db.commit()
