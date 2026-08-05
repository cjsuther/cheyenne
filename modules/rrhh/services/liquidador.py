"""Liquidador mensual de RRHH (Fase 2).

Corre el motor de conceptos (fórmulas de texto interpretadas por `interprete.py`) sobre
cada legajo activo de un período y persiste renglones + totales.

Contrato de la función pública:

    liquidar(db, anio, mes, tipo_liq, valor_modulo, legajos_ids=None, quien=None)
        -> {"id_proceso", "legajos", "total_haberes", "total_retenciones", "total_neto"}

Idempotencia: por (anio, mes, tipo_liq) hay un único LiquidacionProceso activo. Si ya
existe, se reutiliza y se BORRAN sus renglones/totales para recalcular (repetible).

Variables inyectadas al Contexto de cada legajo:
    MODULOS, VALOR_MODULO, ANIOS_ANTIG, y los acumuladores en 0:
    TN_HABER, TN_ASIGN, TN_EXENT, TN_RETEN, TN_DESCU, TN_APORT
    (+ las Novedades aplicables como variables sin @).

Acumuladores por tipo de concepto:
    H -> TN_HABER   A -> TN_ASIGN   E -> TN_EXENT
    R -> TN_RETEN   D -> TN_DESCU   P -> TN_APORT
Neto = TN_HABER + TN_ASIGN + TN_EXENT - TN_RETEN - TN_DESCU (P no afecta neto).
"""
import sys
import os
from datetime import date, datetime, timezone, timedelta
from decimal import Decimal, ROUND_HALF_EVEN

sys.path.insert(0, os.path.dirname(__file__))                       # services/  (para interprete)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))   # rrhh root  (para models)

from interprete import Contexto, evaluar, evaluar_logica, ErrorFormula
from models.rrhh import (
    Concepto, Legajo, LegajoCargo, Categoria, Antiguedad, TipoAntiguedad,
    Novedad, LiquidacionProceso, LiquidacionRenglon, TotalesLiquidacion,
)

Q2 = Decimal("0.01")
Q4 = Decimal("0.0001")

# Acumulador destino por tipo de concepto
_ACUM = {"H": "TN_HABER", "A": "TN_ASIGN", "E": "TN_EXENT",
         "R": "TN_RETEN", "D": "TN_DESCU", "P": "TN_APORT"}


def _now():
    return datetime.now(timezone.utc)


def _dec(v):
    if v is None:
        return Decimal(0)
    return v if isinstance(v, Decimal) else Decimal(str(v))


def _r2(v):
    return _dec(v).quantize(Q2, rounding=ROUND_HALF_EVEN)


def _r4(v):
    return _dec(v).quantize(Q4, rounding=ROUND_HALF_EVEN)


def _norm_var(nombre):
    """Normaliza el nombre de variable de una novedad: sin @, upper, sin espacios."""
    return (nombre or "").strip().lstrip("@").upper()


def _cargo_activo(db, id_legajo):
    """Cargo activo más reciente (fecha_egreso_cargo null), fallback: el más reciente."""
    q = db.query(LegajoCargo).filter(
        LegajoCargo.id_legajo == id_legajo, LegajoCargo.activo == True)
    vigentes = q.filter(LegajoCargo.fecha_egreso_cargo.is_(None)).order_by(LegajoCargo.id.desc()).first()
    if vigentes:
        return vigentes
    return q.order_by(LegajoCargo.id.desc()).first()


def _anios_entre(desde, hasta):
    if not desde:
        return Decimal(0)
    dias = (hasta - desde).days
    if dias < 0:
        return Decimal(0)
    return _dec(dias) / Decimal(365)


