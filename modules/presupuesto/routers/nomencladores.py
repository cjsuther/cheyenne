import sys
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.nomencladores import Jurisdiccion, ObjetoGasto, Fuente, Rubro, Estructura
from schemas.nomencladores import (
    JurisdiccionCreate, ObjetoGastoCreate, FuenteCreate, RubroCreate, EstructuraCreate,
)
from services.jerarquia import resolver_jerarquia, armar_arbol

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(current_user: dict, permiso: str):
    if current_user.get("superuser"):
        return
    permisos = [p["codigo"] for p in current_user.get("permisos", [])]
    if permiso not in permisos:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _a_dict(item, campos):
    return {c: getattr(item, c) for c in campos}


def crear_router_jerarquico(prefix: str, tag: str, modelo, schema_create, campos_extra: list):
    """CRUD estándar + vista de árbol para un nomenclador jerárquico de código punteado."""
    router = APIRouter(prefix=f"/{prefix}", tags=[tag])
    campos = ["id", "codigo", "nombre", "id_padre", "nivel", "activo"] + campos_extra

    @router.get("")
    def listar(
        request: Request,
        skip: int = Query(0, ge=0),
        limit: int = Query(50, ge=1, le=200),
        db: Session = Depends(get_db),
        current_user: dict = Depends(get_current_user),
    ):
        _requiere(current_user, "presupuesto_read")
        query = db.query(modelo)
        query = filtered_query(query, modelo, dict(request.query_params),
                               exclude={"skip", "limit"}, default_sort="codigo")
        return [_a_dict(i, campos) for i in query.offset(skip).limit(limit).all()]

    @router.get("/arbol")
    def arbol(
        db: Session = Depends(get_db),
        current_user: dict = Depends(get_current_user),
    ):
        _requiere(current_user, "presupuesto_read")
        filas = [_a_dict(i, campos) for i in db.query(modelo).filter(modelo.activo == True).all()]
        return armar_arbol(filas)

    @router.get("/{id}")
    def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "presupuesto_read")
        item = db.query(modelo).filter(modelo.id == id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} {id} no encontrado")
        return _a_dict(item, campos)

    @router.post("", status_code=201)
    def crear(data: schema_create, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "presupuesto_write")
        payload = data.model_dump()
        codigo, nivel, id_padre = resolver_jerarquia(db, modelo, payload["codigo"])
        if not codigo:
            raise HTTPException(status_code=400, detail="El código es obligatorio")
        if db.query(modelo).filter(modelo.codigo == codigo).first():
            raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
        payload.update(codigo=codigo, nivel=nivel, id_padre=id_padre)
        item = modelo(**payload)
        db.add(item)
        # re-vincular hijos huérfanos que esperaban este padre
        db.flush()
        db.query(modelo).filter(
            modelo.codigo.like(f"{codigo}.%"), modelo.id_padre.is_(None)
        ).filter(~modelo.codigo.like(f"{codigo}.%.%")).update(
            {modelo.id_padre: item.id}, synchronize_session=False)
        db.commit(); db.refresh(item)
        return _a_dict(item, campos)

    @router.put("/{id}")
    def actualizar(id: int, data: schema_create, db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "presupuesto_write")
        item = db.query(modelo).filter(modelo.id == id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} {id} no encontrado")
        payload = data.model_dump()
        codigo, nivel, id_padre = resolver_jerarquia(db, modelo, payload["codigo"])
        existente = db.query(modelo).filter(modelo.codigo == codigo, modelo.id != id).first()
        if existente:
            raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
        payload.update(codigo=codigo, nivel=nivel, id_padre=id_padre)
        for k, v in payload.items():
            setattr(item, k, v)
        db.commit(); db.refresh(item)
        return _a_dict(item, campos)

    @router.delete("/{id}")
    def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "presupuesto_delete")
        item = db.query(modelo).filter(modelo.id == id).first()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} {id} no encontrado")
        item.activo = False  # soft-delete (regla global de Cheyenne)
        db.commit()
        return {"message": f"{tag} {id} dado de baja"}

    return router


jurisdicciones_router = crear_router_jerarquico(
    "jurisdicciones", "Jurisdicciones", Jurisdiccion, JurisdiccionCreate, ["tipo"])
objetos_gasto_router = crear_router_jerarquico(
    "objetos-gasto", "Objetos del Gasto", ObjetoGasto, ObjetoGastoCreate, ["detalle"])
