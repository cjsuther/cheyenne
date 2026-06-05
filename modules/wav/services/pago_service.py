from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.pago_contado import PagoContado
from models.plan_pago import PlanPago


class PagoService:
    def __init__(self, db: Session):
        self.db = db

    def create_pago_contado(self, pago_data: dict) -> PagoContado:
        pago = PagoContado(**pago_data)
        self.db.add(pago)
        self.db.commit()
        self.db.refresh(pago)
        return pago

    def create_plan_pago(self, plan_data: dict) -> PlanPago:
        plan = PlanPago(**plan_data)
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def list_pagos_by_cuenta(self, id_cuenta: int, skip: int = 0, limit: int = 20) -> dict:
        pagos_contado = (
            self.db.query(PagoContado)
            .filter(PagoContado.id_cuenta == id_cuenta)
            .order_by(PagoContado.fecha_pago.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        planes_pago = (
            self.db.query(PlanPago)
            .filter(PlanPago.id_cuenta == id_cuenta)
            .order_by(PlanPago.fecha_alta.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return {
            "pagos_contado": pagos_contado,
            "planes_pago": planes_pago,
        }
