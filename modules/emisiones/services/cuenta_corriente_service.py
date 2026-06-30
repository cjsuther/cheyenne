from typing import Dict, Any, List, Optional
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone, date

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from config import get_settings
from models.emision import Emision
from models.liquidacion import Liquidacion
from models.cuenta_corriente import CuentaCorriente


def _q2(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class CuentaCorrienteService:
    def __init__(self, db: Session):
        self.db = db

    def generar_cuentas_corrientes(self, id_emision: int) -> Dict[str, Any]:
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")

        liquidaciones = self.db.query(Liquidacion).filter(
            Liquidacion.id_emision == id_emision,
            Liquidacion.activo == True,
        ).all()

        # idempotente: limpiar lo previo de esta emisión antes de regenerar
        self.db.query(CuentaCorriente).filter(CuentaCorriente.id_emision == id_emision).delete()

        cuentas_creadas = 0
        total_deuda = 0
        for liq in liquidaciones:
            # la deuda imputada a la cuenta corriente es `a_cancelar` (no a_pagar, que ya
            # incluye el descuento por pago anticipado del recibo)
            deuda = liq.a_cancelar if liq.a_cancelar is not None else (liq.monto_final or 0)
            if not deuda:
                continue
            cuenta = CuentaCorriente(
                id_emision=id_emision,
                id_contribuyente=liq.id_contribuyente,
                id_objeto_imponible=liq.id_objeto_imponible,
                id_liquidacion=liq.id,
                tipo_tributo=liq.tipo,
                periodo=liq.periodo,
                cuota=liq.cuota,
                concepto=f"Emision {emision.tipo_tributo} {emision.periodo} - tasa {liq.id_tasa or ''} vto {liq.numero_vencimiento or ''}",
                monto_original=deuda,
                monto_pagado=0,
                saldo=deuda,
                fecha_vencimiento=liq.fecha_vencimiento_1,
                estado="pendiente",
                numero_comprobante=liq.numero_comprobante,
            )
            self.db.add(cuenta)
            cuentas_creadas += 1
            total_deuda += float(deuda)

        self.db.commit()
        return {"cuentas_creadas": cuentas_creadas, "total_deuda": round(total_deuda, 2)}

    # ── Mora y cobranza ──────────────────────────────────────────────────
    def _hoy(self) -> date:
        return datetime.now(timezone.utc).date()

    def calcular_recargo(self, saldo, fecha_vencimiento, fecha=None) -> Dict[str, Any]:
        """Recargo por mora simple: saldo × tasa_mensual × (días_mora / 30)."""
        saldo = _q2(saldo)
        fecha = fecha or self._hoy()
        venc = fecha_vencimiento.date() if isinstance(fecha_vencimiento, datetime) else fecha_vencimiento
        dias = (fecha - venc).days if venc else 0
        if dias <= 0 or saldo <= 0:
            return {"dias_mora": max(dias, 0), "recargo": _q2(0), "total_a_pagar": saldo}
        tasa = Decimal(str(get_settings().mora_tasa_mensual_pct)) / Decimal("100")
        recargo = _q2(saldo * tasa * Decimal(dias) / Decimal("30"))
        return {"dias_mora": dias, "recargo": recargo, "total_a_pagar": _q2(saldo + recargo)}

    def deuda_de_contribuyente(self, id_contribuyente: int, solo_deuda: bool = True) -> List[Dict[str, Any]]:
        q = self.db.query(CuentaCorriente).filter(
            CuentaCorriente.id_contribuyente == id_contribuyente,
            CuentaCorriente.activo == True,
        )
        if solo_deuda:
            q = q.filter(CuentaCorriente.saldo > 0)
        filas = q.order_by(CuentaCorriente.fecha_vencimiento).all()
        out = []
        for c in filas:
            mora = self.calcular_recargo(c.saldo, c.fecha_vencimiento)
            d = {col.name: getattr(c, col.name) for col in CuentaCorriente.__table__.columns}
            d.update(mora)
            out.append(d)
        return out

    def registrar_pago(self, id_cc: int, importe, fecha_pago=None) -> Dict[str, Any]:
        cc = self.db.query(CuentaCorriente).filter(
            CuentaCorriente.id == id_cc, CuentaCorriente.activo == True
        ).first()
        if not cc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Concepto {id_cc} no encontrado")
        saldo = _q2(cc.saldo)
        if saldo <= 0:
            raise HTTPException(status_code=400, detail="El concepto ya está cancelado")
        importe = _q2(importe)
        if importe <= 0:
            raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")

        fecha = fecha_pago or self._hoy()
        mora = self.calcular_recargo(saldo, cc.fecha_vencimiento, fecha)
        capital_pagado = min(importe, saldo)  # lo que reduce el capital de la cuenta corriente
        cc.monto_pagado = _q2(_q2(cc.monto_pagado) + capital_pagado)
        cc.saldo = _q2(_q2(cc.monto_original) - cc.monto_pagado)
        cc.estado = "pagado" if cc.saldo <= 0 else "parcial"

        historial = list(cc.historial_pagos or [])
        historial.append({
            "fecha": fecha.isoformat(),
            "importe": float(importe),
            "capital_pagado": float(capital_pagado),
            "recargo_mora": float(mora["recargo"]),
            "dias_mora": mora["dias_mora"],
            "saldo_resultante": float(cc.saldo),
        })
        cc.historial_pagos = historial
        self.db.commit()
        self.db.refresh(cc)
        return {
            "id": cc.id,
            "estado": cc.estado,
            "capital_pagado": float(capital_pagado),
            "recargo_mora": float(mora["recargo"]),
            "saldo": float(cc.saldo),
        }
