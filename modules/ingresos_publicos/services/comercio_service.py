from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.comercio import Comercio


class ComercioService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Comercio]:
        return self.db.query(Comercio).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Comercio).count()

    def find_by_id(self, id: int) -> Comercio:
        comercio = self.db.query(Comercio).filter(Comercio.id == id).first()
        if not comercio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comercio {id} no encontrado",
            )
        return comercio

    def list_by_cuenta(self, id_cuenta: int) -> List[Comercio]:
        return (
            self.db.query(Comercio)
            .filter(Comercio.id_cuenta == id_cuenta)
            .all()
        )

    def add(self, data: dict) -> Comercio:
        comercio = Comercio(**data)
        self.db.add(comercio)
        self.db.commit()
        self.db.refresh(comercio)
        return comercio

    def modify(self, id: int, update_data: dict) -> Comercio:
        comercio = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(comercio, key, value)
        self.db.commit()
        self.db.refresh(comercio)
        return comercio

    def remove(self, id: int):
        comercio = self.find_by_id(id)
        comercio.activo = False
        self.db.commit()
