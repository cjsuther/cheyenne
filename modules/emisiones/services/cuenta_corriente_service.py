from typing import Dict, Any

from sqlalchemy.orm import Session

from models.emision import Emision
from models.liquidacion import Liquidacion
from models.cuenta_corriente import CuentaCorriente


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
