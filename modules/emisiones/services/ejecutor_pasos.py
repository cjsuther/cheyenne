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


def _liquidar(db: Session, emision: Emision, token: Optional[str], modo: str) -> Dict[str, Any]:
    cant = _asegurar_padron(db, emision, token)
    # idempotente: se recalcula desde cero (general reemplaza a prueba)
    db.query(Liquidacion).filter(Liquidacion.id_emision == emision.id).delete()
    db.flush()
    res = CalculoService(db).generar_liquidaciones(emision.id)
    res["modo"] = modo
    res["padron"] = cant
    return res


# ── Handlers por paso (key del registro) ─────────────────────────────
def h_importar(db, emision, data, token):
    ref_id = data.get("id_referencia") or data.get("id_emision_referencia")
    if not ref_id:
        raise ValueError("Indicá la emisión de referencia (id_referencia)")
    ref = db.query(Emision).filter(Emision.id == int(ref_id)).first()
    if not ref:
        raise ValueError(f"No existe la emisión de referencia {ref_id}")
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
    # La edición de parámetros se hace por PUT /emisiones/{id}. Este paso es el checkpoint.
    return {"info": "Parámetros habilitados para edición (PUT /emisiones/{id})",
            "ttas_tasa": emision.ttas_tasa, "periodo": emision.periodo}


def h_calculo_prueba(db, emision, data, token):
    # Phase 1: calcula sobre el padrón. TODO Phase 2: acotar a data['cuentas'] de prueba.
    r = _liquidar(db, emision, token, "prueba")
    r["cuentas_prueba"] = data.get("cuentas") or []
    return r


def h_calculo_general(db, emision, data, token):
    return _liquidar(db, emision, token, "general")


def h_ordenamiento(db, emision, data, token, ambito):
    # TODO Phase 2: aplicar data['criterio'] (codigo_postal/barrio/calle/numero)
    r = OrdenamientoService(db).generar_ordenamiento(emision.id)
    r["ambito"] = ambito
    r["criterio"] = data.get("criterio", "codigo_postal,barrio,calle,numero")
    return r


def h_impresion(db, emision, data, token, ambito):
    # Genera los comprobantes/recibos (con código de barras). TODO Phase 2: PDF a directorio.
    r = ComprobanteService(db).generar_comprobantes(emision.id)
    r["ambito"] = ambito
    r["directorio"] = data.get("directorio") or (f"/output/pdf/emision_{emision.id}/{ambito}")
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
