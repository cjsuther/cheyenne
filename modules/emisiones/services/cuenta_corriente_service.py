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

        cuentas_creadas = 0
        for liq in liquidaciones:
            cuenta = CuentaCorriente(
                id_emision=id_emision,
                id_contribuyente=liq.id_contribuyente,
                id_objeto_imponible=liq.id_objeto_imponible,
                id_liquidacion=liq.id,
                tipo_tributo=liq.tipo,
                periodo=liq.periodo,
                cuota=liq.cuota,
                concepto=f"Emision {emision.tipo_tributo} - {emision.periodo}",
                monto_original=liq.monto_final,
                monto_pagado=0,
                saldo=liq.monto_final,
                fecha_vencimiento=liq.fecha_vencimiento_1,
                estado="pendiente",
                numero_comprobante=liq.numero_comprobante,
            )
            self.db.add(cuenta)
            cuentas_creadas += 1

        self.db.commit()
        return {"cuentas_creadas": cuentas_creadas}
