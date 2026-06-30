from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.emision import Emision


class EmisionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, activo: Optional[bool] = None) -> List[Emision]:
        query = self.db.query(Emision)
        if activo is not None:
            query = query.filter(Emision.activo == activo)
        return query.offset(skip).limit(limit).all()

    def count(self, activo: Optional[bool] = None) -> int:
        query = self.db.query(Emision)
        if activo is not None:
            query = query.filter(Emision.activo == activo)
        return query.count()

    def find_by_id(self, id: int) -> Emision:
        emision = self.db.query(Emision).filter(Emision.id == id).first()
        if not emision:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Emision {id} no encontrada",
            )
        return emision

    @staticmethod
    def _normalizar(data: dict) -> dict:
        # variables_default puede venir como string JSON (desde el form genérico)
        vd = data.get("variables_default")
        if isinstance(vd, str):
            vd = vd.strip()
            if not vd:
                data["variables_default"] = None
            else:
                import json
                try:
                    data["variables_default"] = json.loads(vd)
                except Exception:
                    raise HTTPException(status_code=400, detail="variables_default no es un JSON válido")
        return data

    def add(self, data: dict) -> Emision:
        data = self._normalizar(data)
        emision = Emision(**data)
        self.db.add(emision)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def modify(self, id: int, update_data: dict) -> Emision:
        emision = self.find_by_id(id)
        update_data = self._normalizar(update_data)
        for key, value in update_data.items():
            if value is not None:
                setattr(emision, key, value)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def remove(self, id: int):
        emision = self.find_by_id(id)
        emision.activo = False
        self.db.commit()
