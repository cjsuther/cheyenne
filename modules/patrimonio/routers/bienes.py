import sys
import os
from decimal import Decimal
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.patrimonio import Bien, MovimientoBien, TIPOS_BIEN, ORIGENES

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _dec(v):
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


def postear_contab(tipo, origen_ref, importe, concepto, contexto, token):
    """POST best-effort a Contabilidad del hecho económico. El contable arma el asiento."""
    import httpx
    try:
        if not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as c:
            c.post(f"{settings.contabilidad_url}/transacciones",
                   json={"origen_modulo": "patrimonio", "origen_ref": str(origen_ref), "tipo": tipo,
                         "fecha": None, "importe": float(importe), "concepto": concepto, "contexto": contexto or {}},
                   headers={"Authorization": token} if token else {})
    except Exception:
        pass


def _valor_neto(b: Bien):
    return _dec(b.valor_origen) - _dec(b.amortizacion_acumulada)


def _ser_bien(b: Bien, con_movs=False, db=None):
    out = {
        "id": b.id, "codigo": b.codigo, "denominacion": b.denominacion, "tipo": b.tipo,
        "dependencia": b.dependencia, "responsable": b.responsable, "origen": b.origen,
        "id_orden_compra": b.id_orden_compra, "fecha_alta": b.fecha_alta,
        "valor_origen": float(b.valor_origen), "valor_residual": float(b.valor_residual),
        "vida_util_meses": b.vida_util_meses, "amortizacion_acumulada": float(b.amortizacion_acumulada),
        "valor_neto": float(_valor_neto(b)), "estado": b.estado, "activo": b.activo,
    }
    if con_movs and db is not None:
        movs = db.query(MovimientoBien).filter(MovimientoBien.id_bien == b.id).order_by(MovimientoBien.id).all()
        out["movimientos"] = [{
            "id": m.id, "tipo": m.tipo, "fecha": m.fecha, "periodo": m.periodo,
            "importe": float(m.importe) if m.importe is not None else None,
            "dependencia_origen": m.dependencia_origen, "dependencia_destino": m.dependencia_destino,
            "detalle": m.detalle, "usuario": m.usuario_nombre,
        } for m in movs]
    return out


bienes_router = APIRouter(prefix="/bienes", tags=["Bienes de uso"])


class BienIn(BaseModel):
    codigo: str
    denominacion: str
    tipo: str = "mueble"
    dependencia: Optional[str] = None
    responsable: Optional[str] = None
    origen: str = "compra"
    id_orden_compra: Optional[int] = None
    fecha_alta: Optional[date] = None
    valor_origen: Decimal = Decimal("0")
    valor_residual: Decimal = Decimal("0")
    vida_util_meses: int = 0


@bienes_router.get("")
def listar(request: Request, tipo: str = Query(None), estado: str = Query(None), dependencia: str = Query(None),
           skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "patrimonio_read")
    q = db.query(Bien).filter(Bien.activo == True)
    if tipo:
        q = q.filter(Bien.tipo == tipo)
    if estado:
        q = q.filter(Bien.estado == estado)
    if dependencia:
        q = q.filter(Bien.dependencia == dependencia)
    q = filtered_query(q, Bien, dict(request.query_params),
                       exclude={"skip", "limit", "tipo", "estado", "dependencia"}, default_sort="codigo")
    return [_ser_bien(b) for b in q.offset(skip).limit(limit).all()]


