import sys
import os
from decimal import Decimal
from datetime import date
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
from models.rrhh import Legajo, LegajoCargo, Antiguedad, Familiar, ESTADOS_LEGAJO

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _ser(x, cols):
    out = {}
    for c in cols:
        v = getattr(x, c)
        if isinstance(v, Decimal):
            v = float(v)
        out[c] = v
    return out


# ═══ LEGAJOS ══════════════════════════════════════════════════════════
legajos_router = APIRouter(prefix="/legajos", tags=["Legajos"])
_LEG = ["id", "numero_legajo", "id_persona", "apellido_nombre", "cuil",
        "id_tipo_relacion", "id_obra_social", "id_sindicato", "fecha_ingreso",
        "fecha_egreso", "estado", "cbu", "banco", "activo"]
_CARGO = ["id", "id_legajo", "id_categoria", "id_tipo_cargo", "id_cargo_funcion",
          "id_oficina", "fecha_ingreso_cargo", "fecha_egreso_cargo", "letra_nombramiento",
          "anio_nombramiento", "numero_nombramiento", "fecha_nombramiento", "expediente",
          "id_partida", "jurisdiccion", "estructura", "fuente", "objeto_gasto", "activo"]
_ANTIG = ["id", "id_legajo", "fecha_desde", "fecha_hasta", "lugar", "id_tipo_antiguedad", "activo"]
_FAM = ["id", "id_legajo", "apellido_nombre", "documento", "id_parentesco", "a_cargo",
        "deduce_ganancias", "discapacitado", "porcentaje_deduccion", "activo"]


class LegajoIn(BaseModel):
    numero_legajo: str
    id_persona: Optional[int] = None
    apellido_nombre: str
    cuil: Optional[str] = None
    id_tipo_relacion: Optional[int] = None
    id_obra_social: Optional[int] = None
    id_sindicato: Optional[int] = None
    fecha_ingreso: Optional[date] = None
    fecha_egreso: Optional[date] = None
    estado: str = "activo"
    cbu: Optional[str] = None
    banco: Optional[str] = None
    activo: bool = True


@legajos_router.get("")
def listar_legajos(request: Request, estado: str = Query(None), skip: int = Query(0, ge=0),
                   limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Legajo).filter(Legajo.activo == True)
    if estado:
        q = q.filter(Legajo.estado == estado)
    q = filtered_query(q, Legajo, dict(request.query_params),
                       exclude={"skip", "limit", "estado"}, default_sort="numero_legajo")
    return [_ser(x, _LEG) for x in q.offset(skip).limit(limit).all()]


@legajos_router.get("/{id}")
def obtener_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Legajo).filter(Legajo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    return _ser(x, _LEG)


@legajos_router.get("/{id}/cargos")
def cargos_de_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(LegajoCargo).filter(LegajoCargo.id_legajo == id, LegajoCargo.activo == True).order_by(LegajoCargo.id)
    return [_ser(x, _CARGO) for x in q.all()]


@legajos_router.get("/{id}/antiguedades")
def antiguedades_de_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Antiguedad).filter(Antiguedad.id_legajo == id, Antiguedad.activo == True).order_by(Antiguedad.id)
    return [_ser(x, _ANTIG) for x in q.all()]


@legajos_router.get("/{id}/familiares")
def familiares_de_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Familiar).filter(Familiar.id_legajo == id, Familiar.activo == True).order_by(Familiar.id)
    return [_ser(x, _FAM) for x in q.all()]


