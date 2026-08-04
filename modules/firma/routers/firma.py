import sys
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.firma import DocumentoFirmable, Firma
from schemas.firma import (
    DocumentoCreate, FirmarRequest, DocumentoFirmableResponse, FirmaResponse,
)
from services import firma_service

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _doc_usuario(cu):
    return cu.get("numero_documento") or cu.get("codigo")


def _id_usuario(cu):
    return cu.get("id") or cu.get("id_usuario") or 0


def _firmas_de(db: Session, id_documento: int):
    return (db.query(Firma)
            .filter(Firma.id_documento == id_documento)
            .order_by(Firma.orden_firma)
            .all())


def _serializar(db: Session, doc: DocumentoFirmable) -> dict:
    out = DocumentoFirmableResponse.model_validate(doc).model_dump()
    firmas = _firmas_de(db, doc.id)
    out["firmas"] = [FirmaResponse.model_validate(f).model_dump() for f in firmas]
    out["firmas_puestas"] = len(firmas)
    out["firmas_faltantes"] = max(doc.cantidad_firmas - len(firmas), 0)
    return out


router = APIRouter(prefix="", tags=["Firma digital"])


@router.post("/documentos", status_code=201)
def registrar_documento(data: DocumentoCreate, db: Session = Depends(get_db),
                        current_user: dict = Depends(get_current_user)):
    """Registra un documento para firmar. Idempotente por (origen_modulo, origen_ref):
    si ya existe, lo devuelve tal cual (200 semántico)."""
    _requiere(current_user, "firma_write")
    existente = (db.query(DocumentoFirmable)
                 .filter(DocumentoFirmable.origen_modulo == data.origen_modulo,
                         DocumentoFirmable.origen_ref == data.origen_ref)
                 .first())
    if existente:
        return _serializar(db, existente)
    if data.cantidad_firmas < 1:
        raise HTTPException(status_code=400, detail="cantidad_firmas debe ser >= 1")
    doc = DocumentoFirmable(
        origen_modulo=data.origen_modulo.strip(),
        origen_tipo=data.origen_tipo.strip(),
        origen_ref=data.origen_ref.strip(),
        titulo=data.titulo,
        descripcion=data.descripcion,
        archivo_nombre=data.archivo_nombre,
        contenido_hash=data.contenido_hash,
        cantidad_firmas=data.cantidad_firmas,
        id_oficina=data.id_oficina,
        id_usuario_creador=_id_usuario(current_user),
        estado="pendiente",
        created_at=datetime.now(timezone.utc),
        activo=True,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return _serializar(db, doc)


@router.get("/documentos")
def listar_documentos(estado: Optional[str] = Query(None),
                      origen_modulo: Optional[str] = Query(None),
                      origen_tipo: Optional[str] = Query(None),
                      skip: int = Query(0, ge=0),
                      limit: int = Query(50, ge=1, le=100),
                      db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "firma_read")
    q = db.query(DocumentoFirmable).filter(DocumentoFirmable.activo == True)
    if estado:
        q = q.filter(DocumentoFirmable.estado == estado)
    if origen_modulo:
        q = q.filter(DocumentoFirmable.origen_modulo == origen_modulo)
    if origen_tipo:
        q = q.filter(DocumentoFirmable.origen_tipo == origen_tipo)
    q = q.order_by(DocumentoFirmable.id.desc())
    return [_serializar(db, d) for d in q.offset(skip).limit(limit).all()]


@router.get("/bandeja")
def bandeja(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
            db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    """Documentos pendientes de la firma del usuario ACTUAL: estado 'pendiente', activos,
    que el usuario todavía NO firmó."""
    _requiere(current_user, "firma_read")
    uid = _id_usuario(current_user)
    ya_firmados = (db.query(Firma.id_documento)
                   .filter(Firma.id_usuario == uid)
                   .subquery())
    q = (db.query(DocumentoFirmable)
         .filter(DocumentoFirmable.activo == True,
                 DocumentoFirmable.estado == "pendiente",
                 ~DocumentoFirmable.id.in_(ya_firmados))
         .order_by(DocumentoFirmable.id.desc()))
    return [_serializar(db, d) for d in q.offset(skip).limit(limit).all()]


@router.get("/documentos/{id}")
def obtener_documento(id: int, db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "firma_read")
    doc = (db.query(DocumentoFirmable)
           .filter(DocumentoFirmable.id == id, DocumentoFirmable.activo == True)
           .first())
    if not doc:
        raise HTTPException(status_code=404, detail="Documento inexistente")
    return _serializar(db, doc)


@router.post("/documentos/{id}/firmar")
def firmar(id: int, data: FirmarRequest = Body(default=FirmarRequest()), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    """Agrega la firma del usuario actual. Firma múltiple y secuencial: orden_firma =
    (firmas existentes) + 1. Si se completan las firmas requeridas, el documento pasa a 'firmado'."""
    _requiere(current_user, "firma_firmar")
    doc = (db.query(DocumentoFirmable)
           .filter(DocumentoFirmable.id == id, DocumentoFirmable.activo == True)
           .first())
    if not doc:
        raise HTTPException(status_code=404, detail="Documento inexistente")
    if doc.estado != "pendiente":
        raise HTTPException(status_code=400, detail=f"El documento no está pendiente (estado={doc.estado})")

    uid = _id_usuario(current_user)
    firmas = _firmas_de(db, doc.id)
    if any(f.id_usuario == uid for f in firmas):
        raise HTTPException(status_code=400, detail="El usuario ya firmó este documento")

    orden = len(firmas) + 1
    ahora = datetime.now(timezone.utc)
    hash_firma = firma_service.firmar_documento(doc, uid, orden, ahora)

    firma = Firma(
        id_documento=doc.id,
        orden_firma=orden,
        id_usuario=uid,
        firmante_nombre=_quien(current_user),
        firmante_documento=_doc_usuario(current_user),
        computadora=data.computadora,
        fecha_hora=ahora,
        hash_firma=hash_firma,
        estado="valida",
        created_at=ahora,
    )
    db.add(firma)
    db.flush()

    if orden >= doc.cantidad_firmas:
        doc.estado = "firmado"
    db.commit()
    db.refresh(doc)
    return _serializar(db, doc)


@router.post("/documentos/{id}/anular")
def anular(id: int, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "firma_admin")
    doc = (db.query(DocumentoFirmable)
           .filter(DocumentoFirmable.id == id, DocumentoFirmable.activo == True)
           .first())
    if not doc:
        raise HTTPException(status_code=404, detail="Documento inexistente")
    doc.estado = "anulado"
    db.commit()
    db.refresh(doc)
    return _serializar(db, doc)


@router.get("/documentos/{id}/verificar")
def verificar(id: int, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    """Recomputa y compara el sello HMAC de cada firma; el documento es válido si todas lo son."""
    _requiere(current_user, "firma_read")
    doc = (db.query(DocumentoFirmable)
           .filter(DocumentoFirmable.id == id, DocumentoFirmable.activo == True)
           .first())
    if not doc:
        raise HTTPException(status_code=404, detail="Documento inexistente")
    firmas = _firmas_de(db, doc.id)
    detalle = []
    todas_ok = True
    for f in firmas:
        ok = firma_service.verificar_firma(doc, f)
        todas_ok = todas_ok and ok
        detalle.append({"orden": f.orden_firma, "firmante": f.firmante_nombre, "valido": ok})
    return {"valido": bool(firmas) and todas_ok, "firmas": detalle, "estado": doc.estado}
