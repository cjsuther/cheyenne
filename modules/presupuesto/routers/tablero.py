import sys
import os
from decimal import Decimal

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.partida import Partida
from models.modificacion import Modificacion
from models.nomencladores import Jurisdiccion, ObjetoGasto, Fuente
from models.recurso import Recurso, RecursoMovimiento
from services.saldos import saldos_de_partidas
from services.jerarquia import normalizar_codigo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(tags=["Tablero"])

CERO = Decimal("0.00")
CLAVES = ("inicial", "modificaciones", "vigente", "preventivo", "comprometido", "devengado", "pagado", "disponible")


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


@router.get("/resumen")
def resumen(
    anio: int = Query(...),
    por: str = Query("inciso", pattern="^(inciso|jurisdiccion|fuente)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Tablero de ejecución del ejercicio: totales + apertura por dimensión + recursos."""
    _requiere(current_user, "presupuesto_read")
    partidas = db.query(Partida).filter(Partida.anio == anio, Partida.activo == True).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])

    # Totales del ejercicio (gastos)
    totales = {k: CERO for k in CLAVES}
    for p in partidas:
        s = saldos.get(p.id, {})
        for k in CLAVES:
            totales[k] += s.get(k, CERO)
    vigente = totales["vigente"]
    ejecucion = float(totales["devengado"] / vigente * 100) if vigente else 0.0

    # Apertura por dimensión
    if por == "jurisdiccion":
        nombres = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(Jurisdiccion).all()}
        clave = lambda p: nombres.get(p.id_jurisdiccion, f"juri {p.id_jurisdiccion}")
    elif por == "fuente":
        nombres = {x.id: f"{x.codigo} — {x.nombre}" for x in db.query(Fuente).all()}
        clave = lambda p: nombres.get(p.id_fuente, f"fuente {p.id_fuente}")
    else:  # inciso = primer segmento del objeto del gasto
        objetos = {x.id: x for x in db.query(ObjetoGasto).all()}
        raices = {normalizar_codigo(x.codigo).split(".")[0]: x.nombre
                  for x in objetos.values() if "." not in normalizar_codigo(x.codigo)}
        def clave(p):
            o = objetos.get(p.id_objeto_gasto)
            raiz = normalizar_codigo(o.codigo).split(".")[0] if o else "?"
            return f"{raiz} — {raices.get(raiz, 'Inciso ' + raiz)}"

    apertura = {}
    for p in partidas:
        k = clave(p)
        fila = apertura.setdefault(k, {c: CERO for c in CLAVES})
        s = saldos.get(p.id, {})
        for c in CLAVES:
            fila[c] += s.get(c, CERO)

    # Recursos del ejercicio
    recursos = db.query(Recurso).filter(Recurso.anio == anio, Recurso.activo == True).all()
    rec_tot = {"vigente": CERO, "percibido": CERO}
    if recursos:
        ids = [r.id for r in recursos]
        filas = (db.query(RecursoMovimiento.tipo, func.sum(RecursoMovimiento.importe))
                 .filter(RecursoMovimiento.id_recurso.in_(ids), RecursoMovimiento.activo == True)
                 .group_by(RecursoMovimiento.tipo).all())
        t = {tipo: Decimal(str(total or 0)) for tipo, total in filas}
        rec_tot = {"vigente": t.get("inicial", CERO) + t.get("modificacion", CERO),
                   "percibido": t.get("percibido", CERO)}

    ultimas = (db.query(Modificacion).filter(Modificacion.anio == anio, Modificacion.activo == True)
               .order_by(Modificacion.id.desc()).limit(5).all())

    return {
        "anio": anio,
        "cantidad_partidas": len(partidas),
        "totales": {k: float(v) for k, v in totales.items()},
        "porcentaje_ejecucion": round(ejecucion, 2),
        "apertura": {"por": por, "filas": [
            {"clave": k, **{c: float(v) for c, v in fila.items()}}
            for k, fila in sorted(apertura.items())
        ]},
        "recursos": {k: float(v) for k, v in rec_tot.items()},
        "equilibrio": float(rec_tot["vigente"] - vigente),
        "ultimas_modificaciones": [
            {"id": m.id, "numero": m.numero, "tipo": m.tipo, "estado": m.estado,
             "acto_administrativo": m.acto_administrativo, "fecha": m.fecha}
            for m in ultimas
        ],
    }