fuentes_router = crear_router_jerarquico(
    "fuentes", "Fuentes de Financiamiento", Fuente, FuenteCreate, ["detalle", "origen"])
rubros_router = crear_router_jerarquico(
    "rubros", "Rubros de Recursos", Rubro, RubroCreate, ["caracter_economico"])


# ── Estructuras programáticas (código plano, por jurisdicción) ──────
estructuras_router = APIRouter(prefix="/estructuras", tags=["Estructuras Programáticas"])
_CAMPOS_ESPR = ["id", "codigo", "nombre", "id_jurisdiccion", "tipo_programa", "descripcion", "activo"]


@estructuras_router.get("")
def listar_estructuras(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Estructura)
    query = filtered_query(query, Estructura, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="codigo")
    return [_a_dict(i, _CAMPOS_ESPR) for i in query.offset(skip).limit(limit).all()]


@estructuras_router.post("", status_code=201)
def crear_estructura(data: EstructuraCreate, db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    payload = data.model_dump()
    payload["codigo"] = (payload["codigo"] or "").strip()
    if not payload["codigo"]:
        raise HTTPException(status_code=400, detail="El código es obligatorio")
    dupe = db.query(Estructura).filter(
        Estructura.codigo == payload["codigo"],
        Estructura.id_jurisdiccion == payload.get("id_jurisdiccion")).first()
    if dupe:
        raise HTTPException(status_code=409, detail="Ya existe esa estructura para la jurisdicción")
    if payload.get("id_jurisdiccion") is not None:
        juri = db.query(Jurisdiccion).filter(
            Jurisdiccion.id == payload["id_jurisdiccion"], Jurisdiccion.activo == True).first()
        if not juri:
            raise HTTPException(status_code=400, detail="Jurisdicción inexistente")
    item = Estructura(**payload)
    db.add(item); db.commit(); db.refresh(item)
    return _a_dict(item, _CAMPOS_ESPR)


@estructuras_router.put("/{id}")
def actualizar_estructura(id: int, data: EstructuraCreate, db: Session = Depends(get_db),
                          current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    item = db.query(Estructura).filter(Estructura.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Estructura {id} no encontrada")
    payload = data.model_dump()
    dupe = db.query(Estructura).filter(
        Estructura.codigo == payload["codigo"],
        Estructura.id_jurisdiccion == payload.get("id_jurisdiccion"),
        Estructura.id != id).first()
    if dupe:
        raise HTTPException(status_code=409, detail="Ya existe esa estructura para la jurisdicción")
    for k, v in payload.items():
        setattr(item, k, v)
    db.commit(); db.refresh(item)
    return _a_dict(item, _CAMPOS_ESPR)


@estructuras_router.delete("/{id}")
def eliminar_estructura(id: int, db: Session = Depends(get_db),
                        current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    item = db.query(Estructura).filter(Estructura.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Estructura {id} no encontrada")
    item.activo = False
    db.commit()
    return {"message": f"Estructura {id} dada de baja"}


# ── Importador de jurisdicciones desde administracion (opcional) ────
@jurisdicciones_router.post("/importar")
def importar_jurisdicciones(
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Trae por HTTP las jurisdicciones del módulo administracion y las incorpora (idempotente)."""
    _requiere(current_user, "presupuesto_write")
    import httpx
    token = request.headers.get("authorization")
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.get(f"{settings.administracion_url}/jurisdicciones",
                              params={"limit": 100}, headers={"Authorization": token} if token else {})
        resp.raise_for_status()
        filas = resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"No se pudo consultar administracion: {e}")

    creadas, existentes = 0, 0
    vistos = set()
    for f in filas:
        codigo = (f.get("codigo") or "").strip()
        nombre = (f.get("nombre") or "").strip()
        if not codigo or not nombre or codigo in vistos:
            continue
        vistos.add(codigo)
        cod, nivel, id_padre = resolver_jerarquia(db, Jurisdiccion, codigo)
        if db.query(Jurisdiccion).filter(Jurisdiccion.codigo == cod).first():
            existentes += 1
            continue
        db.add(Jurisdiccion(codigo=cod, nombre=nombre, nivel=nivel, id_padre=id_padre,
                            tipo=(f.get("tipo") or None)))
        creadas += 1
    db.commit()
    return {"importadas": creadas, "ya_existian": existentes, "recibidas": len(filas)}
