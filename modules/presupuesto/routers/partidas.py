import csv
import io
import sys
import os
from decimal import Decimal, InvalidOperation
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.partida import Partida, Movimiento
from models.ejercicio import Ejercicio
from models.nomencladores import Jurisdiccion, ObjetoGasto, Fuente, Estructura
from services.saldos import saldos_de_partidas

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/partidas", tags=["Partidas"])


class PartidaCreate(BaseModel):
    anio: int
    id_jurisdiccion: int
    id_estructura: int
    id_objeto_gasto: int
    id_fuente: int
    credito_inicial: Decimal = Decimal("0")
    descripcion: Optional[str] = None
    etiquetas: Optional[dict] = None


def _requiere(current_user: dict, permiso: str):
    if current_user.get("superuser"):
        return
    permisos = [p["codigo"] for p in current_user.get("permisos", [])]
    if permiso not in permisos:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _ejercicio(db: Session, anio: int) -> Ejercicio:
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    return e


def _exigir_formulacion(db: Session, anio: int):
    e = _ejercicio(db, anio)
    if e.estado != "formulacion":
        raise HTTPException(
            status_code=409,
            detail=f"El ejercicio {anio} está en '{e.estado}': las partidas solo se editan en formulación (RN-02)")
    return e


def _validar_dimensiones(db: Session, p: dict):
    checks = [
        (Jurisdiccion, p["id_jurisdiccion"], "jurisdicción"),
        (Estructura, p["id_estructura"], "estructura programática"),
        (ObjetoGasto, p["id_objeto_gasto"], "objeto del gasto"),
        (Fuente, p["id_fuente"], "fuente de financiamiento"),
    ]
    for modelo, id_, nombre in checks:
        if not db.query(modelo).filter(modelo.id == id_, modelo.activo == True).first():
            raise HTTPException(status_code=400, detail=f"No existe la {nombre} (id {id_}) o está de baja (RN-01)")


def _nombres_nomencladores(db: Session, partidas: List[Partida]):
    """Mapas id→(codigo,nombre) para las dimensiones presentes."""
    def mapa(modelo, ids):
        if not ids:
            return {}
        return {x.id: {"codigo": x.codigo, "nombre": x.nombre}
                for x in db.query(modelo).filter(modelo.id.in_(list(ids))).all()}
    return {
        "juri": mapa(Jurisdiccion, {p.id_jurisdiccion for p in partidas}),
        "espr": mapa(Estructura, {p.id_estructura for p in partidas}),
        "godg": mapa(ObjetoGasto, {p.id_objeto_gasto for p in partidas}),
        "fufi": mapa(Fuente, {p.id_fuente for p in partidas}),
    }


def _serializar(p: Partida, saldos: dict, nombres: dict):
    def dim(mapa, id_):
        d = nombres[mapa].get(id_) or {}
        return {"id": id_, "codigo": d.get("codigo"), "nombre": d.get("nombre")}
    s = saldos.get(p.id, {})
    return {
        "id": p.id, "anio": p.anio,
        "jurisdiccion": dim("juri", p.id_jurisdiccion),
        "estructura": dim("espr", p.id_estructura),
        "objeto_gasto": dim("godg", p.id_objeto_gasto),
        "fuente": dim("fufi", p.id_fuente),
        "descripcion": p.descripcion, "etiquetas": p.etiquetas, "activo": p.activo,
        **{k: float(v) for k, v in s.items()},
    }


def _mov_inicial(db: Session, partida: Partida, current_user: dict):
    db.add(Movimiento(
        id_partida=partida.id, tipo="inicial", importe=partida.credito_inicial,
        origen="presupuesto", referencia_tipo="alta_partida", referencia=str(partida.id),
        id_usuario=current_user.get("id"), usuario_nombre=current_user.get("nombre_apellido"),
        observaciones="Crédito inicial",
    ))


@router.get("")
def listar(
    request: Request,
    anio: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Partida).filter(Partida.anio == anio)
    query = filtered_query(query, Partida, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id")
    partidas = query.offset(skip).limit(limit).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])
    nombres = _nombres_nomencladores(db, partidas)
    return [_serializar(p, saldos, nombres) for p in partidas]


