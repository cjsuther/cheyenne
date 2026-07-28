import sys
import os
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.cuota import Cuota, DIMENSIONES_CUOTA
from models.partida import Partida
from models.nomencladores import Jurisdiccion, Fuente, ObjetoGasto
from services.cuotas import _comprometido_acumulado, _trimestre_actual
from services.jerarquia import normalizar_codigo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/cuotas", tags=["Cuotas de Compromiso"])

CERO = Decimal("0.00")


class FilaCuota(BaseModel):
    dimension_ref: str
    t1: Decimal = Decimal("0")
    t2: Decimal = Decimal("0")
    t3: Decimal = Decimal("0")
    t4: Decimal = Decimal("0")


class CuotasBulk(BaseModel):
    anio: int
    dimension_tipo: str
    filas: List[FilaCuota]


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _ambitos(db, anio: int, tipo: str):
    """Valores posibles del ámbito con su etiqueta y filtro de partidas."""
    if tipo == "jurisdiccion":
        usados = {p.id_jurisdiccion for p in db.query(Partida).filter(Partida.anio == anio, Partida.activo == True)}
        return [(str(j.id), f"{j.codigo} — {j.nombre}", Partida.id_jurisdiccion == j.id)
                for j in db.query(Jurisdiccion).filter(Jurisdiccion.activo == True) if j.id in usados]
    if tipo == "fuente":
        usados = {p.id_fuente for p in db.query(Partida).filter(Partida.anio == anio, Partida.activo == True)}
        return [(str(f.id), f"{f.codigo} — {f.nombre}", Partida.id_fuente == f.id)
                for f in db.query(Fuente).filter(Fuente.activo == True) if f.id in usados]
    # inciso: raíces de objetos usados en partidas del año
    objetos = {o.id: o for o in db.query(ObjetoGasto).all()}
    raices = {}
    for p in db.query(Partida).filter(Partida.anio == anio, Partida.activo == True):
        o = objetos.get(p.id_objeto_gasto)
        if o:
            raices.setdefault(normalizar_codigo(o.codigo).split(".")[0], set()).add(p.id_objeto_gasto)
    nombres = {normalizar_codigo(o.codigo): o.nombre for o in objetos.values() if "." not in normalizar_codigo(o.codigo)}
    return [(raiz, f"{raiz} — {nombres.get(raiz, 'Inciso ' + raiz)}",
             Partida.id_objeto_gasto.in_(list(ids)))
            for raiz, ids in sorted(raices.items())]


@router.get("")
def listar(anio: int = Query(...), dimension_tipo: str = Query("jurisdiccion"),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    if dimension_tipo not in DIMENSIONES_CUOTA:
        raise HTTPException(status_code=400, detail=f"dimension_tipo inválido: {dimension_tipo}")
    cuotas = db.query(Cuota).filter(Cuota.anio == anio, Cuota.dimension_tipo == dimension_tipo,
                                    Cuota.activo == True).all()
    por_ref = {}
    for c in cuotas:
        por_ref.setdefault(c.dimension_ref, {})[c.trimestre] = float(c.importe_autorizado)
    q = _trimestre_actual()
    filas = []
    for ref, etiqueta, filtro in _ambitos(db, anio, dimension_tipo):
        t = por_ref.get(ref, {})
        comprometido = float(_comprometido_acumulado(db, anio, filtro))
        autorizado_acum = sum(v for k, v in t.items() if k <= q)
        filas.append({
            "dimension_ref": ref, "etiqueta": etiqueta,
            "t1": t.get(1, 0), "t2": t.get(2, 0), "t3": t.get(3, 0), "t4": t.get(4, 0),
            "comprometido": comprometido,
            "autorizado_acumulado": autorizado_acum,
            "definida": ref in por_ref,
        })
    return {"anio": anio, "dimension_tipo": dimension_tipo, "trimestre_actual": q, "filas": filas}


@router.post("/bulk")
def guardar(data: CuotasBulk, db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    """Upsert de la matriz de cuotas de un ámbito (permiso aprobar_ejercicio)."""
    _requiere(current_user, "presupuesto_aprobar_ejercicio")
    if data.dimension_tipo not in DIMENSIONES_CUOTA:
        raise HTTPException(status_code=400, detail=f"dimension_tipo inválido: {data.dimension_tipo}")
    guardadas = 0
    for fila in data.filas:
        for tri, importe in ((1, fila.t1), (2, fila.t2), (3, fila.t3), (4, fila.t4)):
            c = db.query(Cuota).filter(
                Cuota.anio == data.anio, Cuota.dimension_tipo == data.dimension_tipo,
                Cuota.dimension_ref == fila.dimension_ref, Cuota.trimestre == tri).first()
            if c:
                c.importe_autorizado = importe
                c.activo = True
            else:
                db.add(Cuota(anio=data.anio, dimension_tipo=data.dimension_tipo,
                             dimension_ref=fila.dimension_ref, trimestre=tri,
                             importe_autorizado=importe))
            guardadas += 1
    db.commit()
    return {"guardadas": guardadas}
