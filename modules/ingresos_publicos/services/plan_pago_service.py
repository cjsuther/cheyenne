from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.plan_pago import PlanPago
from models.plan_pago_definicion import PlanPagoDefinicion
from models.plan_pago_cuota import PlanPagoCuota
from services.plan_calculo import calcular_plan, resultado_a_cuotas


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

    # ---------------------------------------------- cálculo de plan (sistema francés)
    def simular(self, monto_total, cantidad_cuotas: int, tasa_interes_pct=0, anticipo=0) -> dict:
        """Calcula un plan sin persistir (preview de la amortización)."""
        r = calcular_plan(monto_total=monto_total, cantidad_cuotas=cantidad_cuotas,
                           tasa_interes_pct=tasa_interes_pct, anticipo=anticipo)
        return {
            "monto_total": r.monto_total,
            "anticipo": r.anticipo,
            "monto_financiado": r.monto_financiado,
            "cantidad_cuotas": r.cantidad_cuotas,
            "total_intereses": r.total_intereses,
            "total_a_pagar": r.total_a_pagar,
            "cuotas": [
                {"numero": c.numero, "capital": c.capital, "interes": c.interes,
                 "importe": c.importe, "saldo": c.saldo}
                for c in r.cuotas
            ],
        }

    def generar_cuotas(self, id_plan: int, primer_vencimiento=None, periodicidad_meses: int = 1) -> dict:
        """Calcula y persiste las cuotas de un plan existente (usa su definición para la tasa)."""
        plan = self.find_by_id(id_plan)
        defi = (
            self.db.query(PlanPagoDefinicion)
            .filter(PlanPagoDefinicion.id == plan.id_plan_pago_definicion)
            .first()
        )
        tasa = (defi.tasa_interes if defi and defi.tasa_interes is not None else 0)

        r = calcular_plan(
            monto_total=plan.importe_total,
            cantidad_cuotas=plan.cantidad_cuotas,
            tasa_interes_pct=tasa,
            anticipo=plan.importe_anticipo or 0,
        )
        # reemplazar cuotas previas (idempotente)
        self.db.query(PlanPagoCuota).filter(PlanPagoCuota.id_plan_pago == id_plan).delete()
        for kw in resultado_a_cuotas(id_plan, r, primer_vencimiento, periodicidad_meses):
            self.db.add(PlanPagoCuota(**kw))
        plan.importe_cuota = r.cuotas[0].importe if r.cuotas else 0
        self.db.commit()
        return {"id_plan": id_plan, "cuotas_generadas": len(r.cuotas),
                "total_a_pagar": float(r.total_a_pagar)}

    def list_cuotas(self, id_plan: int) -> List[PlanPagoCuota]:
        return (
            self.db.query(PlanPagoCuota)
            .filter(PlanPagoCuota.id_plan_pago == id_plan, PlanPagoCuota.activo == True)
            .order_by(PlanPagoCuota.numero_cuota)
            .all()
        )

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
