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

FASE 3 — variables expuestas al motor (además de las de Fase 2), calculadas por legajo
antes del loop de conceptos:
    @DIAS_DESCONTAR     días a descontar por ausencias del período (motivos con
                        descuenta_dias=True): suma(dias_habiles * porcentaje_descuento/100);
                        si el motivo descuenta pero porcentaje_descuento=0 se usa 100%.
    @HORAS_50 / @HORAS_100        suma de HoraExtra.cantidad del período por tipo.
    @VALOR_HORA_50 / @VALOR_HORA_100  suma de (cantidad*valor_hora) del período por tipo.
    @HS_EXTRA_IMPORTE   suma(cantidad*valor_hora*(1.5 si tipo 50 else 2)) de todo el período.

FASE 3 — embargos: tras el loop de conceptos (con TN_* ya acumulados) se aplican en código
(no por fórmula) los Embargo activos/autorizados del legajo, respetando tope monto_total y
orden (alimentos primero, luego por fecha ASC). Cada cuota genera un LiquidacionRenglon 'D'
(suma a TN_DESCU) y un EmbargoLiquidado. Al alcanzar el tope el embargo pasa a 'finalizado'.
Idempotencia: al recalcular un proceso se borran sus EmbargoLiquidado y se revierten a
'autorizado' los embargos que habían finalizado en ESE proceso.
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
    MotivoAusencia, Ausencia, HoraExtra, Embargo, EmbargoLiquidado,
    Familiar, Parentesco, GananciasDeduccion, GananciasEscala, GananciasResumen,
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
    """Borra renglones y totales del proceso para recalcular (repetible).

    FASE 3: también revierte a 'autorizado' los embargos que habían finalizado en ESTE
    proceso y borra sus EmbargoLiquidado, para que la re-liquidación sea repetible sin
    romper el control de tope.
    """
    # Revertir 'finalizado' -> 'autorizado' de embargos que se cerraron en este proceso.
    ids_emb = {r.id_embargo for r in db.query(EmbargoLiquidado.id_embargo)
               .filter(EmbargoLiquidado.id_proceso == proc.id).all()}
    if ids_emb:
        for emb in db.query(Embargo).filter(Embargo.id.in_(ids_emb),
                                            Embargo.estado == "finalizado").all():
            emb.estado = "autorizado"
    db.query(EmbargoLiquidado).filter(EmbargoLiquidado.id_proceso == proc.id).delete()
    # FASE 4: borrar el resumen de Ganancias generado por este proceso (repetible).
    db.query(GananciasResumen).filter(GananciasResumen.id_proceso == proc.id).delete()
    db.query(LiquidacionRenglon).filter(LiquidacionRenglon.id_proceso == proc.id).delete()
    db.query(TotalesLiquidacion).filter(TotalesLiquidacion.id_proceso == proc.id).delete()
    db.flush()


# ─── FASE 3: cálculo de variables y embargos ─────────────────────────
def _en_periodo(fecha_inicio, fecha_fin, ini_periodo, fin_periodo):
    """True si el rango [fecha_inicio, fecha_fin] intersecta el mes/período."""
    if not fecha_inicio or not fecha_fin:
        return False
    return fecha_inicio <= fin_periodo and fecha_fin >= ini_periodo


def _vars_fase3(db, id_legajo, anio, mes, ini_periodo, fin_periodo):
    """Calcula las variables de Fase 3 (ausencias + horas extra) del legajo/período."""
    # Ausencias que descuentan días
    motivos = {m.id: m for m in db.query(MotivoAusencia).filter(MotivoAusencia.activo == True).all()}
    dias_desc = Decimal(0)
    for a in db.query(Ausencia).filter(
            Ausencia.id_legajo == id_legajo, Ausencia.activo == True).all():
        if not _en_periodo(a.fecha_inicio, a.fecha_fin, ini_periodo, fin_periodo):
            continue
        mot = motivos.get(a.id_motivo)
        if not mot or not mot.descuenta_dias:
            continue
        pct = _dec(mot.porcentaje_descuento)
        if pct <= 0:
            pct = Decimal(100)
        dias_desc += _dec(a.dias_habiles) * pct / Decimal(100)

    # Horas extra del período por tipo
    h50 = h100 = Decimal(0)
    v50 = v100 = Decimal(0)
    hs_importe = Decimal(0)
    for he in db.query(HoraExtra).filter(
            HoraExtra.id_legajo == id_legajo, HoraExtra.activo == True,
            HoraExtra.anio == anio, HoraExtra.mes == mes).all():
        cant = _dec(he.cantidad)
        val = _dec(he.valor_hora)
        subtotal = cant * val
        if he.tipo == "100":
            h100 += cant
            v100 += subtotal
            hs_importe += subtotal * Decimal(2)
        else:
            h50 += cant
            v50 += subtotal
            hs_importe += subtotal * Decimal("1.5")

    return {
        "DIAS_DESCONTAR": dias_desc,
        "HORAS_50": h50, "HORAS_100": h100,
        "VALOR_HORA_50": v50, "VALOR_HORA_100": v100,
        "HS_EXTRA_IMPORTE": hs_importe,
    }


