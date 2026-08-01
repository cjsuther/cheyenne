"""Ejecutor de los pasos del workflow de emisión.

Cada paso se despacha a un handler. Los pasos que producen datos reutilizan los servicios
existentes (cálculo, ordenamiento, comprobantes, cuenta corriente); las aprobaciones registran
la conformidad del operador.
"""
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from config import get_settings
from models.emision import Emision
from models.padron import Padron, ContribuyentePadron
from models.liquidacion import Liquidacion
from services.padron_loader import fetch_padron, items_a_contribuyentes
from services.calculo_service import CalculoService
from services.ordenamiento_service import OrdenamientoService
from services.comprobante_service import ComprobanteService
from services.cuenta_corriente_service import CuentaCorrienteService

settings = get_settings()


def _asegurar_padron(db: Session, emision: Emision, token: Optional[str]) -> int:
    """Carga el padrón desde ingresos_publicos si aún no está cargado. Devuelve la cantidad."""
    padron = db.query(Padron).filter(Padron.id_emision == emision.id).first()
    if padron and (padron.cantidad_registros or 0) > 0:
        return padron.cantidad_registros
    if not padron:
        padron = Padron(id_emision=emision.id, tipo_tributo=emision.tipo_tributo,
                        nombre=f"Padron {emision.tipo_tributo} - {emision.periodo}",
                        descripcion=f"Padron de la emision {emision.id}")
        db.add(padron); db.flush()
    items = fetch_padron(settings.ingresos_publicos_url, emision.tipo_tributo, token)
    if not items:
        raise ValueError("El padrón vino vacío de ingresos_publicos")
    for kw in items_a_contribuyentes(padron.id, items):
        db.add(ContribuyentePadron(**kw))
    padron.cantidad_registros = len(items)
    emision.cantidad_contribuyentes = len(items)
    db.flush()
    return len(items)


def _liquidar(db: Session, emision: Emision, token: Optional[str], modo: str, solo=None) -> Dict[str, Any]:
    cant = _asegurar_padron(db, emision, token)
    # idempotente: se recalcula desde cero (general reemplaza a prueba)
    db.query(Liquidacion).filter(Liquidacion.id_emision == emision.id).delete()
    db.flush()
    res = CalculoService(db).generar_liquidaciones(emision.id, solo_contribuyentes=solo)
    res["modo"] = modo
    res["padron"] = cant
    return res


# ── Handlers por paso (key del registro) ─────────────────────────────
def h_importar(db, emision, data, token):
    ref_id = data.get("id_referencia") or data.get("id_emision_referencia")
    if not ref_id:
        # Sin referencia: no hay de dónde importar (primera emisión del tipo o importación omitida).
        # No es un error: el paso se completa y se sigue configurando manualmente en el paso 2.
        return {"importado": False, "motivo": "Sin emisión de referencia: se continúa sin importar."}
    ref = db.query(Emision).filter(Emision.id == int(ref_id)).first()
    if not ref:
        raise ValueError(f"No existe la emisión de referencia {ref_id}")
    if ref.tipo_tributo != emision.tipo_tributo:
        raise ValueError(
            f"La emisión de referencia #{ref.id} es de otro tipo de tributo ({ref.tipo_tributo}); "
            f"solo se puede importar de una del mismo tipo ({emision.tipo_tributo})."
        )
    emision.tipo_tributo = ref.tipo_tributo
    emision.ttas_tasa = ref.ttas_tasa
    emision.ttas_subtasa = ref.ttas_subtasa
    emision.variables_default = ref.variables_default
    emision.fecha_vencimiento_1 = ref.fecha_vencimiento_1
    emision.fecha_vencimiento_2 = ref.fecha_vencimiento_2
    emision.id_emision_base = ref.id
    return {"importado_de": ref.id, "tipo_tributo": ref.tipo_tributo,
            "ttas_tasa": ref.ttas_tasa, "ttas_subtasa": ref.ttas_subtasa}


