"""Servicio de cálculo de emisión (capa de BD).

Reemplaza el cálculo placeholder por el motor real: carga las `FormulaTasa` del tributo y los
contribuyentes del padrón (con su base imponible en `datos_calculo`), corre el liquidador y
persiste las `Liquidacion` con sus 4 vencimientos `a_cancelar`/`a_pagar`.

La lógica de cálculo es pura y está en `services.calculo.*` (testeada aparte); acá sólo se lee
y escribe la base.
"""
from decimal import Decimal
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from models.emision import Emision
from models.padron import Padron, ContribuyentePadron
from models.liquidacion import Liquidacion
from models.formula_tasa import FormulaTasa, FormulaTasaAcumulador

from services.calculo.orquestador import liquidar_padron
from services.calculo.repo import formula_a_dict


class CalculoService:
    def __init__(self, db: Session):
        self.db = db

    # ------------------------------------------------------------------ helpers
    def _get_emision(self, id_emision: int) -> Emision:
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")
        return emision

    def _get_contribuyentes(self, id_emision: int) -> List[ContribuyentePadron]:
        padrones = self.db.query(Padron).filter(
            Padron.id_emision == id_emision, Padron.activo == True
        ).all()
        ids = [p.id for p in padrones]
        if not ids:
            return []
        return (
            self.db.query(ContribuyentePadron)
            .filter(ContribuyentePadron.id_padron.in_(ids), ContribuyentePadron.activo == True)
            .all()
        )

    def _load_formulas(self, tipo_tributo: str) -> List[Dict[str, Any]]:
        rows = (
            self.db.query(FormulaTasa)
            .filter(FormulaTasa.tipo_tributo == tipo_tributo, FormulaTasa.activo == True)
            .all()
        )
        out = []
        for f in rows:
            acums = (
                self.db.query(FormulaTasaAcumulador)
                .filter(
                    FormulaTasaAcumulador.ttas_tasa == f.ttas_tasa,
                    FormulaTasaAcumulador.ttas_subtasa == f.ttas_subtasa,
                    FormulaTasaAcumulador.fort_numero == f.fort_numero,
                    FormulaTasaAcumulador.activo == True,
                )
                .all()
            )
            out.append(formula_a_dict(f, acums))
        return out

    @staticmethod
    def _periodo_mes(emision: Emision) -> tuple[int, int]:
        p = str(emision.periodo or "0").strip()
        if len(p) >= 6 and p.isdigit():
            return int(p[:4]), int(p[4:6])
        try:
            return int(p), 12   # sólo año -> tomo fin de año (todas las vigencias vigentes)
        except ValueError:
            return 0, 12

    # ------------------------------------------------ pasos 4-7 (validación/progreso)
    def calcular_base_imponible(self, id_emision: int) -> Dict[str, Any]:
        contribs = self._get_contribuyentes(id_emision)
        sin_datos = sum(1 for c in contribs if not c.datos_calculo)
        for c in contribs:
            c.estado = "base_calculada"
        self.db.commit()
        return {"contribuyentes": len(contribs), "sin_base_imponible": sin_datos}

    def aplicar_alicuotas(self, id_emision: int) -> Dict[str, Any]:
        return {"info": "las alícuotas se aplican vía FormulaTasa en el paso 8"}

    def calcular_bonificaciones(self, id_emision: int) -> Dict[str, Any]:
        return {"info": "las bonificaciones se aplican vía FormulaTasa (aPagar) en el paso 8"}

    def calcular_recargos(self, id_emision: int) -> Dict[str, Any]:
        return {"info": "los recargos de mora se aplican en la recaudación, no en la emisión"}

    # --------------------------------------------------- paso 8: liquidación real
    def generar_liquidaciones(self, id_emision: int) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        contribs = self._get_contribuyentes(id_emision)
        if not contribs:
            raise ValueError("El padrón está vacío: no hay contribuyentes para liquidar")

        formulas = self._load_formulas(emision.tipo_tributo)
        if not formulas:
            raise ValueError(
                f"No hay FormulaTasa activas para el tributo '{emision.tipo_tributo}'"
            )

        periodo, mes = self._periodo_mes(emision)
        entrada = [
            {
                "id_contribuyente": c.id_contribuyente,
                "id_objeto_imponible": c.id_objeto_imponible,
                "datos": c.datos_calculo or {},
            }
            for c in contribs
        ]

        resultado = liquidar_padron(formulas, entrada, periodo, mes)

        creadas = 0
        monto_total = Decimal("0.00")
        for r in resultado:
            for linea in r["lineas"]:
                self.db.add(Liquidacion(
                    id_emision=id_emision,
                    id_contribuyente=r["id_contribuyente"],
                    id_objeto_imponible=r["id_objeto_imponible"],
                    tipo=emision.tipo_tributo,
                    periodo=emision.periodo,
                    cuota=linea["vencimiento"],
                    id_tasa=linea["tasa"],
                    id_sub_tasa=linea["subtasa"],
                    fort_numero=linea["formula"],
                    numero_vencimiento=linea["vencimiento"],
                    a_cancelar=linea["a_cancelar"],
                    a_pagar=linea["a_pagar"],
                    monto_final=linea["a_pagar"],
                    estado="calculada",
                    detalle_calculo={
                        "tasa": linea["tasa"], "subtasa": linea["subtasa"],
                        "formula": linea["formula"], "vencimiento": linea["vencimiento"],
                        "a_cancelar": float(linea["a_cancelar"]), "a_pagar": float(linea["a_pagar"]),
                    },
                ))
                creadas += 1
            monto_total += r["monto_a_pagar"]

        # marcar contribuyentes liquidados
        for c in contribs:
            c.estado = "liquidado"
        emision.cantidad_contribuyentes = len(contribs)
        emision.monto_total = monto_total
        self.db.commit()

        return {
            "liquidaciones_creadas": creadas,
            "contribuyentes": len(contribs),
            "monto_total": float(monto_total),
        }
