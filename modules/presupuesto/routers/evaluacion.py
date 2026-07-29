"""Evaluación presupuestaria (desvíos) y consultas multidimensión (crosstab).

MEDIA — ambos endpoints son de sólo lectura sobre las partidas / ledger / cuotas /
metas ya existentes. Reutilizan el permiso presupuesto_read.
"""
import sys
import os
from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.partida import Partida
from models.cuota import Cuota
from models.meta import Meta
from models.nomencladores import Jurisdiccion, ObjetoGasto, Fuente, Estructura
from services.saldos import saldos_de_partidas
from services.jerarquia import normalizar_codigo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(tags=["Evaluación"])

CERO = Decimal("0.00")


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _trimestre_actual() -> int:
    return (datetime.now(timezone.utc).month - 1) // 3 + 1


def _semaforo(pct: float, verde_min: float = 90.0, amarillo_min: float = 70.0) -> str:
    """Clasifica un % de cumplimiento (ejecutado sobre lo que se debería) en semáforo.
    verde: cumple lo programado; amarillo: aceptable; rojo: desvío significativo."""
    if pct >= verde_min:
        return "verde"
    if pct >= amarillo_min:
        return "amarillo"
    return "rojo"


def _f(v) -> float:
    return float(v or 0)


# ─────────────────────────────────────────────────────────────────────────────
# Evaluación / desvíos
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/evaluacion")
def evaluacion(
    anio: int = Query(...),
    trimestre: int = Query(None, ge=1, le=4, description="Trimestre de corte; por defecto el actual"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Evaluación de la ejecución con clasificación de desvíos y semáforos.

    - Desvío FINANCIERO: ejecutado (devengado) vs. vigente y vs. programado por
      cuotas de compromiso acumuladas hasta el trimestre de corte (por jurisdicción).
    - Desvío OPERATIVO: metas físicas ejecutadas vs. previstas (prorrateo lineal
      del meta_anual hasta el trimestre de corte).
    - Desvío TÉCNICO: partidas con vigente asignado y ejecución nula (formulado sin
      ejecutar) — señal de problemas de gestión/técnicos.
    """
    _requiere(current_user, "presupuesto_read")
    q = trimestre or _trimestre_actual()
    frac = Decimal(q) / Decimal(4)  # fracción del año transcurrida al corte (prorrateo lineal)

    partidas = db.query(Partida).filter(Partida.anio == anio, Partida.activo == True).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])

    juris = {x.id: x for x in db.query(Jurisdiccion).all()}
    objetos = {x.id: x for x in db.query(ObjetoGasto).all()}

    def inciso_de(p):
        o = objetos.get(p.id_objeto_gasto)
        return normalizar_codigo(o.codigo).split(".")[0] if o else "?"

    # Programado por cuotas (acumulado hasta el trimestre de corte), por jurisdicción e inciso.
    cuotas = db.query(Cuota).filter(
        Cuota.anio == anio, Cuota.activo == True, Cuota.trimestre <= q).all()
    prog_juri: dict = {}
    prog_inciso: dict = {}
    for c in cuotas:
        if c.dimension_tipo == "jurisdiccion":
            prog_juri[c.dimension_ref] = prog_juri.get(c.dimension_ref, CERO) + (c.importe_autorizado or CERO)
        elif c.dimension_tipo == "inciso":
            prog_inciso[c.dimension_ref] = prog_inciso.get(c.dimension_ref, CERO) + (c.importe_autorizado or CERO)

    # ── FINANCIERO por jurisdicción ──────────────────────────────────────────
    por_juri: dict = {}
    tot = {"vigente": CERO, "comprometido": CERO, "devengado": CERO, "programado": CERO}
    for p in partidas:
        s = saldos.get(p.id, {})
        jref = str(p.id_jurisdiccion)
        fila = por_juri.setdefault(jref, {"vigente": CERO, "comprometido": CERO, "devengado": CERO})
        fila["vigente"] += s.get("vigente", CERO)
        fila["comprometido"] += s.get("comprometido", CERO)
        fila["devengado"] += s.get("devengado", CERO)
        tot["vigente"] += s.get("vigente", CERO)
        tot["comprometido"] += s.get("comprometido", CERO)
        tot["devengado"] += s.get("devengado", CERO)

    financiero = []
    for jref, fila in por_juri.items():
        vig = fila["vigente"]
        dev = fila["devengado"]
        # programado = cuota de jurisdicción si existe; si no, prorrateo lineal del vigente
        prog = prog_juri.get(jref) if jref in prog_juri else (vig * frac)
        tot["programado"] += (prog or CERO)
        pct_vigente = _f(dev / vig * 100) if vig else 0.0
        pct_programado = _f(dev / prog * 100) if prog else 0.0
        desvio = _f(dev - prog)  # positivo = ejecutó de más; negativo = subejecución
        jn = juris.get(int(jref)) if jref.isdigit() else None
        financiero.append({
            "id_jurisdiccion": jref,
            "jurisdiccion": f"{jn.codigo} — {jn.nombre}" if jn else f"Jurisdicción {jref}",
            "vigente": _f(vig),
            "comprometido": _f(fila["comprometido"]),
            "devengado": _f(dev),
            "programado": _f(prog),
            "porcentaje_ejecucion": round(pct_vigente, 2),
            "porcentaje_vs_programado": round(pct_programado, 2),
            "desvio_financiero": round(desvio, 2),
            "fuente_programado": "cuota" if jref in prog_juri else "prorrateo",
            "semaforo": _semaforo(pct_programado if prog else pct_vigente),
        })
    financiero.sort(key=lambda r: r["vigente"], reverse=True)

    # ── OPERATIVO por meta física ─────────────────────────────────────────────
    estructuras = {x.id: x for x in db.query(Estructura).all()}
    metas = db.query(Meta).filter(Meta.anio == anio, Meta.activo == True).all()
    operativo = []
    for m in metas:
        prevista = (m.meta_anual or CERO) * frac  # lo que debería estar ejecutado al corte
        ejec = m.ejecutado or CERO
        pct = _f(ejec / prevista * 100) if prevista else (100.0 if ejec else 0.0)
        est = estructuras.get(m.id_estructura)
        operativo.append({
            "id_meta": m.id,
            "descripcion": m.descripcion,
            "unidad_medida": m.unidad_medida,
            "estructura": f"{est.codigo} — {est.nombre}" if est else None,
            "meta_anual": _f(m.meta_anual),
            "prevista_al_corte": round(_f(prevista), 2),
            "ejecutado": _f(ejec),
            "porcentaje_cumplimiento": round(pct, 2),
            "desvio_operativo": round(_f(ejec - prevista), 2),
            "semaforo": _semaforo(pct),
        })
    operativo.sort(key=lambda r: r["porcentaje_cumplimiento"])

    # ── TÉCNICO: partidas con crédito vigente y ejecución nula ────────────────
    tecnico = []
    for p in partidas:
        s = saldos.get(p.id, {})
        vig = s.get("vigente", CERO)
        dev = s.get("devengado", CERO)
        comp = s.get("comprometido", CERO)
        if vig > CERO and dev == CERO and comp == CERO:
            jn = juris.get(p.id_jurisdiccion)
            on = objetos.get(p.id_objeto_gasto)
            tecnico.append({
                "id_partida": p.id,
                "jurisdiccion": f"{jn.codigo} — {jn.nombre}" if jn else str(p.id_jurisdiccion),
                "objeto_gasto": f"{on.codigo} — {on.nombre}" if on else str(p.id_objeto_gasto),
                "inciso": inciso_de(p),
                "vigente": _f(vig),
                "descripcion": p.descripcion,
            })
    tecnico.sort(key=lambda r: r["vigente"], reverse=True)

    pct_global = _f(tot["devengado"] / tot["vigente"] * 100) if tot["vigente"] else 0.0
    pct_global_prog = _f(tot["devengado"] / tot["programado"] * 100) if tot["programado"] else 0.0

    return {
        "anio": anio,
        "trimestre": q,
        "corte": {"fraccion_anio": float(frac)},
        "totales": {
            "vigente": _f(tot["vigente"]),
            "comprometido": _f(tot["comprometido"]),
            "devengado": _f(tot["devengado"]),
            "programado": _f(tot["programado"]),
            "porcentaje_ejecucion": round(pct_global, 2),
            "porcentaje_vs_programado": round(pct_global_prog, 2),
            "semaforo": _semaforo(pct_global_prog if tot["programado"] else pct_global),
        },
        "financiero": financiero,
        "operativo": operativo,
        "tecnico": tecnico,
        "umbrales": {"verde": 90.0, "amarillo": 70.0},
    }


# ─────────────────────────────────────────────────────────────────────────────
# Consultas multidimensión (crosstab)
# ─────────────────────────────────────────────────────────────────────────────
DIMS_VALIDAS = ("jurisdiccion", "objeto", "fuente", "programa")
METRICAS_VALIDAS = ("vigente", "ejecutado", "comprometido", "preventivo", "disponible")


@router.get("/consultas/crosstab")
def crosstab(
    anio: int = Query(...),
    dims: str = Query(..., description="2 o 3 dimensiones separadas por coma: jurisdiccion,objeto,fuente,programa"),
    metrica: str = Query("vigente", description="vigente|ejecutado|comprometido|preventivo|disponible"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Tabla cruzada multidimensión sobre las partidas del ejercicio, con drill-down.

    Devuelve filas jerárquicas anidadas por las dimensiones pedidas (2 o 3), con el
    total de la métrica en cada nivel para permitir drill-down en el frontend.
    'ejecutado' = devengado.
    """
    _requiere(current_user, "presupuesto_read")

    pedidas = [d.strip() for d in dims.split(",") if d.strip()]
    if not (2 <= len(pedidas) <= 3):
        raise HTTPException(status_code=422, detail="dims debe tener 2 o 3 dimensiones")
    for d in pedidas:
        if d not in DIMS_VALIDAS:
            raise HTTPException(status_code=422, detail=f"Dimensión inválida: {d}. Válidas: {', '.join(DIMS_VALIDAS)}")
    if len(set(pedidas)) != len(pedidas):
        raise HTTPException(status_code=422, detail="Las dimensiones no pueden repetirse")
    if metrica not in METRICAS_VALIDAS:
        raise HTTPException(status_code=422, detail=f"Métrica inválida. Válidas: {', '.join(METRICAS_VALIDAS)}")

    metrica_key = "devengado" if metrica == "ejecutado" else metrica

    partidas = db.query(Partida).filter(Partida.anio == anio, Partida.activo == True).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])

    juris = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(Jurisdiccion).all()}
    objetos = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(ObjetoGasto).all()}
    fuentes = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(Fuente).all()}
    estructuras = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(Estructura).all()}

    def etiqueta(dim, p):
        if dim == "jurisdiccion":
            return juris.get(p.id_jurisdiccion, f"Jurisdicción {p.id_jurisdiccion}")
        if dim == "objeto":
            return objetos.get(p.id_objeto_gasto, f"Objeto {p.id_objeto_gasto}")
        if dim == "fuente":
            return fuentes.get(p.id_fuente, f"Fuente {p.id_fuente}")
        if dim == "programa":
            return estructuras.get(p.id_estructura, f"Estructura {p.id_estructura}")
        return "?"

    # Árbol anidado por las dimensiones en orden.
    def nuevo_nodo():
        return {"valor": CERO, "hijos": {}}

    raiz = nuevo_nodo()
    total_general = CERO
    for p in partidas:
        v = saldos.get(p.id, {}).get(metrica_key, CERO)
        total_general += v
        nodo = raiz
        nodo["valor"] += v
        for dim in pedidas:
            k = etiqueta(dim, p)
            hijo = nodo["hijos"].setdefault(k, nuevo_nodo())
            hijo["valor"] += v
            nodo = hijo

    def serializar(nodo, nivel):
        filas = []
        for clave in sorted(nodo["hijos"].keys()):
            h = nodo["hijos"][clave]
            fila = {
                "dimension": pedidas[nivel],
                "clave": clave,
                "valor": _f(h["valor"]),
                "hijos": serializar(h, nivel + 1) if nivel + 1 < len(pedidas) else [],
            }
            filas.append(fila)
        return filas

    return {
        "anio": anio,
        "dims": pedidas,
        "metrica": metrica,
        "total_general": _f(total_general),
        "filas": serializar(raiz, 0),
    }
