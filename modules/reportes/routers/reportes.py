import sys
import os
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Any

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.reportes import ReporteConsulta

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

logger = logging.getLogger("reportes")

reportes_router = APIRouter(prefix="", tags=["Reportes consolidados"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _auth_header(request: Request) -> dict:
    """Reenvía el Authorization del request entrante a los módulos aguas abajo."""
    token = request.headers.get("authorization") or request.headers.get("Authorization")
    return {"Authorization": token} if token else {}


def _fetch(seccion: str, url: str, headers: dict, params: Optional[dict] = None,
           ok: dict = None, err: dict = None) -> dict:
    """GET best-effort a un módulo. Devuelve el JSON o un aviso, y trackea ok/err."""
    ok = {} if ok is None else ok
    err = {} if err is None else err
    try:
        with httpx.Client(timeout=8) as client:
            resp = client.get(url, headers=headers, params=params or {})
        if resp.status_code >= 400:
            err[seccion] = f"HTTP {resp.status_code}"
            logger.warning("reporte: %s respondió %s en %s", seccion, resp.status_code, url)
            return {"disponible": False, "aviso": f"El módulo respondió HTTP {resp.status_code}.", "datos": None}
        ok[seccion] = True
        try:
            return {"disponible": True, "datos": resp.json()}
        except Exception:
            return {"disponible": True, "datos": resp.text}
    except Exception as e:  # red caída, timeout, DNS, etc.
        err[seccion] = str(e)[:120]
        logger.warning("reporte: no se pudo consultar %s (%s): %s", seccion, url, e)
        return {"disponible": False, "aviso": f"El módulo no respondió: {e}", "datos": None}


def _num(v: Any) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _sum_field(datos: Any, *campos: str) -> float:
    """Suma el primer campo presente en cada fila de una lista (o de datos['items'])."""
    if datos is None:
        return 0.0
    filas = datos
    if isinstance(datos, dict):
        for k in ("items", "resultados", "data", "recaudaciones", "ordenes"):
            if isinstance(datos.get(k), list):
                filas = datos[k]
                break
        else:
            filas = [datos]
    if not isinstance(filas, list):
        return 0.0
    total = 0.0
    for fila in filas:
        if not isinstance(fila, dict):
            continue
        for c in campos:
            if c in fila and fila[c] is not None:
                total += _num(fila[c])
                break
    return total


def _log(db: Session, cu: dict, reporte: str, params: dict, ok: dict, err: dict):
    try:
        db.add(ReporteConsulta(
            reporte=reporte,
            parametros=json.dumps({k: v for k, v in params.items() if v is not None}),
            usuario=(cu.get("username") or cu.get("email") or str(cu.get("id")) if cu else None),
            modulos_ok=",".join(ok.keys()) or None,
            modulos_error=",".join(err.keys()) or None,
        ))
        db.commit()
    except Exception as e:  # el log nunca debe romper el reporte
        db.rollback()
        logger.warning("no se pudo loguear la consulta de reporte %s: %s", reporte, e)


# ── Recaudación ──────────────────────────────────────────────────────
@reportes_router.get("/recaudacion")
def recaudacion(
    request: Request,
    desde: Optional[str] = Query(None, description="Fecha desde (YYYY-MM-DD)"),
    hasta: Optional[str] = Query(None, description="Fecha hasta (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Totales de recaudación consolidados desde tesorería y emisiones."""
    _requiere(current_user, "reportes_read")
    headers = _auth_header(request)
    params = {"desde": desde, "hasta": hasta}
    qp = {k: v for k, v in params.items() if v}
    ok, err = {}, {}

    tes = _fetch("tesoreria", f"{settings.tesoreria_url}/recaudacion", headers, qp, ok, err)
    emi = _fetch("emisiones", f"{settings.emisiones_url}/emisiones/cuenta-corriente/pagos", headers, qp, ok, err)

    total_tesoreria = _sum_field(tes["datos"], "importe_cobro", "importe", "total") if tes["disponible"] else 0.0
    total_emisiones = _sum_field(emi["datos"], "importe", "importe_pagado", "total") if emi["disponible"] else 0.0

    _log(db, current_user, "recaudacion", params, ok, err)
    return {
        "reporte": "recaudacion",
        "periodo": {"desde": desde, "hasta": hasta},
        "total_recaudado": round(total_tesoreria + total_emisiones, 2),
        "secciones": {
            "tesoreria": {"disponible": tes["disponible"], "total": round(total_tesoreria, 2),
                          "aviso": tes.get("aviso"), "detalle": tes["datos"]},
            "emisiones": {"disponible": emi["disponible"], "total": round(total_emisiones, 2),
                          "aviso": emi.get("aviso"), "detalle": emi["datos"]},
        },
        "modulos_no_disponibles": list(err.keys()),
    }


# ── Cierre de caja (parte diario) ────────────────────────────────────
@reportes_router.get("/cierre-caja")
def cierre_caja(
    request: Request,
    fecha: Optional[str] = Query(None, description="Fecha del parte diario (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Parte diario: egresos (órdenes de pago) de tesorería + recaudación del día."""
    _requiere(current_user, "reportes_read")
    headers = _auth_header(request)
    f = fecha or datetime.now(timezone.utc).date().isoformat()
    qp = {"desde": f, "hasta": f}
    ok, err = {}, {}

    egresos = _fetch("egresos", f"{settings.tesoreria_url}/ordenes-pago", headers, qp, ok, err)
    recaud = _fetch("recaudacion", f"{settings.tesoreria_url}/recaudacion", headers, qp, ok, err)

    total_egresos = _sum_field(egresos["datos"], "importe", "total", "importe_pago") if egresos["disponible"] else 0.0
    total_recaudado = _sum_field(recaud["datos"], "importe_cobro", "importe", "total") if recaud["disponible"] else 0.0

    _log(db, current_user, "cierre-caja", {"fecha": f}, ok, err)
    return {
        "reporte": "cierre-caja",
        "fecha": f,
        "total_egresos": round(total_egresos, 2),
        "total_recaudado": round(total_recaudado, 2),
        "saldo_dia": round(total_recaudado - total_egresos, 2),
        "secciones": {
            "egresos": {"disponible": egresos["disponible"], "total": round(total_egresos, 2),
                        "aviso": egresos.get("aviso"), "detalle": egresos["datos"]},
            "recaudacion": {"disponible": recaud["disponible"], "total": round(total_recaudado, 2),
                            "aviso": recaud.get("aviso"), "detalle": recaud["datos"]},
        },
        "modulos_no_disponibles": list(err.keys()),
    }


# ── Ejecución presupuestaria ─────────────────────────────────────────
@reportes_router.get("/ejecucion-presupuestaria")
def ejecucion_presupuestaria(
    request: Request,
    anio: Optional[int] = Query(None, description="Ejercicio (año)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ejecución del presupuesto desde el módulo presupuesto."""
    _requiere(current_user, "reportes_read")
    headers = _auth_header(request)
    a = anio or datetime.now(timezone.utc).year
    qp = {"anio": a, "ejercicio": a}
    ok, err = {}, {}

    tablero = _fetch("presupuesto", f"{settings.presupuesto_url}/tablero", headers, qp, ok, err)
    if not tablero["disponible"]:
        # fallback a un endpoint de reportes si el tablero no está
        tablero = _fetch("presupuesto", f"{settings.presupuesto_url}/reportes/ejecucion", headers, qp, ok, err)

    datos = tablero["datos"] if tablero["disponible"] else None
    presupuestado = _sum_field(datos, "presupuestado", "credito", "vigente") if datos else 0.0
    ejecutado = _sum_field(datos, "ejecutado", "devengado", "gastado") if datos else 0.0
    pct = round((ejecutado / presupuestado * 100), 2) if presupuestado else 0.0

    _log(db, current_user, "ejecucion-presupuestaria", {"anio": a}, ok, err)
    return {
        "reporte": "ejecucion-presupuestaria",
        "anio": a,
        "presupuestado": round(presupuestado, 2),
        "ejecutado": round(ejecutado, 2),
        "porcentaje_ejecucion": pct,
        "secciones": {
            "presupuesto": {"disponible": tablero["disponible"],
                            "aviso": tablero.get("aviso"), "detalle": datos},
        },
        "modulos_no_disponibles": list(err.keys()),
    }


# ── Ciclo del gasto ──────────────────────────────────────────────────
@reportes_router.get("/ciclo-gasto")
def ciclo_gasto(
    request: Request,
    anio: Optional[int] = Query(None, description="Ejercicio (año)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ciclo del gasto (preventivo → compromiso → devengado → pagado) desde contaduría."""
    _requiere(current_user, "reportes_read")
    headers = _auth_header(request)
    a = anio or datetime.now(timezone.utc).year
    qp = {"anio": a, "ejercicio": a}
    ok, err = {}, {}

    gastos = _fetch("contaduria", f"{settings.contaduria_url}/gastos", headers, qp, ok, err)
    datos = gastos["datos"] if gastos["disponible"] else None

    resumen = {
        "comprometido": _sum_field(datos, "comprometido", "importe_compromiso") if datos else 0.0,
        "devengado": _sum_field(datos, "devengado", "importe_devengado") if datos else 0.0,
        "pagado": _sum_field(datos, "pagado", "importe_pagado") if datos else 0.0,
        "cantidad": (len(datos) if isinstance(datos, list) else 0),
    }
    resumen = {k: (round(v, 2) if isinstance(v, float) else v) for k, v in resumen.items()}

    _log(db, current_user, "ciclo-gasto", {"anio": a}, ok, err)
    return {
        "reporte": "ciclo-gasto",
        "anio": a,
        "resumen": resumen,
        "secciones": {
            "contaduria": {"disponible": gastos["disponible"],
                           "aviso": gastos.get("aviso"), "detalle": datos},
        },
        "modulos_no_disponibles": list(err.keys()),
    }


# ── Tablero (KPIs consolidados) ──────────────────────────────────────
@reportes_router.get("/tablero")
def tablero(
    request: Request,
    anio: Optional[int] = Query(None, description="Ejercicio (año)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """KPIs consolidados de toda la gestión financiera: recaudado, pagado, ejecución."""
    _requiere(current_user, "reportes_read")
    headers = _auth_header(request)
    a = anio or datetime.now(timezone.utc).year
    ok, err = {}, {}

    recaud = _fetch("recaudacion", f"{settings.tesoreria_url}/recaudacion", headers, {}, ok, err)
    egresos = _fetch("egresos", f"{settings.tesoreria_url}/ordenes-pago", headers, {}, ok, err)
    presup = _fetch("presupuesto", f"{settings.presupuesto_url}/tablero", headers, {"anio": a}, ok, err)

    recaudado = _sum_field(recaud["datos"], "importe_cobro", "importe", "total") if recaud["disponible"] else 0.0
    pagado = _sum_field(egresos["datos"], "importe", "total", "importe_pago") if egresos["disponible"] else 0.0
    presupuestado = _sum_field(presup["datos"], "presupuestado", "credito", "vigente") if presup["disponible"] else 0.0
    ejecutado = _sum_field(presup["datos"], "ejecutado", "devengado", "gastado") if presup["disponible"] else 0.0
    pct = round((ejecutado / presupuestado * 100), 2) if presupuestado else 0.0

    _log(db, current_user, "tablero", {"anio": a}, ok, err)
    return {
        "reporte": "tablero",
        "anio": a,
        "kpis": {
            "recaudado": round(recaudado, 2),
            "pagado": round(pagado, 2),
            "saldo": round(recaudado - pagado, 2),
            "presupuestado": round(presupuestado, 2),
            "ejecutado": round(ejecutado, 2),
            "porcentaje_ejecucion": pct,
        },
        "modulos_no_disponibles": list(err.keys()),
    }