@bienes_router.get("/inventario")
def inventario(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Resumen del inventario: cantidad y valores por tipo y por dependencia."""
    _requiere(current_user, "patrimonio_read")
    bienes = db.query(Bien).filter(Bien.activo == True, Bien.estado == "alta").all()
    total_origen = sum((_dec(b.valor_origen) for b in bienes), CERO)
    total_neto = sum((_valor_neto(b) for b in bienes), CERO)
    por_tipo, por_dep = {}, {}
    for b in bienes:
        por_tipo.setdefault(b.tipo, {"tipo": b.tipo, "cantidad": 0, "valor_neto": 0.0})
        por_tipo[b.tipo]["cantidad"] += 1
        por_tipo[b.tipo]["valor_neto"] += float(_valor_neto(b))
        d = b.dependencia or "(sin asignar)"
        por_dep.setdefault(d, {"dependencia": d, "cantidad": 0, "valor_neto": 0.0})
        por_dep[d]["cantidad"] += 1
        por_dep[d]["valor_neto"] += float(_valor_neto(b))
    return {"cantidad": len(bienes), "valor_origen": float(total_origen), "valor_neto": float(total_neto),
            "por_tipo": list(por_tipo.values()), "por_dependencia": list(por_dep.values())}


@bienes_router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "patrimonio_read")
    b = db.query(Bien).filter(Bien.id == id, Bien.activo == True).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bien inexistente")
    return _ser_bien(b, con_movs=True, db=db)


@bienes_router.post("", status_code=201)
def alta(data: BienIn, request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Alta patrimonial de un bien. Genera el asiento (Bienes de uso a Patrimonio)."""
    _requiere(current_user, "patrimonio_write")
    if db.query(Bien).filter(Bien.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el bien {data.codigo}")
    if data.tipo not in TIPOS_BIEN:
        raise HTTPException(status_code=400, detail=f"Tipo inválido; use uno de {TIPOS_BIEN}")
    b = Bien(codigo=data.codigo.strip(), denominacion=data.denominacion, tipo=data.tipo,
             dependencia=data.dependencia, responsable=data.responsable, origen=data.origen,
             id_orden_compra=data.id_orden_compra, fecha_alta=data.fecha_alta or date.today(),
             valor_origen=data.valor_origen, valor_residual=data.valor_residual,
             vida_util_meses=data.vida_util_meses, creado_por=_quien(current_user))
    db.add(b); db.flush()
    db.add(MovimientoBien(id_bien=b.id, tipo="alta", detalle=f"Alta patrimonial ({b.origen})",
                          importe=b.valor_origen, dependencia_destino=b.dependencia,
                          usuario_nombre=_quien(current_user)))
    db.commit(); db.refresh(b)
    postear_contab("patrimonio.alta", f"alta-{b.id}", b.valor_origen,
                   f"Alta patrimonial {b.codigo} — {b.denominacion}",
                   {"tipo": b.tipo, "dependencia": b.dependencia}, request.headers.get("authorization"))
    return _ser_bien(b)


@bienes_router.put("/{id}")
def editar(id: int, data: BienIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "patrimonio_write")
    b = db.query(Bien).filter(Bien.id == id, Bien.activo == True).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bien inexistente")
    if b.estado != "alta":
        raise HTTPException(status_code=409, detail="Solo se edita un bien en estado 'alta'")
    for k in ("denominacion", "tipo", "dependencia", "responsable", "vida_util_meses", "valor_residual"):
        setattr(b, k, getattr(data, k))
    db.commit()
    return _ser_bien(b)


@bienes_router.post("/{id}/pase")
def pase(id: int, data: dict = Body(...), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Pase del bien a otra dependencia/responsable."""
    _requiere(current_user, "patrimonio_write")
    b = db.query(Bien).filter(Bien.id == id, Bien.activo == True).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bien inexistente")
    destino = (data.get("dependencia_destino") or "").strip()
    if not destino:
        raise HTTPException(status_code=400, detail="Indique la dependencia destino")
    origen = b.dependencia
    b.dependencia = destino
    if data.get("responsable"):
        b.responsable = data["responsable"]
    db.add(MovimientoBien(id_bien=b.id, tipo="pase", dependencia_origen=origen, dependencia_destino=destino,
                          detalle=data.get("motivo"), usuario_nombre=_quien(current_user)))
    db.commit()
    return _ser_bien(b, con_movs=True, db=db)


@bienes_router.post("/{id}/baja")
def baja(id: int, request: Request, data: dict = Body(default={}), db: Session = Depends(get_db),
         current_user: dict = Depends(get_current_user)):
    """Baja patrimonial del bien por su valor neto. Genera el asiento de baja."""
    _requiere(current_user, "patrimonio_baja")
    b = db.query(Bien).filter(Bien.id == id, Bien.activo == True).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bien inexistente")
    if b.estado == "baja":
        raise HTTPException(status_code=409, detail="El bien ya está dado de baja")
    neto = _valor_neto(b)
    b.estado = "baja"
    db.add(MovimientoBien(id_bien=b.id, tipo="baja", importe=neto,
                          detalle=data.get("motivo") or "Baja patrimonial", usuario_nombre=_quien(current_user)))
    db.commit(); db.refresh(b)
    postear_contab("patrimonio.baja", f"baja-{b.id}", neto,
                   f"Baja patrimonial {b.codigo}", {"tipo": b.tipo}, request.headers.get("authorization"))
    return _ser_bien(b, con_movs=True, db=db)


@bienes_router.post("/alta-desde-oc", status_code=201)
def alta_desde_oc(request: Request, data: dict = Body(...), db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    """Da de alta bienes a partir de los ítems de una Orden de Compra (consulta Compras por HTTP).
    Un bien por unidad recibida de cada artículo. Idempotente por (id_orden_compra)."""
    _requiere(current_user, "patrimonio_write")
    id_oc = data.get("id_orden_compra")
    if not id_oc:
        raise HTTPException(status_code=400, detail="id_orden_compra es obligatorio")
    if db.query(Bien).filter(Bien.id_orden_compra == id_oc).first():
        raise HTTPException(status_code=409, detail="Esa OC ya generó altas patrimoniales")
    import httpx
    token = request.headers.get("authorization")
    try:
        with httpx.Client(timeout=8) as c:
            r = c.get(f"{settings.compras_url}/ordenes-compra/{id_oc}",
                      headers={"Authorization": token} if token else {})
        if r.status_code >= 400:
            raise HTTPException(status_code=400, detail=f"Compras no devolvió la OC: HTTP {r.status_code}")
        oc = r.json()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"No se pudo contactar a Compras: {e}")

    vida = int(data.get("vida_util_meses") or 60)
    dependencia = data.get("dependencia")
    creados = []
    for it in oc.get("items", []):
        art = it.get("articulo") or {}
        cant = int(float(it.get("cantidad") or 0))
        precio = _dec(it.get("precio"))
        for n in range(cant):
            codigo = f"OC{id_oc}-{art.get('codigo', 'art')}-{n + 1}"
            if db.query(Bien).filter(Bien.codigo == codigo).first():
                continue
            b = Bien(codigo=codigo, denominacion=art.get("nombre") or "Bien", tipo="mueble",
                     dependencia=dependencia, origen="compra", id_orden_compra=id_oc,
                     fecha_alta=date.today(), valor_origen=precio, vida_util_meses=vida,
                     creado_por=_quien(current_user))
            db.add(b); db.flush()
            db.add(MovimientoBien(id_bien=b.id, tipo="alta", importe=precio,
                                  detalle=f"Alta desde OC {oc.get('orden_compra', id_oc)}",
                                  dependencia_destino=dependencia, usuario_nombre=_quien(current_user)))
            creados.append(b)
    db.commit()
    total = sum((_dec(b.valor_origen) for b in creados), CERO)
    if total > 0:
        postear_contab("patrimonio.alta", f"alta-oc-{id_oc}", total,
                       f"Altas patrimoniales desde OC {oc.get('orden_compra', id_oc)}",
                       {"id_orden_compra": id_oc, "cantidad": len(creados)}, token)
    return {"altas": len(creados), "valor_total": float(total),
            "bienes": [_ser_bien(b) for b in creados]}
