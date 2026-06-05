from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.emision import Emision
from models.emision_definicion import EmisionDefinicion


class EmisionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, ejercicio: int = None,
             periodo: int = None, id_estado_emision: int = None) -> List[Emision]:
        query = self.db.query(Emision)
        if ejercicio is not None:
            query = query.filter(Emision.ejercicio == ejercicio)
        if periodo is not None:
            query = query.filter(Emision.periodo == periodo)
        if id_estado_emision is not None:
            query = query.filter(Emision.id_estado_emision == id_estado_emision)
        return query.offset(skip).limit(limit).all()

    def count(self, ejercicio: int = None, periodo: int = None,
              id_estado_emision: int = None) -> int:
        query = self.db.query(Emision)
        if ejercicio is not None:
            query = query.filter(Emision.ejercicio == ejercicio)
        if periodo is not None:
            query = query.filter(Emision.periodo == periodo)
        if id_estado_emision is not None:
            query = query.filter(Emision.id_estado_emision == id_estado_emision)
        return query.count()

    def find_by_id(self, id: int) -> Emision:
        emision = self.db.query(Emision).filter(Emision.id == id).first()
        if not emision:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Emision {id} no encontrada",
            )
        return emision

    def list_by_cuenta(self, id_cuenta: int, skip: int = 0, limit: int = 100) -> List[Emision]:
        return (
            self.db.query(Emision)
            .filter(Emision.id_cuenta == id_cuenta)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def add(self, data: dict) -> Emision:
        emision = Emision(**data)
        self.db.add(emision)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def modify(self, id: int, update_data: dict) -> Emision:
        emision = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(emision, key, value)
        self.db.commit()
        self.db.refresh(emision)
        return emision

    def remove(self, id: int):
        emision = self.find_by_id(id)
        emision.id_estado_emision = 90  # Anulada
        self.db.commit()

    # ── Definiciones ──────────────────────────────────────────────────

    def list_definiciones(self, skip: int = 0, limit: int = 100, activo: bool = None) -> List[EmisionDefinicion]:
        query = self.db.query(EmisionDefinicion)
        if activo is not None:
            query = query.filter(EmisionDefinicion.activo == activo)
        return query.offset(skip).limit(limit).all()

    def find_definicion_by_id(self, id: int) -> EmisionDefinicion:
        definicion = self.db.query(EmisionDefinicion).filter(EmisionDefinicion.id == id).first()
        if not definicion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Definicion de emision {id} no encontrada",
            )
        return definicion

    def add_definicion(self, data: dict) -> EmisionDefinicion:
        definicion = EmisionDefinicion(**data)
        self.db.add(definicion)
        self.db.commit()
        self.db.refresh(definicion)
        return definicion

    def modify_definicion(self, id: int, update_data: dict) -> EmisionDefinicion:
        definicion = self.find_definicion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(definicion, key, value)
        self.db.commit()
        self.db.refresh(definicion)
        return definicion

    def remove_definicion(self, id: int):
        definicion = self.find_definicion_by_id(id)
        definicion.activo = False
        self.db.commit()
