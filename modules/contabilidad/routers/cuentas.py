import sys
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import filtered_query

from database import get_db
from models.contabilidad import PlanCuenta, AsientoItem, TIPOS_CUENTA
from ._common import get_current_user, _requiere, _ser_cuenta

cuentas_router = APIRouter(prefix="/cuentas", tags=["Plan de cuentas"])


class CuentaIn(BaseModel):
    codigo: str
    nombre: str
    tipo: str
    imputable: bool = True
    id_padre: Optional[int] = None
    nivel: int = 1
    activo: bool = True


@cuentas_router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    q = filtered_query(db.query(PlanCuenta), PlanCuenta, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_ser_cuenta(x) for x in q.offset(skip).limit(limit).all()]


@cuentas_router.get("/arbol")
def arbol(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    cuentas = db.query(PlanCuenta).filter(PlanCuenta.activo == True).order_by(PlanCuenta.codigo).all()
    nodos = {c.id: {**_ser_cuenta(c), "hijos": []} for c in cuentas}
    raiz = []
    for c in cuentas:
        n = nodos[c.id]
        if c.id_padre and c.id_padre in nodos:
            nodos[c.id_padre]["hijos"].append(n)
        else:
            raiz.append(n)
    return raiz


@cuentas_router.post("", status_code=201)
def crear(data: CuentaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_write")
    if data.tipo not in TIPOS_CUENTA:
        raise HTTPException(status_code=400, detail=f"Tipo inválido. Debe ser uno de {TIPOS_CUENTA}")
    if db.query(PlanCuenta).filter(PlanCuenta.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe la cuenta {data.codigo}")
    if data.id_padre and not db.query(PlanCuenta).filter(PlanCuenta.id == data.id_padre).first():
        raise HTTPException(status_code=400, detail="Cuenta padre inexistente")
    x = PlanCuenta(codigo=data.codigo.strip(), nombre=data.nombre, tipo=data.tipo,
                   imputable=data.imputable, id_padre=data.id_padre, nivel=data.nivel, activo=data.activo)
    db.add(x); db.commit(); db.refresh(x)
    return _ser_cuenta(x)


@cuentas_router.put("/{id}")
def editar(id: int, data: CuentaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_write")
    if data.tipo not in TIPOS_CUENTA:
        raise HTTPException(status_code=400, detail=f"Tipo inválido. Debe ser uno de {TIPOS_CUENTA}")
    x = db.query(PlanCuenta).filter(PlanCuenta.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cuenta inexistente")
    otra = db.query(PlanCuenta).filter(PlanCuenta.codigo == data.codigo.strip(), PlanCuenta.id != id).first()
    if otra:
        raise HTTPException(status_code=409, detail=f"Ya existe otra cuenta con el código {data.codigo}")
    x.codigo = data.codigo.strip(); x.nombre = data.nombre; x.tipo = data.tipo
    x.imputable = data.imputable; x.id_padre = data.id_padre; x.nivel = data.nivel; x.activo = data.activo
    db.commit()
    return _ser_cuenta(x)


@cuentas_router.delete("/{id}")
def baja(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_write")
    x = db.query(PlanCuenta).filter(PlanCuenta.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Cuenta inexistente")
    if db.query(PlanCuenta).filter(PlanCuenta.id_padre == id, PlanCuenta.activo == True).first():
        raise HTTPException(status_code=409, detail="La cuenta tiene subcuentas activas")
    if db.query(AsientoItem).filter(AsientoItem.id_cuenta == id).first():
        raise HTTPException(status_code=409, detail="La cuenta tiene movimientos; no se puede dar de baja")
    x.activo = False; db.commit()
    return {"message": "dada de baja"}
