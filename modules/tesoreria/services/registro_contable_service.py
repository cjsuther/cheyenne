from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.registro_contable_lote import RegistroContableLote
from models.registro_contable import RegistroContable


class RegistroContableService:
    def __init__(self, db: Session):
        self.db = db

    # --- Lotes ---

    def list_lotes(self, skip: int = 0, limit: int = 100) -> List[RegistroContableLote]:
        return (
            self.db.query(RegistroContableLote)
            .order_by(RegistroContableLote.fecha_lote.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_lotes(self) -> int:
        return self.db.query(RegistroContableLote).count()

    def find_lote_by_id(self, id: int) -> RegistroContableLote:
        item = self.db.query(RegistroContableLote).filter(RegistroContableLote.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"RegistroContableLote {id} no encontrado",
            )
        return item

    def add_lote(self, data: dict) -> RegistroContableLote:
        item = RegistroContableLote(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_lote(self, id: int, update_data: dict) -> RegistroContableLote:
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

    # --- Registros ---

    def list_registros(self, id_lote: int, skip: int = 0, limit: int = 100) -> List[RegistroContable]:
        return (
            self.db.query(RegistroContable)
            .filter(RegistroContable.id_registro_contable_lote == id_lote)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_registros(self, id_lote: int) -> int:
        return self.db.query(RegistroContable).filter(RegistroContable.id_registro_contable_lote == id_lote).count()

    def find_registro_by_id(self, id: int) -> RegistroContable:
        item = self.db.query(RegistroContable).filter(RegistroContable.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"RegistroContable {id} no encontrado",
            )
        return item

    def add_registro(self, data: dict) -> RegistroContable:
        item = RegistroContable(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_registro(self, id: int, update_data: dict) -> RegistroContable:
        item = self.find_registro_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_registro(self, id: int):
        item = self.find_registro_by_id(id)
        self.db.delete(item)
        self.db.commit()
