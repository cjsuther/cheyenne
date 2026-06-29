from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.comercio_ddjj import ComercioDDJJ


class ComercioDDJJService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[ComercioDDJJ]:
        return self.db.query(ComercioDDJJ).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(ComercioDDJJ).count()

    def find_by_id(self, id: int) -> ComercioDDJJ:
        item = self.db.query(ComercioDDJJ).filter(ComercioDDJJ.id == id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"DDJJ {id} no encontrada")
        return item

    def list_by_comercio(self, id_comercio: int) -> List[ComercioDDJJ]:
        return (
            self.db.query(ComercioDDJJ)
            .filter(ComercioDDJJ.id_comercio == id_comercio, ComercioDDJJ.activo == True)
            .order_by(ComercioDDJJ.periodo.desc(), ComercioDDJJ.mes.desc())
            .all()
        )

    def add(self, data: dict) -> ComercioDDJJ:
        item = ComercioDDJJ(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> ComercioDDJJ:
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
