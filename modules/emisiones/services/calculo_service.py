from decimal import Decimal
from typing import Dict, Any

from sqlalchemy.orm import Session

from models.emision import Emision
from models.padron import Padron, ContribuyentePadron
from models.liquidacion import Liquidacion


class CalculoService:
    def __init__(self, db: Session):
        self.db = db

    def _get_emision(self, id_emision: int) -> Emision:
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")
        return emision

    def _get_contribuyentes(self, id_emision: int):
        padrones = self.db.query(Padron).filter(
            Padron.id_emision == id_emision, Padron.activo == True
        ).all()
        contribuyentes = []
        for padron in padrones:
            contribs = self.db.query(ContribuyentePadron).filter(
                ContribuyentePadron.id_padron == padron.id,
                ContribuyentePadron.activo == True,
            ).all()
            contribuyentes.extend(contribs)
        return contribuyentes

    def calcular_base_imponible(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        contribuyentes = self._get_contribuyentes(id_emision)
        parametros = emision.parametros or {}
        base_minima = Decimal(str(parametros.get("base_imponible_minima", "0")))

        procesados = 0
        for contrib in contribuyentes:
            # Base imponible calculation placeholder
            # In production, this would query the objeto_imponible valuations
            contrib.estado = "base_calculada"
            procesados += 1
        self.db.commit()

        return {"procesados": procesados, "base_minima": float(base_minima)}

    def aplicar_alicuotas(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        parametros = emision.parametros or {}
        alicuota = Decimal(str(parametros.get("alicuota", "0.01")))

        contribuyentes = self._get_contribuyentes(id_emision)
        procesados = 0
        for contrib in contribuyentes:
            contrib.estado = "alicuota_aplicada"
            procesados += 1
        self.db.commit()

        return {"procesados": procesados, "alicuota": float(alicuota)}

    def calcular_bonificaciones(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        parametros = emision.parametros or {}
        bonificacion_pct = Decimal(str(parametros.get("bonificacion_porcentaje", "0")))

        contribuyentes = self._get_contribuyentes(id_emision)
        procesados = 0
        for contrib in contribuyentes:
            contrib.estado = "bonificacion_calculada"
            procesados += 1
        self.db.commit()

        return {"procesados": procesados, "bonificacion_porcentaje": float(bonificacion_pct)}

    def calcular_recargos(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        parametros = emision.parametros or {}
        recargo_pct = Decimal(str(parametros.get("recargo_porcentaje", "0")))

        contribuyentes = self._get_contribuyentes(id_emision)
        procesados = 0
        for contrib in contribuyentes:
            contrib.estado = "recargo_calculado"
            procesados += 1
        self.db.commit()

        return {"procesados": procesados, "recargo_porcentaje": float(recargo_pct)}

    def generar_liquidaciones(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        parametros = emision.parametros or {}
        alicuota = Decimal(str(parametros.get("alicuota", "0.01")))
        bonificacion_pct = Decimal(str(parametros.get("bonificacion_porcentaje", "0")))
        recargo_pct = Decimal(str(parametros.get("recargo_porcentaje", "0")))
        base_minima = Decimal(str(parametros.get("base_imponible_minima", "1000")))

        contribuyentes = self._get_contribuyentes(id_emision)
        liquidaciones_creadas = 0

        for contrib in contribuyentes:
            base_imponible = base_minima  # placeholder
            monto_calculado = base_imponible * alicuota
            monto_bonificacion = monto_calculado * bonificacion_pct / Decimal("100")
            monto_recargo = monto_calculado * recargo_pct / Decimal("100")
            monto_final = monto_calculado - monto_bonificacion + monto_recargo

            liquidacion = Liquidacion(
                id_emision=id_emision,
                id_contribuyente=contrib.id_contribuyente,
                id_objeto_imponible=contrib.id_objeto_imponible,
                tipo=emision.tipo_tributo,
                periodo=emision.periodo,
                cuota=1,
                base_imponible=base_imponible,
                alicuota=alicuota,
                monto_calculado=monto_calculado,
                monto_bonificacion=monto_bonificacion,
                monto_recargo=monto_recargo,
                monto_final=monto_final,
                fecha_vencimiento_1=emision.fecha_vencimiento_1,
                fecha_vencimiento_2=emision.fecha_vencimiento_2,
                estado="calculada",
                detalle_calculo={
                    "base_imponible": float(base_imponible),
                    "alicuota": float(alicuota),
                    "monto_calculado": float(monto_calculado),
                    "bonificacion": float(monto_bonificacion),
                    "recargo": float(monto_recargo),
                    "monto_final": float(monto_final),
                },
            )
            self.db.add(liquidacion)
            contrib.estado = "liquidado"
            liquidaciones_creadas += 1

        self.db.commit()
        return {"liquidaciones_creadas": liquidaciones_creadas}
