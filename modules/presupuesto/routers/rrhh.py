import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.rrhh import Cargo, PlantaRRHH
from models.partida import Partida
from models.nomencladores import Jurisdiccion, Estructura, ObjetoGasto
from models.ejercicio import Ejercicio
from services.saldos import saldos_de_partidas
from services.jerarquia import normalizar_codigo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

cargos_router = APIRouter(prefix="/cargos", tags=["Cargos"])
rrhh_router = APIRouter(prefix="/rrhh", tags=["RRHH por cargo"])

CERO = Decimal("0.00")


class CargoIn(BaseModel):
    codigo: str
    nombre: str
    categoria: Optional[str] = None
    activo: bool = True


class PlantaIn(BaseModel):
    anio: int
    id_jurisdiccion: int
    id_estructura: int
    id_cargo: int
    cantidad: int = 1
    costo_mensual: Decimal = Decimal("0")
    meses: int = 13


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Cargos (nomenclador plano) ───────────────────────────────────────
@cargos_router.get("")
def listar_cargos(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                  db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = filtered_query(db.query(Cargo), Cargo, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="codigo")
    return [{"id": c.id, "codigo": c.codigo, "nombre": c.nombre, "categoria": c.categoria,
             "activo": c.activo} for c in query.offset(skip).limit(limit).all()]


@cargos_router.post("", status_code=201)
def crear_cargo(data: CargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    if db.query(Cargo).filter(Cargo.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el cargo {data.codigo}")
    c = Cargo(codigo=data.codigo.strip(), nombre=data.nombre, categoria=data.categoria, activo=data.activo)
    db.add(c); db.commit(); db.refresh(c)
    return {"id": c.id, "codigo": c.codigo, "nombre": c.nombre, "categoria": c.categoria, "activo": c.activo}


@cargos_router.put("/{id}")
def actualizar_cargo(id: int, data: CargoIn, db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    c = db.query(Cargo).filter(Cargo.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Cargo {id} inexistente")
    if db.query(Cargo).filter(Cargo.codigo == data.codigo.strip(), Cargo.id != id).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el cargo {data.codigo}")
    c.codigo, c.nombre, c.categoria, c.activo = data.codigo.strip(), data.nombre, data.categoria, data.activo
    db.commit()
    return {"id": c.id, "codigo": c.codigo, "nombre": c.nombre, "categoria": c.categoria, "activo": c.activo}


@cargos_router.delete("/{id}")
def eliminar_cargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    c = db.query(Cargo).filter(Cargo.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Cargo {id} inexistente")
    c.activo = False; db.commit()
    return {"message": f"Cargo {id} dado de baja"}


# ── Planta RRHH ──────────────────────────────────────────────────────
def _serializar_planta(f: PlantaRRHH, nombres):
    costo_anual = Decimal(str(f.costo_mensual)) * f.cantidad * f.meses
    return {
        "id": f.id, "anio": f.anio,
        "jurisdiccion": nombres["juri"].get(f.id_jurisdiccion, {}),
        "estructura": nombres["espr"].get(f.id_estructura, {}),
        "cargo": nombres["cargo"].get(f.id_cargo, {}),
        "cantidad": f.cantidad, "costo_mensual": float(f.costo_mensual), "meses": f.meses,
        "costo_anual": float(costo_anual), "activo": f.activo,
    }


def _nombres_planta(db, filas):
    def mapa(modelo, ids):
        if not ids:
            return {}
        return {x.id: {"id": x.id, "codigo": x.codigo, "nombre": x.nombre}
                for x in db.query(modelo).filter(modelo.id.in_(list(ids))).all()}
    return {"juri": mapa(Jurisdiccion, {f.id_jurisdiccion for f in filas}),
            "espr": mapa(Estructura, {f.id_estructura for f in filas}),
            "cargo": mapa(Cargo, {f.id_cargo for f in filas})}


def _exigir_formulacion(db, anio):
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    if e.estado != "formulacion":
        raise HTTPException(status_code=409, detail=f"La planta se edita en formulación (está '{e.estado}')")


@rrhh_router.get("")
def listar_planta(request: Request, anio: int = Query(...), skip: int = Query(0, ge=0),
                  limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = db.query(PlantaRRHH).filter(PlantaRRHH.anio == anio, PlantaRRHH.activo == True)
    query = filtered_query(query, PlantaRRHH, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id")
    filas = query.offset(skip).limit(limit).all()
    nombres = _nombres_planta(db, filas)
    return [_serializar_planta(f, nombres) for f in filas]


@rrhh_router.post("", status_code=201)
def crear_planta(data: PlantaIn, db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    _exigir_formulacion(db, data.anio)
    if data.cantidad < 1 or data.costo_mensual < 0 or not (1 <= data.meses <= 14):
        raise HTTPException(status_code=400, detail="Cantidad/costo/meses inválidos")
    dupe = db.query(PlantaRRHH).filter(
        PlantaRRHH.anio == data.anio, PlantaRRHH.id_jurisdiccion == data.id_jurisdiccion,
        PlantaRRHH.id_estructura == data.id_estructura, PlantaRRHH.id_cargo == data.id_cargo,
        PlantaRRHH.activo == True).first()
    if dupe:
        raise HTTPException(status_code=409, detail="Ya existe esa fila de planta (editá la existente)")
    f = PlantaRRHH(**data.model_dump())
    db.add(f); db.commit(); db.refresh(f)
    return _serializar_planta(f, _nombres_planta(db, [f]))


@rrhh_router.put("/{id}")
def actualizar_planta(id: int, data: PlantaIn, db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    f = db.query(PlantaRRHH).filter(PlantaRRHH.id == id, PlantaRRHH.activo == True).first()
    if not f:
        raise HTTPException(status_code=404, detail=f"Fila {id} inexistente")
    _exigir_formulacion(db, f.anio)
    for k, v in data.model_dump().items():
        setattr(f, k, v)
    db.commit()
    return _serializar_planta(f, _nombres_planta(db, [f]))


@rrhh_router.delete("/{id}")
def eliminar_planta(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    f = db.query(PlantaRRHH).filter(PlantaRRHH.id == id, PlantaRRHH.activo == True).first()
    if not f:
        raise HTTPException(status_code=404, detail=f"Fila {id} inexistente")
    _exigir_formulacion(db, f.anio)
    f.activo = False; db.commit()
    return {"message": f"Fila {id} dada de baja"}


@rrhh_router.get("/resumen")
def resumen_rrhh(anio: int = Query(...), db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    """Planta presupuestada vs. crédito del inciso 1 (Gastos en personal)."""
    _requiere(current_user, "presupuesto_read")
    filas = db.query(PlantaRRHH).filter(PlantaRRHH.anio == anio, PlantaRRHH.activo == True).all()
    total_cargos = sum(f.cantidad for f in filas)
    costo_total = sum((Decimal(str(f.costo_mensual)) * f.cantidad * f.meses for f in filas), CERO)
    # crédito vigente del inciso 1
    objetos = db.query(ObjetoGasto).all()
    ids_inciso1 = [o.id for o in objetos if normalizar_codigo(o.codigo).split(".")[0] == "1"]
    partidas = db.query(Partida).filter(Partida.anio == anio, Partida.activo == True,
                                        Partida.id_objeto_gasto.in_(ids_inciso1 or [0])).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])
    credito_inciso1 = sum((saldos[p.id]["vigente"] for p in partidas), CERO)
    return {
        "anio": anio, "filas_planta": len(filas), "total_cargos": total_cargos,
        "costo_anual_planta": float(costo_total),
        "credito_vigente_inciso1": float(credito_inciso1),
        "cobertura": float(credito_inciso1 - costo_total),
    }
