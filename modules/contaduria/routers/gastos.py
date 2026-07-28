import sys
import os
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.gasto import GastoExpediente, ESTADOS

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/gastos", tags=["Ciclo del Gasto"])

# etapa siguiente por estado y su tipo de afectación
SIGUIENTE = {
    "preventivado": ("comprometer", "compromiso", "contaduria_comprometer"),
    "comprometido": ("devengar", "devengado", "contaduria_devengar"),
    "devengado": ("pagar", "pagado", "contaduria_pagar"),
}


class GastoIn(BaseModel):
    anio: int
    descripcion: str
    proveedor: Optional[str] = None
    id_partida: int
    importe: Decimal
    observaciones: Optional[str] = None


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _presupuesto(metodo: str, path: str, token: str, json_body: dict = None):
    """Llama al módulo presupuesto reenviando el token del usuario. Propaga errores de negocio."""
    try:
        with httpx.Client(timeout=20) as client:
            resp = client.request(metodo, f"{settings.presupuesto_url}{path}",
                                  json=json_body, headers={"Authorization": token} if token else {})
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"No se pudo contactar a presupuesto: {e}")
    if resp.status_code >= 400:
        try:
            detalle = resp.json().get("detail", resp.text[:200])
        except Exception:
            detalle = resp.text[:200]
        raise HTTPException(status_code=resp.status_code if resp.status_code in (403, 404, 409) else 409,
                            detail=f"Presupuesto: {detalle}")
    return resp.json()


def _registrar(g: GastoExpediente, etapa: str, cu: dict, referencia: str = None,
               importe=None, id_afectacion=None):
    hist = list(g.historial or [])
    hist.append({
        "etapa": etapa, "usuario": _quien(cu),
        "fecha": datetime.now(timezone.utc).isoformat(),
        "referencia": referencia, "importe": float(importe) if importe is not None else None,
        "id_afectacion": id_afectacion,
    })
    g.historial = hist


def _serializar(g: GastoExpediente):
    return {
        "id": g.id, "anio": g.anio, "numero": g.numero,
        "expediente": f"GEX-{g.anio}-{g.numero:04d}",
        "descripcion": g.descripcion, "proveedor": g.proveedor,
        "id_partida": g.id_partida, "partida": g.partida_etiqueta,
        "importe": float(g.importe), "estado": g.estado,
        "oc_numero": g.oc_numero, "factura_numero": g.factura_numero, "op_numero": g.op_numero,
        "historial": g.historial or [], "observaciones": g.observaciones,
        "creado_por": g.creado_por, "created_at": g.created_at, "activo": g.activo,
    }


@router.get("")
def listar(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "contaduria_read")
    query = db.query(GastoExpediente).filter(GastoExpediente.activo == True)
    query = filtered_query(query, GastoExpediente, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_serializar(g) for g in query.offset(skip).limit(limit).all()]


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_read")
    g = db.query(GastoExpediente).filter(GastoExpediente.id == id, GastoExpediente.activo == True).first()
    if not g:
        raise HTTPException(status_code=404, detail=f"Expediente {id} no encontrado")
    return _serializar(g)


@router.post("", status_code=201)
def crear(data: GastoIn, request: Request, db: Session = Depends(get_db),
          current_user: dict = Depends(get_current_user)):
    """Crea el expediente y registra el PREVENTIVO en presupuesto (reserva el crédito)."""
    _requiere(current_user, "contaduria_write")
    if data.importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
    if not data.descripcion.strip():
        raise HTTPException(status_code=400, detail="La descripción es obligatoria")
    token = request.headers.get("authorization")

    ultimo = db.query(func.max(GastoExpediente.numero)).filter(GastoExpediente.anio == data.anio).scalar() or 0
    numero = ultimo + 1
    referencia = f"GEX-{data.anio}-{numero:04d}"

    # 1) reservar crédito en presupuesto (si falla, el expediente NO se crea)
    afect = _presupuesto("POST", "/afectaciones", token, {
        "tipo": "preventivo", "importe": float(data.importe), "id_partida": data.id_partida,
        "origen_modulo": "contaduria", "referencia_tipo": "gasto_expediente", "referencia": referencia,
        "observaciones": data.descripcion,
    })

    # etiqueta de la partida (para mostrar sin volver a consultar)
    etiqueta = None
    try:
        partidas = _presupuesto("GET", f"/partidas?anio={data.anio}&limit=200", token)
        p = next((x for x in partidas if x["id"] == data.id_partida), None)
        if p:
            etiqueta = f"{p['jurisdiccion']['codigo']} · {p['estructura']['codigo']} · {p['objeto_gasto']['codigo']} · {p['fuente']['codigo']}"
    except HTTPException:
        pass

    g = GastoExpediente(
        anio=data.anio, numero=numero, descripcion=data.descripcion.strip(),
        proveedor=data.proveedor, id_partida=data.id_partida, partida_etiqueta=etiqueta,
        importe=data.importe, estado="preventivado", id_afectacion_actual=afect["id"],
        observaciones=data.observaciones, creado_por=_quien(current_user))
    _registrar(g, "preventivo", current_user, referencia, data.importe, afect["id"])
    db.add(g); db.commit(); db.refresh(g)
    out = _serializar(g)
    if afect.get("advertencia"):
        out["advertencia"] = afect["advertencia"]
    return out


