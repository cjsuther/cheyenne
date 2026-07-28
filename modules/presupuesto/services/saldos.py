"""Saldos derivados del ledger (DD-01): nunca se almacenan, siempre se calculan."""
from decimal import Decimal
from sqlalchemy import func

from models.partida import Movimiento

CERO = Decimal("0.00")


def saldos_de_partidas(db, ids_partidas):
    """{id_partida: {inicial, modificacion, vigente, preventivo, comprometido, devengado, pagado, disponible}}"""
    if not ids_partidas:
        return {}
    filas = (
        db.query(Movimiento.id_partida, Movimiento.tipo, func.sum(Movimiento.importe))
        .filter(Movimiento.id_partida.in_(list(ids_partidas)), Movimiento.activo == True)
        .group_by(Movimiento.id_partida, Movimiento.tipo)
        .all()
    )
    por_partida = {}
    for id_p, tipo, total in filas:
        por_partida.setdefault(id_p, {})[tipo] = Decimal(str(total or 0))

    out = {}
    for id_p in ids_partidas:
        t = por_partida.get(id_p, {})
        inicial = t.get("inicial", CERO) + t.get("ajuste", CERO)
        modif = t.get("modificacion", CERO)
        vigente = inicial + modif
        preventivo = t.get("preventivo", CERO)
        comprometido = t.get("compromiso", CERO)
        devengado = t.get("devengado", CERO)
        pagado = t.get("pagado", CERO)
        out[id_p] = {
            "inicial": inicial, "modificaciones": modif, "vigente": vigente,
            "preventivo": preventivo, "comprometido": comprometido,
            "devengado": devengado, "pagado": pagado,
            "disponible": vigente - preventivo - comprometido,  # §5.3 del diseño
        }
    return out