def _anios_antig(db, id_legajo, tope):
    """Suma de años de las antigüedades cuyo TipoAntiguedad.computa=True, hasta `tope`."""
    tipos_computa = {t.id for t in db.query(TipoAntiguedad).filter(
        TipoAntiguedad.computa == True).all()}
    total = Decimal(0)
    for a in db.query(Antiguedad).filter(
            Antiguedad.id_legajo == id_legajo, Antiguedad.activo == True).all():
        if a.id_tipo_antiguedad is not None and a.id_tipo_antiguedad not in tipos_computa:
            continue
        hasta = a.fecha_hasta or tope
        if hasta > tope:
            hasta = tope
        total += _anios_entre(a.fecha_desde, hasta)
    return total


def _novedades(db, id_legajo, anio, mes):
    """Novedades aplicables: id_legajo == legajo o null; (anio,mes) matchea o null.
    Devuelve {VAR_NORMALIZADA: valor}."""
    out = {}
    q = db.query(Novedad).filter(Novedad.activo == True)
    for nv in q.all():
        if nv.id_legajo is not None and nv.id_legajo != id_legajo:
            continue
        if nv.anio is not None and nv.anio != anio:
            continue
        if nv.mes is not None and nv.mes != mes:
            continue
        out[_norm_var(nv.variable)] = _dec(nv.valor)
    return out


def _reset_proceso(db, proc):
    """Borra renglones y totales del proceso para recalcular (repetible)."""
    db.query(LiquidacionRenglon).filter(LiquidacionRenglon.id_proceso == proc.id).delete()
    db.query(TotalesLiquidacion).filter(TotalesLiquidacion.id_proceso == proc.id).delete()
    db.flush()


