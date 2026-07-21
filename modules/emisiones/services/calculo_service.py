"""Servicio de cálculo de emisión (capa de BD).

Reemplaza el cálculo placeholder por el motor real: carga las `FormulaTasa` del tributo y los
contribuyentes del padrón (con su base imponible en `datos_calculo`), corre el liquidador y
persiste las `Liquidacion` con sus 4 vencimientos `a_cancelar`/`a_pagar`.

La lógica de cálculo es pura y está en `services.calculo.*` (testeada aparte); acá sólo se lee
y escribe la base.
"""
import re
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

    def _formula_a_dict(self, f) -> Dict[str, Any]:
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
        return formula_a_dict(f, acums)

    @staticmethod
    def _tasas_referenciadas(formulas: List[Dict[str, Any]]) -> set:
        """Tasas/sub-tasas referenciadas por #SUMA_ACUMU / #SUMA_FORMU (clave "tasa-sub-...")."""
        pares = set()
        campos = ("fort_Condicion", "fort_aCancelar1", "fort_aPagar1", "fort_aCancelar2",
                  "fort_aPagar2", "fort_aCancelar3", "fort_aPagar3", "fort_aCancelar4", "fort_aPagar4")
        for f in formulas:
            txt = " ".join(str(f.get(k) or "") for k in campos)
            txt += " " + " ".join(str(a.get("ftac_Importe") or "") for a in f.get("acumuladores", []))
            for t, s in re.findall(r'"(\d+)-(\d+)-', txt):
                pares.add((int(t), int(s)))
        return pares

    def _load_formulas(self, tipo_tributo: str, ttas_tasa=None, ttas_subtasa: int = 0) -> List[Dict[str, Any]]:
        if ttas_tasa is None:
            # compat: fórmulas demo cargadas por tipo de tributo
            rows = (
                self.db.query(FormulaTasa)
                .filter(FormulaTasa.tipo_tributo == tipo_tributo, FormulaTasa.activo == True)
                .all()
            )
            return [self._formula_a_dict(f) for f in rows]

        # catálogo real: cierre transitivo de las tasas referenciadas por #SUMA_ACUMU/#SUMA_FORMU
        # (se calculan para resolver las referencias, pero solo se emite la tasa objetivo)
        cargadas: set = set()
        pendientes = {(int(ttas_tasa), int(ttas_subtasa))}
        todas: List[Dict[str, Any]] = []
        for _ in range(15):  # límite de seguridad ante ciclos
            nuevas = pendientes - cargadas
            if not nuevas:
                break
            for (t, s) in nuevas:
                rows = (
                    self.db.query(FormulaTasa)
                    .filter(FormulaTasa.ttas_tasa == t, FormulaTasa.ttas_subtasa == s, FormulaTasa.activo == True)
                    .all()
                )
                fs = [self._formula_a_dict(f) for f in rows]
                todas.extend(fs)
                cargadas.add((t, s))
                pendientes |= self._tasas_referenciadas(fs)
        return todas

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
    def generar_liquidaciones(self, id_emision: int, solo_contribuyentes=None) -> Dict[str, Any]:
        emision = self._get_emision(id_emision)
        contribs = self._get_contribuyentes(id_emision)
        if solo_contribuyentes:
            objetivo = {int(x) for x in solo_contribuyentes}
            contribs = [c for c in contribs if c.id_contribuyente in objetivo]
            if not contribs:
                raise ValueError("Ninguna de las cuentas de prueba está en el padrón")
        if not contribs:
            raise ValueError("El padrón está vacío: no hay contribuyentes para liquidar")

        formulas = self._load_formulas(emision.tipo_tributo, emision.ttas_tasa, emision.ttas_subtasa or 0)
        if not formulas:
            objetivo = f"la tasa {emision.ttas_tasa}/{emision.ttas_subtasa or 0}" if emision.ttas_tasa is not None else f"el tributo '{emision.tipo_tributo}'"
            raise ValueError(f"No hay FormulaTasa activas para {objetivo}")

        periodo, mes = self._periodo_mes(emision)
        # variables por defecto de la emisión: completan las @I_* que el padrón no provee
        # (las variables propias del contribuyente tienen prioridad)
        defaults = emision.variables_default or {}
        entrada = []
        for c in contribs:
            datos = dict(c.datos_calculo or {})
            datos["variables"] = {**defaults, **(datos.get("variables") or {})}
            entrada.append({
                "id_contribuyente": c.id_contribuyente,
                "id_objeto_imponible": c.id_objeto_imponible,
                "datos": datos,
            })

        # con catálogo real: solo se emite la tasa de la emisión (las referenciadas se calculan)
        tasas_emitir = {int(emision.ttas_tasa)} if emision.ttas_tasa is not None else None
        resultado = liquidar_padron(formulas, entrada, periodo, mes, tasas_emitir)

        # idempotencia: borrar liquidaciones previas del alcance que se recalcula
        # (todas si es general; solo las cuentas objetivo si es cálculo de prueba)
        ids_contrib = {c.id_contribuyente for c in contribs}
        (self.db.query(Liquidacion)
            .filter(Liquidacion.id_emision == id_emision,
                    Liquidacion.id_contribuyente.in_(ids_contrib))
            .delete(synchronize_session=False))

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

        # errores por fórmula (resilencia): se agregan distintos para diagnóstico
        errores = sorted({e for r in resultado for e in r.get("errores", [])})

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
            "formulas_con_error": len(errores),
            "errores": errores[:10],
        }
