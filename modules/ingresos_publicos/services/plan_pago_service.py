from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.plan_pago import PlanPago
from models.plan_pago_definicion import PlanPagoDefinicion


class PlanPagoService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[PlanPago]:
        return self.db.query(PlanPago).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(PlanPago).count()

    def find_by_id(self, id: int) -> PlanPago:
        plan = self.db.query(PlanPago).filter(PlanPago.id == id).first()
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan de pago {id} no encontrado",
            )
        return plan

    def list_by_cuenta(self, id_cuenta: int) -> List[PlanPago]:
        return (
            self.db.query(PlanPago)
            .filter(PlanPago.id_cuenta == id_cuenta)
            .all()
        )

    def list_by_contribuyente(self, id_contribuyente: int) -> List[PlanPago]:
        return (
            self.db.query(PlanPago)
            .filter(PlanPago.id_contribuyente == id_contribuyente)
            .all()
        )

    def add(self, data: dict) -> PlanPago:
        plan = PlanPago(**data)
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def modify(self, id: int, update_data: dict) -> PlanPago:
        plan = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(plan, key, value)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def remove(self, id: int):
        plan = self.find_by_id(id)
        plan.id_estado_plan = 90  # Cancelado
        self.db.commit()

    # ── Definiciones ──────────────────────────────────────────────────

    def list_definiciones(self, skip: int = 0, limit: int = 100, activo: bool = None) -> List[PlanPagoDefinicion]:
        query = self.db.query(PlanPagoDefinicion)
        if activo is not None:
            query = query.filter(PlanPagoDefinicion.activo == activo)
        return query.offset(skip).limit(limit).all()

    def find_definicion_by_id(self, id: int) -> PlanPagoDefinicion:
        definicion = self.db.query(PlanPagoDefinicion).filter(PlanPagoDefinicion.id == id).first()
        if not definicion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Definicion de plan de pago {id} no encontrada",
            )
        return definicion

    def add_definicion(self, data: dict) -> PlanPagoDefinicion:
        definicion = PlanPagoDefinicion(**data)
        self.db.add(definicion)
        self.db.commit()
        self.db.refresh(definicion)
        return definicion

    def modify_definicion(self, id: int, update_data: dict) -> PlanPagoDefinicion:
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