def liquidar(db, anio, mes, tipo_liq, valor_modulo, legajos_ids=None, quien=None):
    valor_modulo = _dec(valor_modulo)
    tope = date(int(anio), int(mes), _ultimo_dia(int(anio), int(mes)))

    # 1) Proceso idempotente por (anio, mes, tipo_liq) activo
    proc = db.query(LiquidacionProceso).filter(
        LiquidacionProceso.anio == anio,
        LiquidacionProceso.mes == mes,
        LiquidacionProceso.tipo_liq == tipo_liq,
        LiquidacionProceso.activo == True,
    ).first()
    if proc:
        _reset_proceso(db, proc)
        proc.valor_modulo = _r4(valor_modulo)
        proc.estado = "procesada"
        proc.creado_por = quien
    else:
        proc = LiquidacionProceso(
            anio=anio, mes=mes, tipo_liq=tipo_liq, valor_modulo=_r4(valor_modulo),
            estado="procesada", creado_por=quien, created_at=_now(), activo=True)
        db.add(proc)
        db.flush()

    # 2) Conceptos activos ordenados por orden ASC
    conceptos = db.query(Concepto).filter(Concepto.activo == True).order_by(
        Concepto.orden.asc(), Concepto.id.asc()).all()

    # 3) Legajos activos (filtrados)
    lq = db.query(Legajo).filter(Legajo.activo == True, Legajo.estado != "baja")
    if legajos_ids:
        lq = lq.filter(Legajo.id.in_(legajos_ids))
    legajos = lq.order_by(Legajo.id).all()

    tot_haberes = tot_reten = tot_neto = Decimal(0)
    n_legajos = 0
    recibo_seq = 0

    for leg in legajos:
        cargo = _cargo_activo(db, leg.id)
        modulos = Decimal(0)
        if cargo and cargo.id_categoria:
            cat = db.query(Categoria).filter(Categoria.id == cargo.id_categoria).first()
            if cat:
                modulos = _dec(cat.cantidad_modulos)
        anios = _anios_antig(db, leg.id, tope)

        ctx = Contexto()
        ctx.periodo = int(anio)
        ctx.mes = int(mes)
        ctx.variables.update({
            "MODULOS": modulos,
            "VALOR_MODULO": valor_modulo,
            "ANIOS_ANTIG": anios,
            "TN_HABER": Decimal(0), "TN_ASIGN": Decimal(0), "TN_EXENT": Decimal(0),
            "TN_RETEN": Decimal(0), "TN_DESCU": Decimal(0), "TN_APORT": Decimal(0),
        })
        # Novedades inyectadas al contexto
        ctx.variables.update(_novedades(db, leg.id, anio, mes))

        for con in conceptos:
            # condición
            if con.condicion and con.condicion.strip():
                try:
                    if not evaluar_logica(con.condicion, ctx):
                        continue
                except ErrorFormula:
                    continue

            cantidad = _eval_opt(con.cantidad, ctx)
            base = _eval_opt(con.base, ctx)
            porcentaje = _eval_opt(con.porcentaje, ctx)
            ctx.variables["CALCCANTI"] = cantidad if cantidad is not None else Decimal(0)
            ctx.variables["CALCBASE"] = base if base is not None else Decimal(0)
            ctx.variables["CALCPORCE"] = porcentaje if porcentaje is not None else Decimal(0)

            if con.formula and con.formula.strip():
                importe = evaluar(con.formula, ctx)
            else:
                # fallback simple sin fórmula
                if base is not None and porcentaje is not None:
                    importe = base * porcentaje / Decimal(100)
                elif cantidad is not None and base is not None:
                    importe = cantidad * base
                else:
                    importe = Decimal(0)
            importe = _r2(importe)

            # actualizar acumulador
            acum = _ACUM.get(con.tipo)
            if acum:
                ctx.variables[acum] = _dec(ctx.variables.get(acum, 0)) + importe

            db.add(LiquidacionRenglon(
                id_proceso=proc.id, id_legajo=leg.id,
                id_cargo=cargo.id if cargo else None,
                concepto_codigo=con.codigo, concepto_descripcion=con.descripcion,
                orden=_dec(con.orden), tipo_concepto=con.tipo,
                cantidad=_r4(cantidad) if cantidad is not None else Decimal(0),
                base=_r2(base) if base is not None else Decimal(0),
                porcentaje=_r4(porcentaje) if porcentaje is not None else Decimal(0),
                importe=importe, created_at=_now()))

        h = _dec(ctx.variables["TN_HABER"]); af = _dec(ctx.variables["TN_ASIGN"])
        ex = _dec(ctx.variables["TN_EXENT"]); rt = _dec(ctx.variables["TN_RETEN"])
        ds = _dec(ctx.variables["TN_DESCU"]); ap = _dec(ctx.variables["TN_APORT"])
        neto = _r2(h + af + ex - rt - ds)

        recibo_seq += 1
        db.add(TotalesLiquidacion(
            id_proceso=proc.id, id_legajo=leg.id, legajo_numero=leg.numero_legajo,
            apellido_nombre=leg.apellido_nombre,
            haberes=_r2(h), asig_familiar=_r2(af), exentos=_r2(ex),
            retenciones=_r2(rt), descuentos=_r2(ds), aportes_patronales=_r2(ap),
            neto=neto, numero_recibo=f"{proc.id}-{recibo_seq:05d}", created_at=_now()))

        tot_haberes += _r2(h) + _r2(af) + _r2(ex)
        tot_reten += _r2(rt) + _r2(ds)
        tot_neto += neto
        n_legajos += 1

    # 4) Totales del proceso
    proc.cantidad_legajos = n_legajos
    proc.total_haberes = _r2(tot_haberes)
    proc.total_retenciones = _r2(tot_reten)
    proc.total_neto = _r2(tot_neto)
    db.commit()

    return {
        "id_proceso": proc.id,
        "legajos": n_legajos,
        "total_haberes": float(_r2(tot_haberes)),
        "total_retenciones": float(_r2(tot_reten)),
        "total_neto": float(_r2(tot_neto)),
    }


def _eval_opt(formula, ctx):
    """Evalúa una fórmula de texto opcional. Devuelve None si vacía o error."""
    if not formula or not str(formula).strip():
        return None
    try:
        return evaluar(formula, ctx)
    except ErrorFormula:
        return None


def _ultimo_dia(anio, mes):
    if mes == 12:
        return 31
    return (date(anio, mes + 1, 1) - timedelta(days=1)).day
