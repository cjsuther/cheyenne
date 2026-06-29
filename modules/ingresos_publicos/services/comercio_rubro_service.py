from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.comercio_rubro import ComercioRubro


class ComercioRubroService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[ComercioRubro]:
        return self.db.query(ComercioRubro).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(ComercioRubro).count()

    def find_by_id(self, id: int) -> ComercioRubro:
        item = self.db.query(ComercioRubro).filter(ComercioRubro.id == id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Rubro {id} no encontrado")
        return item

    def list_by_comercio(self, id_comercio: int) -> List[ComercioRubro]:
        return (
            self.db.query(ComercioRubro)
            .filter(ComercioRubro.id_comercio == id_comercio, ComercioRubro.activo == True)
            .all()
        )

    def add(self, data: dict) -> ComercioRubro:
        item = ComercioRubro(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> ComercioRubro:
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