@router.get("/{id}/movimientos")
def movimientos(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    if not db.query(Partida).filter(Partida.id == id).first():
        raise HTTPException(status_code=404, detail=f"Partida {id} no encontrada")
    movs = (db.query(Movimiento)
            .filter(Movimiento.id_partida == id, Movimiento.activo == True)
            .order_by(Movimiento.fecha.desc(), Movimiento.id.desc()).all())
    return [{
        "id": m.id, "fecha": m.fecha, "tipo": m.tipo, "importe": float(m.importe),
        "origen": m.origen, "referencia_tipo": m.referencia_tipo, "referencia": m.referencia,
        "usuario": m.usuario_nombre, "observaciones": m.observaciones,
    } for m in movs]


@router.post("", status_code=201)
def crear(data: PartidaCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    _exigir_formulacion(db, data.anio)
    p = data.model_dump()
    _validar_dimensiones(db, p)
    dupe = db.query(Partida).filter(
        Partida.anio == p["anio"], Partida.id_jurisdiccion == p["id_jurisdiccion"],
        Partida.id_estructura == p["id_estructura"], Partida.id_objeto_gasto == p["id_objeto_gasto"],
        Partida.id_fuente == p["id_fuente"], Partida.activo == True).first()
    if dupe:
        raise HTTPException(status_code=409, detail=f"Ya existe la partida con esas dimensiones (id {dupe.id}) (RN-01)")
    partida = Partida(**p)
    db.add(partida); db.flush()
    _mov_inicial(db, partida, current_user)
    db.commit(); db.refresh(partida)
    saldos = saldos_de_partidas(db, [partida.id])
    return _serializar(partida, saldos, _nombres_nomencladores(db, [partida]))


@router.put("/{id}")
def actualizar(id: int, data: PartidaCreate, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    partida = db.query(Partida).filter(Partida.id == id, Partida.activo == True).first()
    if not partida:
        raise HTTPException(status_code=404, detail=f"Partida {id} no encontrada")
    _exigir_formulacion(db, partida.anio)
    p = data.model_dump()
    _validar_dimensiones(db, p)
    dupe = db.query(Partida).filter(
        Partida.anio == p["anio"], Partida.id_jurisdiccion == p["id_jurisdiccion"],
        Partida.id_estructura == p["id_estructura"], Partida.id_objeto_gasto == p["id_objeto_gasto"],
        Partida.id_fuente == p["id_fuente"], Partida.activo == True, Partida.id != id).first()
    if dupe:
        raise HTTPException(status_code=409, detail="Ya existe otra partida con esas dimensiones (RN-01)")
    for k, v in p.items():
        setattr(partida, k, v)
    # en formulación, el movimiento 'inicial' acompaña al crédito
    mov = db.query(Movimiento).filter(
        Movimiento.id_partida == id, Movimiento.tipo == "inicial", Movimiento.activo == True).first()
    if mov:
        mov.importe = partida.credito_inicial
    else:
        _mov_inicial(db, partida, current_user)
    db.commit(); db.refresh(partida)
    saldos = saldos_de_partidas(db, [partida.id])
    return _serializar(partida, saldos, _nombres_nomencladores(db, [partida]))


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    partida = db.query(Partida).filter(Partida.id == id, Partida.activo == True).first()
    if not partida:
        raise HTTPException(status_code=404, detail=f"Partida {id} no encontrada")
    _exigir_formulacion(db, partida.anio)
    partida.activo = False
    db.query(Movimiento).filter(Movimiento.id_partida == id).update(
        {Movimiento.activo: False}, synchronize_session=False)
    db.commit()
    return {"message": f"Partida {id} dada de baja"}


# ── Carga masiva (CSV) con dry-run ───────────────────────────────────
# Columnas: jurisdiccion;estructura;objeto_gasto;fuente;credito_inicial;descripcion
@router.post("/importar")
def importar(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_write")
    anio = payload.get("anio")
    contenido = payload.get("csv") or ""
    dry_run = bool(payload.get("dry_run", False))
    if not anio or not contenido.strip():
        raise HTTPException(status_code=400, detail="anio y csv son obligatorios")
    _exigir_formulacion(db, int(anio))

    # mapas código→id de nomencladores activos
    def mapa(modelo):
        return {x.codigo: x.id for x in db.query(modelo).filter(modelo.activo == True).all()}
    m_juri, m_godg, m_fufi = mapa(Jurisdiccion), mapa(ObjetoGasto), mapa(Fuente)
    m_espr = {}
    for e in db.query(Estructura).filter(Estructura.activo == True).all():
        m_espr.setdefault(e.codigo, e.id)  # si hay repetidas por jurisdicción, gana la primera; se puede refinar

    delim = ";" if ";" in contenido.splitlines()[0] else ","
    reader = csv.reader(io.StringIO(contenido.strip()), delimiter=delim)
    filas = list(reader)
    if filas and "jurisdic" in (filas[0][0] or "").lower():
        filas = filas[1:]  # header opcional

    creadas, rechazadas = 0, []
    vistos = set()
    for i, fila in enumerate(filas, start=1):
        try:
            if len(fila) < 5:
                raise ValueError("faltan columnas (se esperan 5+: juri;espr;godg;fufi;credito[;descripcion])")
            cj, ce, cg, cf = (fila[0].strip(), fila[1].strip(), fila[2].strip(), fila[3].strip())
            ids = {}
            for etiqueta, codigo, m in (("jurisdicción", cj, m_juri), ("estructura", ce, m_espr),
                                        ("objeto del gasto", cg, m_godg), ("fuente", cf, m_fufi)):
                if codigo not in m:
                    raise ValueError(f"{etiqueta} '{codigo}' inexistente")
                ids[etiqueta] = m[codigo]
            try:
                credito = Decimal(fila[4].strip().replace(",", "."))
            except (InvalidOperation, AttributeError):
                raise ValueError(f"crédito inválido '{fila[4]}'")
            clave = (ids["jurisdicción"], ids["estructura"], ids["objeto del gasto"], ids["fuente"])
            if clave in vistos:
                raise ValueError("fila duplicada dentro del archivo")
            vistos.add(clave)
            dupe = db.query(Partida).filter(
                Partida.anio == int(anio), Partida.id_jurisdiccion == clave[0],
                Partida.id_estructura == clave[1], Partida.id_objeto_gasto == clave[2],
                Partida.id_fuente == clave[3], Partida.activo == True).first()
            if dupe:
                raise ValueError(f"la partida ya existe (id {dupe.id})")
            if not dry_run:
                partida = Partida(
                    anio=int(anio), id_jurisdiccion=clave[0], id_estructura=clave[1],
                    id_objeto_gasto=clave[2], id_fuente=clave[3], credito_inicial=credito,
                    descripcion=(fila[5].strip() if len(fila) > 5 and fila[5].strip() else None))
                db.add(partida); db.flush()
                _mov_inicial(db, partida, current_user)
            creadas += 1
        except ValueError as e:
            rechazadas.append({"fila": i, "detalle": str(e), "contenido": delim.join(fila)[:120]})
    if not dry_run:
        db.commit()
    return {"dry_run": dry_run, "procesadas": len(filas), "creadas": creadas, "rechazadas": rechazadas}


@router.get("/export", response_class=PlainTextResponse)
def exportar(anio: int = Query(...), db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    partidas = db.query(Partida).filter(Partida.anio == anio, Partida.activo == True).all()
    saldos = saldos_de_partidas(db, [p.id for p in partidas])
    nombres = _nombres_nomencladores(db, partidas)
    out = io.StringIO()
    w = csv.writer(out, delimiter=";")
    w.writerow(["jurisdiccion", "estructura", "objeto_gasto", "fuente", "descripcion",
                "inicial", "modificaciones", "vigente", "preventivo", "comprometido",
                "devengado", "pagado", "disponible"])
    for p in partidas:
        s = saldos.get(p.id, {})
        w.writerow([
            nombres["juri"].get(p.id_jurisdiccion, {}).get("codigo"),
            nombres["espr"].get(p.id_estructura, {}).get("codigo"),
            nombres["godg"].get(p.id_objeto_gasto, {}).get("codigo"),
            nombres["fufi"].get(p.id_fuente, {}).get("codigo"),
            p.descripcion or "",
            *(s.get(k, 0) for k in ("inicial", "modificaciones", "vigente", "preventivo",
                                    "comprometido", "devengado", "pagado", "disponible")),
        ])
    return PlainTextResponse(out.getvalue(), media_type="text/csv")