def _aplicar_embargos(db, proc, leg, anio, mes, fin_periodo, ctx):
    """Aplica los embargos autorizados del legajo tras el loop de conceptos.

    Usa TN_* del ctx; agrega renglones 'D' (sumando a TN_DESCU), crea EmbargoLiquidado y
    marca 'finalizado' al alcanzar el tope. Devuelve nada (muta ctx/db)."""
    q = db.query(Embargo).filter(
        Embargo.id_legajo == leg.id, Embargo.activo == True,
        Embargo.estado == "autorizado")
    embargos = q.all()
    # Filtrar por vencimiento y tope ya consumido; ordenar alimentos primero, luego fecha ASC
    aplicables = []
    for emb in embargos:
        if emb.fecha_vencimiento is not None and emb.fecha_vencimiento < fin_periodo:
            continue
        ya = sum((_dec(r[0]) for r in db.query(EmbargoLiquidado.monto)
                  .filter(EmbargoLiquidado.id_embargo == emb.id).all()), Decimal(0))
        if _dec(emb.monto_total) > 0 and ya >= _dec(emb.monto_total):
            continue
        aplicables.append((emb, ya))

    aplicables.sort(key=lambda t: (0 if t[0].tipo == "alimentos" else 1,
                                   t[0].fecha or fin_periodo, t[0].id))

    for emb, ya in aplicables:
        h = _dec(ctx.variables["TN_HABER"]); af = _dec(ctx.variables["TN_ASIGN"])
        ex = _dec(ctx.variables["TN_EXENT"]); rt = _dec(ctx.variables["TN_RETEN"])
        ds = _dec(ctx.variables["TN_DESCU"])
        base_embargable = h + af + ex - rt - ds
        if emb.respeta_salario_familiar:
            base_embargable -= af
        if base_embargable <= 0:
            continue

        if emb.retiene == "porcentaje":
            cuota = _r2(base_embargable * _dec(emb.cuota_valor) / Decimal(100))
        else:
            cuota = _r2(emb.cuota_valor)

        if _dec(emb.monto_total) > 0:
            restante = _dec(emb.monto_total) - ya
            if cuota > restante:
                cuota = _r2(restante)
        # No retener más que el neto disponible en este momento (nunca deja el neto negativo).
        # Los embargos se procesan por prioridad (alimentos primero); cada uno reduce el disponible
        # del siguiente vía TN_DESCU. Lo no retenido queda pendiente contra el tope para el mes que viene.
        if cuota > base_embargable:
            cuota = _r2(base_embargable)
        if cuota <= 0:
            continue

        db.add(LiquidacionRenglon(
            id_proceso=proc.id, id_legajo=leg.id,
            concepto_codigo=f"EMB-{emb.numero or emb.id}",
            concepto_descripcion=f"Embargo {emb.tipo} - {(emb.caratula or '')[:40]}",
            orden=Decimal("500"), tipo_concepto="D",
            importe=cuota, created_at=_now()))
        ctx.variables["TN_DESCU"] = ds + cuota
        db.add(EmbargoLiquidado(
            id_embargo=emb.id, id_proceso=proc.id, id_legajo=leg.id,
            anio=anio, mes=mes, monto=cuota, created_at=_now()))
        if _dec(emb.monto_total) > 0 and (ya + cuota) >= _dec(emb.monto_total):
            emb.estado = "finalizado"


# ─── FASE 4: IMPUESTO A LAS GANANCIAS (4ta cat.) — mensualizado acumulado ──
_KW_CONYUGE = ("conyug", "cónyug", "espos", "concub", "unión conviv", "union conviv")


