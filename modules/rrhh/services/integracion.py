"""FASE 5 — Integración de la liquidación con otros módulos (HTTP, token-forward).

Tres integraciones, todas idempotentes del lado del módulo destino:

  devengar(...)   -> POST {contabilidad_url}/transacciones   tipo 'rrhh.devengado'
                     (idempotente por origen_modulo='rrhh' + origen_ref='liquidacion-{id}')
  generar_op(...) -> POST {tesoreria_url}/ordenes-pago        origen='rrhh'
                     (idempotente por origen + referencia_externa='rrhh-liq-{id}')
  enviar_recibos_firma(...) -> POST {firma_url}/documentos por cada recibo
                     (idempotente por origen_modulo='rrhh' + origen_ref='recibo-{proc}-{legajo}')

Cada función registra el resultado en IntegracionProceso (upsert por proceso) y nunca
propaga la excepción de red: deja el estado en 'error' con el detalle, para que el
usuario reintente. El token del usuario se reenvía tal cual (header Authorization).
"""
import sys
import os
import hashlib
from datetime import datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.http import request_retry

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from config import get_settings
from models.rrhh import (
    LiquidacionProceso, TotalesLiquidacion, IntegracionProceso,
)

settings = get_settings()


def _now():
    return datetime.now(timezone.utc)


def _dec(v):
    if v is None:
        return Decimal(0)
    return v if isinstance(v, Decimal) else Decimal(str(v))


def _periodo(proc):
    return f"{proc.anio}-{proc.mes:02d} {proc.tipo_liq or ''}".strip()


def get_or_create_integracion(db, proc):
    integ = db.query(IntegracionProceso).filter(
        IntegracionProceso.id_proceso == proc.id).first()
    if not integ:
        integ = IntegracionProceso(id_proceso=proc.id, created_at=_now())
        db.add(integ)
        db.flush()
    return integ


def _headers(token):
    return {"Authorization": token} if token else {}


def _totales(db, proc):
    """Suma los totales del proceso a partir de TotalesLiquidacion."""
    filas = db.query(TotalesLiquidacion).filter(
        TotalesLiquidacion.id_proceso == proc.id).all()
    haberes = sum((_dec(t.haberes) + _dec(t.asig_familiar) + _dec(t.exentos) for t in filas), Decimal(0))
    aportes = sum((_dec(t.aportes_patronales) for t in filas), Decimal(0))
    reten = sum((_dec(t.retenciones) + _dec(t.descuentos) for t in filas), Decimal(0))
    neto = sum((_dec(t.neto) for t in filas), Decimal(0))
    return {"haberes": haberes, "aportes": aportes, "retenciones": reten, "neto": neto, "filas": filas}


# ─── DEVENGADO (contabilidad) ─────────────────────────────────────────
def devengar(db, proc, token):
    """Postea el devengado del costo laboral (haberes + aportes patronales) a contabilidad."""
    integ = get_or_create_integracion(db, proc)
    tot = _totales(db, proc)
    costo = (tot["haberes"] + tot["aportes"]).quantize(Decimal("0.01"))
    ref = f"liquidacion-{proc.id}"
    payload = {
        "origen_modulo": "rrhh",
        "origen_ref": ref,
        "tipo": "rrhh.devengado",
        "importe": float(costo),
        "concepto": f"Devengado de haberes {_periodo(proc)}",
        "contexto": {
            "periodo": _periodo(proc), "anio": proc.anio, "mes": proc.mes,
            "tipo_liq": proc.tipo_liq, "cantidad_legajos": proc.cantidad_legajos,
            "haberes": float(tot["haberes"]), "aportes_patronales": float(tot["aportes"]),
            "retenciones": float(tot["retenciones"]), "neto": float(tot["neto"]),
        },
    }
    integ.devengado_ref = ref
    integ.devengado_importe = costo
    try:
        r = request_retry("POST", f"{settings.contabilidad_url}/transacciones",
                          json=payload, headers=_headers(token), timeout=10)
    except Exception as ex:
        integ.devengado_estado = "error"
        integ.devengado_detalle = f"Sin respuesta de contabilidad: {str(ex)[:200]}"
        db.commit()
        return integ
    if r.status_code >= 400:
        integ.devengado_estado = "error"
        integ.devengado_detalle = f"contabilidad {r.status_code}: {r.text[:200]}"
    else:
        data = r.json()
        integ.devengado_transaccion_id = data.get("id")
        estado_tx = data.get("estado")
        integ.devengado_estado = "ok"
        integ.devengado_detalle = f"Transacción #{data.get('id')} ({estado_tx})"
    integ.devengado_fecha = _now()
    db.commit()
    return integ