@router.post("/{id}/avanzar")
def avanzar(id: int, request: Request, data: dict = Body(default={}),
            db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Avanza el expediente a la etapa siguiente (comprometer → devengar → pagar),
    encadenando la afectación en presupuesto (la conversión evita el doble conteo)."""
    g = db.query(GastoExpediente).filter(GastoExpediente.id == id, GastoExpediente.activo == True).first()
    if not g:
        raise HTTPException(status_code=404, detail=f"Expediente {id} no encontrado")
    if g.estado not in SIGUIENTE:
        raise HTTPException(status_code=409, detail=f"El expediente está '{g.estado}': no tiene etapa siguiente")
    etapa, tipo_afectacion, permiso = SIGUIENTE[g.estado]
    _requiere(current_user, permiso)

    documento = (data.get("documento") or "").strip()
    if not documento:
        etiquetas = {"comprometer": "el número de orden de compra",
                     "devengar": "el número de factura", "pagar": "el número de orden de pago"}
        raise HTTPException(status_code=400, detail=f"Debe indicar {etiquetas[etapa]} (documento)")
    importe = Decimal(str(data.get("importe") or g.importe))
    if importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")

    token = request.headers.get("authorization")
    referencia = f"GEX-{g.anio}-{g.numero:04d}"
    afect = _presupuesto("POST", "/afectaciones", token, {
        "tipo": tipo_afectacion, "importe": float(importe), "id_partida": g.id_partida,
        "id_origen": g.id_afectacion_actual,
        "origen_modulo": "contaduria", "referencia_tipo": "gasto_expediente", "referencia": referencia,
        "observaciones": f"{g.descripcion} — {documento}",
    })

    g.id_afectacion_actual = afect["id"]
    g.importe = importe
    if etapa == "comprometer":
        g.estado, g.oc_numero = "comprometido", documento
    elif etapa == "devengar":
        g.estado, g.factura_numero = "devengado", documento
    else:
        g.estado, g.op_numero = "pagado", documento
    _registrar(g, tipo_afectacion, current_user, documento, importe, afect["id"])
    db.commit(); db.refresh(g)
    out = _serializar(g)
    for k in ("advertencia", "advertencias_cuota"):
        if afect.get(k):
            out[k] = afect[k]
    return out


@router.post("/{id}/anular")
def anular(id: int, request: Request, data: dict = Body(default={}),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Anula el expediente liberando la reserva de crédito en presupuesto (RN-11)."""
    _requiere(current_user, "contaduria_anular")
    g = db.query(GastoExpediente).filter(GastoExpediente.id == id, GastoExpediente.activo == True).first()
    if not g:
        raise HTTPException(status_code=404, detail=f"Expediente {id} no encontrado")
    if g.estado not in ("preventivado", "comprometido"):
        raise HTTPException(status_code=409, detail=f"Está '{g.estado}': solo se anula antes del devengado")
    token = request.headers.get("authorization")
    _presupuesto("POST", f"/afectaciones/{g.id_afectacion_actual}/liberar", token,
                 {"motivo": data.get("motivo") or f"Anulación GEX-{g.anio}-{g.numero:04d}"})
    g.estado = "anulado"
    _registrar(g, "anulacion", current_user, data.get("motivo"))
    db.commit()
    return _serializar(g)
