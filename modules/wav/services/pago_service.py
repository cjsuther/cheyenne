from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from decimal import Decimal

from models.pago_contado import PagoContado
from models.plan_pago import PlanPago
from models.declaracion_jurada import DeclaracionJurada


class PagoService:
    def __init__(self, db: Session):
        self.db = db

    def _ddjj(self, id_ddjj):
        return self.db.query(DeclaracionJurada).filter(DeclaracionJurada.id == id_ddjj).first()

    def create_pago_contado(self, pago_data: dict) -> PagoContado:
        pago = PagoContado(**pago_data)
        self.db.add(pago)
        # aplicar contra la DDJJ (baja el saldo, actualiza estado)
        ddjj = self._ddjj(pago_data.get("id_declaracion_jurada")) if pago_data.get("id_declaracion_jurada") else None
        if ddjj:
            saldo = Decimal(str(ddjj.saldo or 0)) - Decimal(str(pago_data.get("importe") or 0))
            ddjj.saldo = saldo if saldo > 0 else Decimal("0")
            ddjj.id_estado_declaracion = 30 if ddjj.saldo <= 0 else 20  # 30 pagada, 20 parcial
        self.db.commit()
        self.db.refresh(pago)
        return pago

    def create_plan_pago(self, plan_data: dict) -> PlanPago:
        plan = PlanPago(**plan_data)
        self.db.add(plan)
        # armar un plan cancela la deuda inmediata de la DDJJ (pasa a "en plan")
        ddjj = self._ddjj(plan_data.get("id_declaracion_jurada")) if plan_data.get("id_declaracion_jurada") else None
        if ddjj:
            ddjj.saldo = Decimal("0")
            ddjj.id_estado_declaracion = 40  # 40 en plan de pago
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