def h_editar(db, emision, data, token):
    """Aplica los parámetros editados: fechas desde/hasta, vencimientos, número de cuota,
    tasa/sub-tasa y criterios de selección."""
    from datetime import datetime

    def _date(v):
        return datetime.strptime(str(v)[:10], "%Y-%m-%d").date() if v else None

    def _dt(v):
        return datetime.fromisoformat(str(v).replace("Z", "")) if v else None

    aplicados = {}
    for k in ("numero_cuota", "ttas_tasa", "ttas_subtasa"):
        if k in data and str(data[k]).strip() not in ("", "None"):
            setattr(emision, k, int(data[k])); aplicados[k] = int(data[k])
    for k in ("fecha_desde", "fecha_hasta"):
        if data.get(k):
            setattr(emision, k, _date(data[k])); aplicados[k] = str(data[k])[:10]
    for k in ("fecha_vencimiento_1", "fecha_vencimiento_2"):
        if data.get(k):
            setattr(emision, k, _dt(data[k])); aplicados[k] = str(data[k])
    if "criterio_seleccion" in data:
        emision.criterio_seleccion = data["criterio_seleccion"] or None
        aplicados["criterio_seleccion"] = data["criterio_seleccion"]
    if "variables_default" in data and data["variables_default"] is not None:
        emision.variables_default = data["variables_default"]
        aplicados["variables_default"] = "actualizado"
    return {"editado": aplicados or "sin cambios"}


def h_calculo_prueba(db, emision, data, token):
    # acota el cálculo a las cuentas de prueba (ids de contribuyente) que carga el operador
    cuentas = data.get("cuentas") or emision.cuentas_prueba or []
    if isinstance(cuentas, str):
        cuentas = [x.strip() for x in cuentas.replace(";", ",").split(",") if x.strip()]
    cuentas = [int(x) for x in cuentas if str(x).strip().isdigit()]
    if not cuentas:
        raise ValueError("Cargá al menos una cuenta de prueba (id de contribuyente)")
    emision.cuentas_prueba = cuentas
    r = _liquidar(db, emision, token, "prueba", solo=set(cuentas))
    r["cuentas_prueba"] = cuentas
    return r


def h_calculo_general(db, emision, data, token):
    return _liquidar(db, emision, token, "general")


def h_ordenamiento(db, emision, data, token, ambito):
    crit = data.get("criterio") or emision.criterio_ordenamiento or "codigo_postal,barrio,calle,numero"
    if isinstance(crit, list):
        crit = ",".join(str(c) for c in crit)
    emision.criterio_ordenamiento = crit
    r = OrdenamientoService(db).generar_ordenamiento(emision.id)
    r["ambito"] = ambito
    r["criterio"] = crit
    return r


def h_impresion(db, emision, data, token, ambito):
    # 1) asegura los comprobantes (numerados, con código de barras)
    r = ComprobanteService(db).generar_comprobantes(emision.id)
    r["ambito"] = ambito
    # 2) genera los PDF de los recibos en el directorio
    from services.pdf_service import generar_recibos_pdf
    db.flush()
    pdf = generar_recibos_pdf(db, emision, ambito, data.get("directorio"))
    r["directorio"] = pdf["directorio"]
    r["recibos_pdf"] = pdf["recibos"]
    return r


def h_cuenta_corriente(db, emision, data, token):
    return CuentaCorrienteService(db).generar_cuentas_corrientes(emision.id)


def h_aprobacion(db, emision, data, token):
    return {"aprobado": bool(data.get("aprobado", True)), "observaciones": data.get("observaciones")}


HANDLERS = {
    "importar_calculo": h_importar,
    "editar_calculo": h_editar,
    "calculo_prueba": h_calculo_prueba,
    "aprobar_calculo_prueba": h_aprobacion,
    "calculo_general": h_calculo_general,
    "aprobar_calculo_general": h_aprobacion,
    "ordenamiento_prueba": lambda db, e, d, t: h_ordenamiento(db, e, d, t, "prueba"),
    "impresion_prueba": lambda db, e, d, t: h_impresion(db, e, d, t, "prueba"),
    "aprobar_ordenamiento_prueba": h_aprobacion,
    "aprobar_impresion_prueba": h_aprobacion,
    "aprobar_codigo_barras": h_aprobacion,
    "ordenamiento_general": lambda db, e, d, t: h_ordenamiento(db, e, d, t, "general"),
    "aprobar_ordenamiento_general": h_aprobacion,
    "impresion_general": lambda db, e, d, t: h_impresion(db, e, d, t, "general"),
    "aprobar_impresion_general": h_aprobacion,
    "generar_cuenta_corriente": h_cuenta_corriente,
}
