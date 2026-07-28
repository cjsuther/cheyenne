"""Validación de compromisos contra cuotas trimestrales (modelo acumulado)."""
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func

from models.cuota import Cuota
from models.partida import Partida, Movimiento
from models.nomencladores import ObjetoGasto
from services.jerarquia import normalizar_codigo

CERO = Decimal("0.00")


def _trimestre_actual() -> int:
    return (datetime.now(timezone.utc).month - 1) // 3 + 1


def _inciso_de(db, partida: Partida) -> str:
    o = db.query(ObjetoGasto).filter(ObjetoGasto.id == partida.id_objeto_gasto).first()
    return normalizar_codigo(o.codigo).split(".")[0] if o else "?"


def _comprometido_acumulado(db, anio: int, filtro) -> Decimal:
    total = (db.query(func.sum(Movimiento.importe))
             .join(Partida, Partida.id == Movimiento.id_partida)
             .filter(Partida.anio == anio, Movimiento.tipo == "compromiso",
                     Movimiento.activo == True, filtro)
             .scalar())
    return Decimal(str(total or 0))


def validar_cuota_compromiso(db, partida: Partida, importe: Decimal):
    """Devuelve la lista de violaciones de cuota (ámbitos definidos que se excederían).
    Modelo acumulado: autorizado Q1..Qactual vs. comprometido del año + nuevo importe.
    Sin cuotas definidas para un ámbito → sin restricción en ese ámbito."""
    q = _trimestre_actual()
    ambitos = [
        ("jurisdiccion", str(partida.id_jurisdiccion), Partida.id_jurisdiccion == partida.id_jurisdiccion),
        ("fuente", str(partida.id_fuente), Partida.id_fuente == partida.id_fuente),
    ]
    inciso = _inciso_de(db, partida)
    ids_inciso = [o.id for o in db.query(ObjetoGasto).all()
                  if normalizar_codigo(o.codigo).split(".")[0] == inciso]
    ambitos.append(("inciso", inciso, Partida.id_objeto_gasto.in_(ids_inciso or [0])))

    violaciones = []
    for tipo, ref, filtro in ambitos:
        filas = db.query(Cuota).filter(
            Cuota.anio == partida.anio, Cuota.dimension_tipo == tipo,
            Cuota.dimension_ref == ref, Cuota.activo == True).all()
        if not filas:
            continue
        autorizado = sum((f.importe_autorizado for f in filas if f.trimestre <= q), CERO)
        comprometido = _comprometido_acumulado(db, partida.anio, filtro)
        if comprometido + importe > autorizado:
            violaciones.append(
                f"Cuota de {tipo} '{ref}' excedida: autorizado acumulado T{q} = {autorizado}, "
                f"comprometido {comprometido} + nuevo {importe} (fase 2)")
    return violaciones