# ─── ORDEN DE PAGO (tesorería) ────────────────────────────────────────
def generar_op(db, proc, token):
    """Genera una orden de pago en tesorería por el neto total del proceso."""
    integ = get_or_create_integracion(db, proc)
    tot = _totales(db, proc)
    neto = tot["neto"].quantize(Decimal("0.01"))
    ref = f"rrhh-liq-{proc.id}"
    payload = {
        "anio": proc.anio,
        "importe": float(neto),
        "concepto": f"Pago de haberes {_periodo(proc)} ({proc.cantidad_legajos} legajos)",
        "beneficiario_nombre": f"Nómina de personal — {_periodo(proc)}",
        "origen": "rrhh",
        "referencia_externa": ref,
    }
    integ.op_ref = ref
    integ.op_importe = neto
    try:
        r = request_retry("POST", f"{settings.tesoreria_url}/ordenes-pago",
                          json=payload, headers=_headers(token), timeout=10)
    except Exception as ex:
        integ.op_estado = "error"
        integ.op_detalle = f"Sin respuesta de tesorería: {str(ex)[:200]}"
        db.commit()
        return integ
    if r.status_code >= 400:
        integ.op_estado = "error"
        integ.op_detalle = f"tesorería {r.status_code}: {r.text[:200]}"
    else:
        data = r.json()
        integ.op_id = data.get("id")
        num = data.get("numero")
        if num is not None:
            integ.op_numero = f"OP-{proc.anio}-{num:05d}" if isinstance(num, int) else str(num)
        integ.op_estado = "ok"
        integ.op_detalle = f"OP #{data.get('id')} {integ.op_numero or ''}".strip()
    integ.op_fecha = _now()
    db.commit()
    return integ


# ─── RECIBOS A FIRMA (firma) ──────────────────────────────────────────
def _hash_recibo(proc, tot):
    contenido = f"{proc.id}|{tot.id_legajo}|{tot.apellido_nombre or ''}|{tot.neto}|{tot.numero_recibo or ''}"
    return hashlib.sha256(contenido.encode("utf-8")).hexdigest()


def enviar_recibos_firma(db, proc, token, cantidad_firmas=1):
    """Registra en el módulo de firma un documento por cada recibo del proceso."""
    integ = get_or_create_integracion(db, proc)
    tot = _totales(db, proc)
    enviados = 0
    fallidos = 0
    ultimo_error = None
    for t in tot["filas"]:
        payload = {
            "origen_modulo": "rrhh",
            "origen_tipo": "recibo",
            "origen_ref": f"recibo-{proc.id}-{t.id_legajo}",
            "titulo": f"Recibo {_periodo(proc)} — {t.apellido_nombre or t.legajo_numero} (${float(_dec(t.neto)):,.2f})",
            "descripcion": f"Liquidación {_periodo(proc)} — legajo {t.legajo_numero or t.id_legajo}",
            "archivo_nombre": f"recibo_{t.legajo_numero or t.id_legajo}_{proc.anio}{proc.mes:02d}.pdf",
            "contenido_hash": _hash_recibo(proc, t),
            "cantidad_firmas": int(cantidad_firmas),
        }
        try:
            r = request_retry("POST", f"{settings.firma_url}/documentos",
                              json=payload, headers=_headers(token), timeout=10)
        except Exception as ex:
            fallidos += 1
            ultimo_error = str(ex)[:150]
            continue
        if r.status_code >= 400:
            fallidos += 1
            ultimo_error = f"{r.status_code}: {r.text[:120]}"
        else:
            enviados += 1
    integ.firma_cantidad = enviados
    if fallidos == 0 and enviados > 0:
        integ.firma_estado = "ok"
        integ.firma_detalle = f"{enviados} recibos registrados en firma"
    elif enviados > 0:
        integ.firma_estado = "ok"
        integ.firma_detalle = f"{enviados} enviados, {fallidos} con error ({ultimo_error})"
    else:
        integ.firma_estado = "error"
        integ.firma_detalle = f"No se registró ningún recibo. {ultimo_error or ''}".strip()
    integ.firma_fecha = _now()
    db.commit()
    return integ
