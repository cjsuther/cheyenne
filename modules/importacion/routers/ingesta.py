import sys
import os
import io
import csv
import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.importacion_lote import ImportacionLote
from models.importacion_detalle import ImportacionDetalle
from services import archivo_parser
from services import validadores

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/ingesta", tags=["Ingesta"])

# Estados de lote / detalle
ESTADO_PENDIENTE = 10
ESTADO_PROCESADO = 20
ESTADO_CON_ERROR = 30

DET_PENDIENTE = 10
DET_OK = 20
DET_ERROR = 30

MAX_FILAS = 50000


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _lote_dict(l: ImportacionLote):
    return {
        "id": l.id,
        "tipo_importacion": l.tipo_importacion,
        "id_tipo_importacion": l.id_tipo_importacion,
        "nombre_archivo": l.nombre_archivo,
        "id_estado_importacion": l.id_estado_importacion,
        "casos_total": l.casos_total,
        "casos_procesados": l.casos_procesados,
        "casos_error": l.casos_error,
        "id_usuario": l.id_usuario,
        "fecha_inicio": l.fecha_inicio,
        "fecha_fin": l.fecha_fin,
        "detalle_error": l.detalle_error,
        "mapeo": json.loads(l.mapeo) if l.mapeo else None,
    }


def _det_dict(d: ImportacionDetalle):
    try:
        datos = json.loads(d.datos_originales)
    except Exception:
        datos = d.datos_originales
    return {
        "id": d.id,
        "id_importacion_lote": d.id_importacion_lote,
        "numero_linea": d.numero_linea,
        "datos_originales": datos,
        "id_estado_detalle": d.id_estado_detalle,
        "detalle_error": d.detalle_error,
        "fecha_proceso": d.fecha_proceso,
    }


def _aplicar_mapeo(fila: dict, mapeo: Optional[dict]) -> dict:
    """mapeo = {columna_archivo: campo_destino}. Devuelve fila con campos destino."""
    if not mapeo:
        return fila
    out = dict(fila)  # conserva originales por si el validador los busca
    for col_archivo, campo_destino in mapeo.items():
        if campo_destino:
            out[campo_destino] = fila.get(col_archivo, "")
    return out


# ── PREVIEW ──────────────────────────────────────────────────────────
@router.post("/preview")
async def preview(
    archivo: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_read")
    contenido = await archivo.read()
    if not contenido:
        raise HTTPException(status_code=400, detail="Archivo vacio")
    try:
        headers, registros = archivo_parser.parse(archivo.filename, contenido)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"No se pudo parsear el archivo: {e}")
    if not headers:
        raise HTTPException(status_code=422, detail="El archivo no tiene encabezados")
    return {
        "nombre_archivo": archivo.filename,
        "headers": headers,
        "total_filas": len(registros),
        "filas": registros[:10],
        "tipos_disponibles": validadores.TIPOS_VALIDOS,
    }


# ── SUBIR (ingesta real) ─────────────────────────────────────────────
@router.post("/subir", status_code=201)
async def subir(
    archivo: UploadFile = File(...),
    tipo_importacion: str = Form("generico"),
    mapeo: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_write")
    contenido = await archivo.read()
    if not contenido:
        raise HTTPException(status_code=400, detail="Archivo vacio")
    if tipo_importacion not in validadores.TIPOS_VALIDOS:
        raise HTTPException(status_code=400, detail=f"tipo_importacion invalido. Validos: {validadores.TIPOS_VALIDOS}")
    mapeo_dict = None
    if mapeo:
        try:
            mapeo_dict = json.loads(mapeo)
            if not isinstance(mapeo_dict, dict):
                raise ValueError
        except Exception:
            raise HTTPException(status_code=400, detail="mapeo debe ser un JSON {columna_archivo: campo_destino}")

    try:
        headers, registros = archivo_parser.parse(archivo.filename, contenido)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"No se pudo parsear el archivo: {e}")
    if not registros:
        raise HTTPException(status_code=422, detail="El archivo no contiene filas de datos")
    if len(registros) > MAX_FILAS:
        raise HTTPException(status_code=413, detail=f"El archivo supera el maximo de {MAX_FILAS} filas")

    lote = ImportacionLote(
        id_tipo_importacion=0,
        tipo_importacion=tipo_importacion,
        nombre_archivo=archivo.filename or "archivo",
        path_archivo=None,
        mapeo=json.dumps(mapeo_dict) if mapeo_dict else None,
        id_estado_importacion=ESTADO_PENDIENTE,
        casos_total=len(registros),
        casos_procesados=0,
        casos_error=0,
        id_usuario=current_user.get("id") or current_user.get("id_usuario"),
    )
    db.add(lote)
    db.flush()

    for i, reg in enumerate(registros, start=1):
        db.add(ImportacionDetalle(
            id_importacion_lote=lote.id,
            numero_linea=i,
            datos_originales=json.dumps(reg, ensure_ascii=False),
            id_estado_detalle=DET_PENDIENTE,
        ))
    db.commit()
    db.refresh(lote)
    return _lote_dict(lote)


