import sys
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import StreamingResponse, PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel
import io

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.exportador_service import ExportadorService
from models.exportacion_lote import ExportacionLote

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/exportaciones", tags=["Exportaciones"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class ExportacionLoteCreate(BaseModel):
    tipo_exportacion: str = "generico"
    formato: str = "csv"          # csv | xlsx
    nombre_archivo: str
    origen_lote_id: Optional[int] = None


def _lote_dict(l: ExportacionLote):
    return {
        "id": l.id,
        "tipo_exportacion": l.tipo_exportacion,
        "id_tipo_exportacion": l.id_tipo_exportacion,
        "formato": l.formato,
        "origen_lote_id": l.origen_lote_id,
        "nombre_archivo": l.nombre_archivo,
        "id_estado_exportacion": l.id_estado_exportacion,
        "casos": l.casos,
        "id_usuario": l.id_usuario,
        "fecha_creacion": l.fecha_creacion,
    }


@router.get("/lotes")
def list_lotes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_read")
    service = ExportadorService(db)
    return [_lote_dict(l) for l in service.list_lotes(skip=skip, limit=limit)]


@router.get("/lotes/{id}")
def get_lote(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "importacion_read")
    service = ExportadorService(db)
    return _lote_dict(service.find_lote_by_id(id))


@router.post("/lotes", status_code=201)
def create_lote(
    data: ExportacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "importacion_write")
    if data.formato not in ("csv", "xlsx"):
        raise HTTPException(status_code=400, detail="formato debe ser csv o xlsx")
    service = ExportadorService(db)
    lote = ExportacionLote(
        id_tipo_exportacion=0,
        tipo_exportacion=data.tipo_exportacion,
        formato=data.formato,
        origen_lote_id=data.origen_lote_id,
        nombre_archivo=data.nombre_archivo,
        id_estado_exportacion=10,
        casos=0,
        id_usuario=current_user.get("id") or current_user.get("id_usuario"),
    )
    db.add(lote)
    db.flush()
    # calcula casos al crear (best-effort)
    try:
        _, filas = service.datos_para_exportar(lote)
        lote.casos = len(filas)
        lote.id_estado_exportacion = 20
    except HTTPException:
        raise
    except Exception:
        pass
    db.commit()
    db.refresh(lote)
    return _lote_dict(lote)


@router.get("/lotes/{id}/descargar")
def descargar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Genera el archivo real (CSV/XLSX) del lote y lo devuelve como descarga."""
    _requiere(current_user, "importacion_read")
    service = ExportadorService(db)
    lote = service.find_lote_by_id(id)
    headers, filas = service.datos_para_exportar(lote)
    nombre = lote.nombre_archivo or f"export_{id}"
    if lote.formato == "xlsx":
        contenido = service.generar_xlsx(headers, filas)
        if not nombre.lower().endswith(".xlsx"):
            nombre += ".xlsx"
        return StreamingResponse(
            io.BytesIO(contenido),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f'attachment; filename="{nombre}"'},
        )
    contenido = service.generar_csv(headers, filas)
    if not nombre.lower().endswith(".csv"):
        nombre += ".csv"
    return PlainTextResponse(
        contenido,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{nombre}"'},
    )