def _deducciones_ganancias_anual(db, leg, anio):
    """Total ANUAL de deducciones del legajo para el año fiscal:
    mínimo no imponible + deducción especial (personales) + cargas de familia
    (cónyuge / hijo / hijo incapacitado) de los Familiares con deduce_ganancias=True."""
    ded = {d.concepto: _dec(d.importe_anual) for d in db.query(GananciasDeduccion).filter(
        GananciasDeduccion.anio == anio, GananciasDeduccion.activo == True).all()}
    total = _dec(ded.get("minimo_no_imponible", 0)) + _dec(ded.get("deduccion_especial", 0))
    fams = db.query(Familiar).filter(
        Familiar.id_legajo == leg.id, Familiar.activo == True,
        Familiar.deduce_ganancias == True).all()
    if not fams:
        return total
    parent = {p.id: (p.descripcion or "").lower() for p in db.query(Parentesco).all()}
    for f in fams:
        desc = parent.get(f.id_parentesco, "")
        if any(k in desc for k in _KW_CONYUGE):
            total += _dec(ded.get("conyuge", 0))
        elif f.discapacitado:
            total += _dec(ded.get("hijo_incapacitado", ded.get("hijo", 0)))
        else:
            total += _dec(ded.get("hijo", 0))
    return total


def _impuesto_escala(db, anio, ganancia_neta):
    """Aplica la escala progresiva del art. 94 (por año) a la ganancia neta acumulada."""
    if ganancia_neta <= 0:
        return Decimal(0)
    tramos = db.query(GananciasEscala).filter(
        GananciasEscala.anio == anio, GananciasEscala.activo == True).order_by(
        GananciasEscala.desde.asc()).all()
    if not tramos:
        return Decimal(0)
    elegido = None
    for t in tramos:
        desde = _dec(t.desde)
        hasta = _dec(t.hasta) if t.hasta is not None else None
        if ganancia_neta >= desde and (hasta is None or ganancia_neta <= hasta):
            elegido = t
            break
    if elegido is None:
        elegido = tramos[-1]  # último tramo (sin tope)
    return _r2(_dec(elegido.fijo)
               + (ganancia_neta - _dec(elegido.excedente_sobre)) * _dec(elegido.porcentaje) / Decimal(100))


def _aplicar_ganancias(db, proc, leg, anio, mes, ctx, es_sac=False):
    """Retención de Impuesto a las Ganancias por el método mensualizado acumulado.

    Se llama tras el loop de conceptos y ANTES de embargos (la retención integra el neto).
    Acumulación unificada haberes + SAC por (legajo, año): la base gravada del mes es
    TN_HABER − TN_RETEN (haberes menos aportes), se acumula año a la fecha, se le restan
    las deducciones proporcionales (anual × mes/12), se aplica la escala y se retiene el
    excedente sobre lo ya retenido en el año. Idempotente vía _reset_proceso."""
    h = _dec(ctx.variables["TN_HABER"]); rt = _dec(ctx.variables["TN_RETEN"])
    rem_neta_mes = h - rt
    if rem_neta_mes < 0:
        rem_neta_mes = Decimal(0)

    # Upsert de la fila del período (una por legajo/año/mes/es_sac)
    res = db.query(GananciasResumen).filter(
        GananciasResumen.id_legajo == leg.id, GananciasResumen.anio == anio,
        GananciasResumen.mes == mes, GananciasResumen.es_sac == es_sac).first()
    if not res:
        res = GananciasResumen(id_legajo=leg.id, anio=anio, mes=mes, es_sac=es_sac,
                               created_at=_now())
        db.add(res)
    res.id_proceso = proc.id
    res.rem_neta_gravada = _r2(rem_neta_mes)
    res.retencion_mes = Decimal(0)  # se recalcula abajo; se pone en 0 para el cómputo de ya_ret
    db.flush()

    # Acumulación unificada haberes + SAC con orden determinístico: cada fila tiene la
    # clave `mes*2 + es_sac`, de modo que el SAC de un mes se ordena SIEMPRE después del
    # mensual de ese mismo mes. Así el mensual de junio no absorbe el SAC de junio y la
    # re-liquidación es repetible aunque el SAC ya exista.
    cur_ord = mes * 2 + (1 if es_sac else 0)
    rem_acum = Decimal(0)
    ya_ret = Decimal(0)
    for f in db.query(GananciasResumen).filter(
            GananciasResumen.id_legajo == leg.id, GananciasResumen.anio == anio).all():
        o = f.mes * 2 + (1 if f.es_sac else 0)
        if o <= cur_ord:                       # acumulado incluye la fila actual
            rem_acum += _dec(f.rem_neta_gravada)
        if o < cur_ord:                        # ya retenido: sólo filas anteriores en el orden
            ya_ret += _dec(f.retencion_mes)

    ded_anual = _deducciones_ganancias_anual(db, leg, anio)
    ded_acum = _r2(ded_anual * _dec(mes) / Decimal(12))
    ganancia_neta = rem_acum - ded_acum
    if ganancia_neta < 0:
        ganancia_neta = Decimal(0)
    impuesto_acum = _impuesto_escala(db, anio, ganancia_neta)

    retencion = _r2(impuesto_acum - ya_ret)
    if retencion < 0:
        retencion = Decimal(0)

    res.deducciones = ded_acum
    res.ganancia_neta_acum = _r2(ganancia_neta)
    res.impuesto_acum = _r2(impuesto_acum)
    res.retencion_mes = retencion

    if retencion > 0:
        desc = "Retención Impuesto a las Ganancias" + (" (SAC)" if es_sac else " (4ta cat.)")
        db.add(LiquidacionRenglon(
            id_proceso=proc.id, id_legajo=leg.id,
            concepto_codigo="GANANCIAS", concepto_descripcion=desc,
            orden=Decimal("150"), tipo_concepto="R",
            base=_r2(ganancia_neta), importe=retencion, created_at=_now()))
        ctx.variables["TN_RETEN"] = rt + retencion


