from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.inmueble import Inmueble


class InmuebleService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Inmueble]:
        return self.db.query(Inmueble).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Inmueble).count()

    def find_by_id(self, id: int) -> Inmueble:
        inmueble = self.db.query(Inmueble).filter(Inmueble.id == id).first()
        if not inmueble:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Inmueble {id} no encontrado",
            )
        return inmueble

    def list_by_cuenta(self, id_cuenta: int) -> List[Inmueble]:
        return (
            self.db.query(Inmueble)
            .filter(Inmueble.id_cuenta == id_cuenta)
            .all()
        )

    def add(self, data: dict) -> Inmueble:
        inmueble = Inmueble(**data)
        self.db.add(inmueble)
        self.db.commit()
        self.db.refresh(inmueble)
        return inmueble

    def modify(self, id: int, update_data: dict) -> Inmueble:
        inmueble = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(inmueble, key, value)
        self.db.commit()
        self.db.refresh(inmueble)
        return inmueble

    def remove(self, id: int):
        inmueble = self.find_by_id(id)
        inmueble.activo = False
        self.db.commit()
