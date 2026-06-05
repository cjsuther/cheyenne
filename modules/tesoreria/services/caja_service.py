from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.caja import Caja
from models.caja_asignacion import CajaAsignacion


class CajaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Caja]:
        return self.db.query(Caja).order_by(Caja.orden).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Caja).count()

    def find_by_id(self, id: int) -> Caja:
        item = self.db.query(Caja).filter(Caja.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Caja {id} no encontrada",
            )
        return item

    def add(self, data: dict) -> Caja:
        item = Caja(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> Caja:
        item = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove(self, id: int):
        item = self.find_by_id(id)
        self.db.delete(item)
        self.db.commit()

    def list_asignaciones(self, id_caja: int, skip: int = 0, limit: int = 100) -> List[CajaAsignacion]:
        return (
            self.db.query(CajaAsignacion)
            .filter(CajaAsignacion.id_caja == id_caja)
            .order_by(CajaAsignacion.fecha_apertura.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_asignacion_by_id(self, id: int) -> CajaAsignacion:
        item = self.db.query(CajaAsignacion).filter(CajaAsignacion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"CajaAsignacion {id} no encontrada",
            )
        return item

    def add_asignacion(self, data: dict) -> CajaAsignacion:
        item = CajaAsignacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_asignacion(self, id: int, update_data: dict) -> CajaAsignacion:
        item = self.find_asignacion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_asignacion(self, id: int):
        item = self.find_asignacion_by_id(id)
        self.db.delete(item)
        self.db.commit()