# ── PROCESAR (validacion por fila) ───────────────────────────────────
@router.post("/{id_lote}/procesar")
def procesar(
    id_lote: int,
    payload: Optional[dict] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_procesar")
    lote = db.query(ImportacionLote).filter(ImportacionLote.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail=f"Lote {id_lote} no encontrado")

    payload = payload or {}
    tipo = payload.get("tipo_importacion") or lote.tipo_importacion or "generico"
    if tipo not in validadores.TIPOS_VALIDOS:
        raise HTTPException(status_code=400, detail=f"tipo_importacion invalido. Validos: {validadores.TIPOS_VALIDOS}")

    # mapeo: prioriza el enviado al procesar, si no el guardado en el lote
    mapeo_dict = payload.get("mapeo")
    if mapeo_dict is None and lote.mapeo:
        mapeo_dict = json.loads(lote.mapeo)
    if mapeo_dict is not None and not isinstance(mapeo_dict, dict):
        raise HTTPException(status_code=400, detail="mapeo debe ser {columna_archivo: campo_destino}")

    detalles = db.query(ImportacionDetalle).filter(
        ImportacionDetalle.id_importacion_lote == id_lote
    ).order_by(ImportacionDetalle.numero_linea).all()

    procesados = 0
    con_error = 0
    ahora = datetime.now(timezone.utc)
    for det in detalles:
        try:
            fila = json.loads(det.datos_originales)
            if not isinstance(fila, dict):
                fila = {"valor": fila}
            fila_dest = _aplicar_mapeo(fila, mapeo_dict)
            err = validadores.validar(tipo, fila_dest)
        except Exception as e:
            err = f"Error inesperado en fila: {e}"
        det.fecha_proceso = ahora
        if err:
            det.id_estado_detalle = DET_ERROR
            det.detalle_error = str(err)[:1000]
            con_error += 1
        else:
            det.id_estado_detalle = DET_OK
            det.detalle_error = None
        procesados += 1

    lote.tipo_importacion = tipo
    if mapeo_dict is not None:
        lote.mapeo = json.dumps(mapeo_dict)
    lote.casos_procesados = procesados
    lote.casos_error = con_error
    lote.id_estado_importacion = ESTADO_CON_ERROR if con_error else ESTADO_PROCESADO
    lote.fecha_fin = ahora
    lote.detalle_error = f"{con_error} fila(s) con error de {procesados}" if con_error else None
    db.commit()
    db.refresh(lote)
    return _lote_dict(lote)


# ── DETALLES del lote (con filtro por estado) ────────────────────────
@router.get("/{id_lote}/detalles")
def listar_detalles(
    id_lote: int,
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    solo_errores: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_read")
    q = db.query(ImportacionDetalle).filter(ImportacionDetalle.id_importacion_lote == id_lote)
    if solo_errores:
        q = q.filter(ImportacionDetalle.id_estado_detalle == DET_ERROR)
    q = q.order_by(ImportacionDetalle.numero_linea)
    return [_det_dict(d) for d in q.offset(skip).limit(limit).all()]


# ── LOTES (listado propio de ingesta) ────────────────────────────────
@router.get("/lotes")
def listar_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_read")
    q = filtered_query(db.query(ImportacionLote), ImportacionLote, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_lote_dict(l) for l in q.offset(skip).limit(limit).all()]