@legajos_router.get("/{id}/ficha")
def ficha_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Ficha del agente: legajo + cargos + antigüedades + familiares."""
    _requiere(current_user, "rrhh_read")
    x = db.query(Legajo).filter(Legajo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    out = _ser(x, _LEG)
    out["cargos"] = [_ser(c, _CARGO) for c in
                     db.query(LegajoCargo).filter(LegajoCargo.id_legajo == id, LegajoCargo.activo == True).order_by(LegajoCargo.id).all()]
    out["antiguedades"] = [_ser(a, _ANTIG) for a in
                           db.query(Antiguedad).filter(Antiguedad.id_legajo == id, Antiguedad.activo == True).order_by(Antiguedad.id).all()]
    out["familiares"] = [_ser(f, _FAM) for f in
                         db.query(Familiar).filter(Familiar.id_legajo == id, Familiar.activo == True).order_by(Familiar.id).all()]
    return out


@legajos_router.post("", status_code=201)
def crear_legajo(data: LegajoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if data.estado not in ESTADOS_LEGAJO:
        raise HTTPException(status_code=400, detail=f"Estado inválido; use uno de {ESTADOS_LEGAJO}")
    num = data.numero_legajo.strip()
    if db.query(Legajo).filter(Legajo.numero_legajo == num).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el legajo {num}")
    payload = data.model_dump()
    payload["numero_legajo"] = num
    x = Legajo(**payload)
    db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _LEG)


@legajos_router.put("/{id}")
def editar_legajo(id: int, data: LegajoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if data.estado not in ESTADOS_LEGAJO:
        raise HTTPException(status_code=400, detail=f"Estado inválido; use uno de {ESTADOS_LEGAJO}")
    x = db.query(Legajo).filter(Legajo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    for k, v in data.model_dump().items():
        if k == "numero_legajo":
            v = v.strip()
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _LEG)


@legajos_router.delete("/{id}")
def borrar_legajo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Legajo).filter(Legajo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ LEGAJO-CARGOS ════════════════════════════════════════════════════
legajo_cargos_router = APIRouter(prefix="/legajo-cargos", tags=["Legajo · Cargos"])


class LegajoCargoIn(BaseModel):
    id_legajo: int
    id_categoria: Optional[int] = None
    id_tipo_cargo: Optional[int] = None
    id_cargo_funcion: Optional[int] = None
    id_oficina: Optional[int] = None
    fecha_ingreso_cargo: Optional[date] = None
    fecha_egreso_cargo: Optional[date] = None
    letra_nombramiento: Optional[str] = None
    anio_nombramiento: Optional[int] = None
    numero_nombramiento: Optional[str] = None
    fecha_nombramiento: Optional[date] = None
    expediente: Optional[str] = None
    id_partida: Optional[int] = None
    jurisdiccion: Optional[str] = None
    estructura: Optional[str] = None
    fuente: Optional[str] = None
    objeto_gasto: Optional[str] = None
    activo: bool = True


@legajo_cargos_router.get("")
def listar_cargos(request: Request, id_legajo: int = Query(None), skip: int = Query(0, ge=0),
                  limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(LegajoCargo).filter(LegajoCargo.activo == True)
    if id_legajo:
        q = q.filter(LegajoCargo.id_legajo == id_legajo)
    q = filtered_query(q, LegajoCargo, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo"}, default_sort="id")
    return [_ser(x, _CARGO) for x in q.offset(skip).limit(limit).all()]


@legajo_cargos_router.get("/{id}")
def obtener_cargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(LegajoCargo).filter(LegajoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo inexistente")
    return _ser(x, _CARGO)


@legajo_cargos_router.post("", status_code=201)
def crear_cargo(data: LegajoCargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = LegajoCargo(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _CARGO)


@legajo_cargos_router.put("/{id}")
def editar_cargo(id: int, data: LegajoCargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(LegajoCargo).filter(LegajoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _CARGO)


@legajo_cargos_router.delete("/{id}")
def borrar_cargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(LegajoCargo).filter(LegajoCargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cargo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ ANTIGÜEDADES ═════════════════════════════════════════════════════
antiguedades_router = APIRouter(prefix="/antiguedades", tags=["Antigüedades"])


class AntiguedadIn(BaseModel):
    id_legajo: int
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    lugar: Optional[str] = None
    id_tipo_antiguedad: Optional[int] = None
    activo: bool = True


@antiguedades_router.get("")
def listar_antig(request: Request, id_legajo: int = Query(None), skip: int = Query(0, ge=0),
                 limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Antiguedad).filter(Antiguedad.activo == True)
    if id_legajo:
        q = q.filter(Antiguedad.id_legajo == id_legajo)
    q = filtered_query(q, Antiguedad, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo"}, default_sort="id")
    return [_ser(x, _ANTIG) for x in q.offset(skip).limit(limit).all()]


@antiguedades_router.get("/{id}")
def obtener_antig(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Antiguedad).filter(Antiguedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Antigüedad inexistente")
    return _ser(x, _ANTIG)


@antiguedades_router.post("", status_code=201)
def crear_antig(data: AntiguedadIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = Antiguedad(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _ANTIG)


@antiguedades_router.put("/{id}")
def editar_antig(id: int, data: AntiguedadIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Antiguedad).filter(Antiguedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Antigüedad inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _ANTIG)


@antiguedades_router.delete("/{id}")
def borrar_antig(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Antiguedad).filter(Antiguedad.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Antigüedad inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ FAMILIARES ═══════════════════════════════════════════════════════
familiares_router = APIRouter(prefix="/familiares", tags=["Familiares"])


class FamiliarIn(BaseModel):
    id_legajo: int
    apellido_nombre: str
    documento: Optional[str] = None
    id_parentesco: Optional[int] = None
    a_cargo: bool = True
    deduce_ganancias: bool = False
    discapacitado: bool = False
    porcentaje_deduccion: Decimal = Decimal("0")
    activo: bool = True


@familiares_router.get("")
def listar_fam(request: Request, id_legajo: int = Query(None), skip: int = Query(0, ge=0),
               limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Familiar).filter(Familiar.activo == True)
    if id_legajo:
        q = q.filter(Familiar.id_legajo == id_legajo)
    q = filtered_query(q, Familiar, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo"}, default_sort="id")
    return [_ser(x, _FAM) for x in q.offset(skip).limit(limit).all()]


@familiares_router.get("/{id}")
def obtener_fam(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Familiar).filter(Familiar.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Familiar inexistente")
    return _ser(x, _FAM)


@familiares_router.post("", status_code=201)
def crear_fam(data: FamiliarIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = Familiar(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _FAM)


@familiares_router.put("/{id}")
def editar_fam(id: int, data: FamiliarIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Familiar).filter(Familiar.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Familiar inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _FAM)


@familiares_router.delete("/{id}")
def borrar_fam(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Familiar).filter(Familiar.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Familiar inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
