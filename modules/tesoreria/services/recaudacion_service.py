from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.recaudacion_lote import RecaudacionLote
from models.recaudacion import Recaudacion


class RecaudacionService:
    def __init__(self, db: Session):
        self.db = db

    # --- Lotes ---

    def list_lotes(self, skip: int = 0, limit: int = 100) -> List[RecaudacionLote]:
        return (
            self.db.query(RecaudacionLote)
            .order_by(RecaudacionLote.fecha_lote.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_lotes(self) -> int:
        return self.db.query(RecaudacionLote).count()

    def find_lote_by_id(self, id: int) -> RecaudacionLote:
        item = self.db.query(RecaudacionLote).filter(RecaudacionLote.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"RecaudacionLote {id} no encontrado",
            )
        return item

    def add_lote(self, data: dict) -> RecaudacionLote:
        item = RecaudacionLote(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_lote(self, id: int, update_data: dict) -> RecaudacionLote:
        item = self.find_lote_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_lote(self, id: int):
        item = self.find_lote_by_id(id)
        self.db.delete(item)
        self.db.commit()

    # --- Recaudaciones ---

    def list_recaudaciones(self, id_lote: int, skip: int = 0, limit: int = 100) -> List[Recaudacion]:
        return (
            self.db.query(Recaudacion)
            .filter(Recaudacion.id_recaudacion_lote == id_lote)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_recaudaciones(self, id_lote: int) -> int:
        return self.db.query(Recaudacion).filter(Recaudacion.id_recaudacion_lote == id_lote).count()

    def find_recaudacion_by_id(self, id: int) -> Recaudacion:
        item = self.db.query(Recaudacion).filter(Recaudacion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recaudacion {id} no encontrada",
            )
        return item

    def add_recaudacion(self, data: dict) -> Recaudacion:
        item = Recaudacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_recaudacion(self, id: int, update_data: dict) -> Recaudacion:
        item = self.find_recaudacion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_recaudacion(self, id: int):
        item = self.find_recaudacion_by_id(id)
        self.db.delete(item)
        self.db.commit()