def liquidar(db, anio, mes, tipo_liq, valor_modulo, legajos_ids=None, quien=None):
    valor_modulo = _dec(valor_modulo)
    anio = int(anio); mes = int(mes)
    ini_periodo = date(anio, mes, 1)
    tope = date(anio, mes, _ultimo_dia(anio, mes))  # también = fin del período

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

    # 2) Conceptos activos ordenados por orden ASC.
    #    FASE 4: en SAC se liquidan sólo los conceptos marcados aguinaldo=True; en el
    #    mensual sólo los que NO son de aguinaldo.
    es_sac = (tipo_liq == "SAC")
    cq = db.query(Concepto).filter(Concepto.activo == True)
    cq = cq.filter(Concepto.aguinaldo == True) if es_sac else cq.filter(Concepto.aguinaldo == False)
    conceptos = cq.order_by(Concepto.orden.asc(), Concepto.id.asc()).all()

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
        # FASE 4: en SAC, base del aguinaldo = mejor haber del semestre / 2
        if es_sac:
            mejor = _mejor_haber_semestre(db, leg.id, anio, mes)
            if mejor <= 0:
                mejor = modulos * valor_modulo  # proxy si no hay mensuales previas
            ctx.variables["SAC_BRUTO"] = _r2(mejor / Decimal(2))
        # Novedades inyectadas al contexto
        ctx.variables.update(_novedades(db, leg.id, anio, mes))
        # FASE 3: variables de ausencias y horas extra del período
        ctx.variables.update(_vars_fase3(db, leg.id, anio, mes, ini_periodo, tope))

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

        # FASE 4: retención de Ganancias (antes de embargos: integra el neto)
        _aplicar_ganancias(db, proc, leg, anio, mes, ctx, es_sac=(tipo_liq == "SAC"))

        # FASE 3: aplicar embargos (usa el neto preliminar; suma a TN_DESCU)
        _aplicar_embargos(db, proc, leg, anio, mes, tope, ctx)

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


def _mejor_haber_semestre(db, id_legajo, anio, mes):
    """Mejor 'haberes' de las liquidaciones mensuales (no SAC) del semestre que termina en `mes`."""
    ini = 1 if mes <= 6 else 7
    fin = 6 if mes <= 6 else 12
    q = (db.query(TotalesLiquidacion.haberes)
         .join(LiquidacionProceso, LiquidacionProceso.id == TotalesLiquidacion.id_proceso)
         .filter(TotalesLiquidacion.id_legajo == id_legajo,
                 LiquidacionProceso.activo == True,
                 LiquidacionProceso.anio == anio,
                 LiquidacionProceso.mes >= ini, LiquidacionProceso.mes <= fin,
                 (LiquidacionProceso.tipo_liq != "SAC") | (LiquidacionProceso.tipo_liq.is_(None))))
    mejor = Decimal(0)
    for r in q.all():
        v = _dec(r[0])
        if v > mejor:
            mejor = v
    return mejor


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
