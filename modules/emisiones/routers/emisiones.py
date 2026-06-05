import sys
import os
from typing import List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.emision import Emision
from models.padron import Padron, ContribuyentePadron
from models.liquidacion import Liquidacion
from models.ordenamiento import Ordenamiento, OrdenamientoItem
from models.cuenta_corriente import CuentaCorriente
from models.paso_workflow import PasoWorkflow
from services.emision_service import EmisionService
from services.calculo_service import CalculoService
from services.ordenamiento_service import OrdenamientoService
from services.cuenta_corriente_service import CuentaCorrienteService
from schemas.emision import (
    EmisionCreate, EmisionUpdate, EmisionResponse,
    ParametrosCalculo, AprobacionRequest, EmisionListResponse,
)
from schemas.liquidacion import LiquidacionResponse
from schemas.padron import PadronResponse, ContribuyentePadronResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/emisiones", tags=["Emisiones"])


# --- CRUD ---

@router.post("", response_model=EmisionResponse, status_code=201)
def crear_emision(
    data: EmisionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    emision_data = data.model_dump()
    emision_data["id_usuario_creador"] = current_user.get("id")
    return service.add(emision_data)


@router.get("", response_model=List[EmisionResponse])
def list_emisiones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    estado: Optional[str] = Query(None),
    tipo_tributo: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Emision)
    if activo is not None:
        query = query.filter(Emision.activo == activo)
    if estado is not None:
        query = query.filter(Emision.estado == estado)
    if tipo_tributo is not None:
        query = query.filter(Emision.tipo_tributo == tipo_tributo)
    query = filtered_query(
        query, Emision, dict(request.query_params),
        exclude={"skip", "limit", "activo", "estado", "tipo_tributo"},
    )
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=EmisionResponse)
def get_emision(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.find_by_id(id)


@router.put("/{id}", response_model=EmisionResponse)
def update_emision(
    id: int,
    data: EmisionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_emision(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    service.remove(id)
    return {"message": f"Emision {id} eliminada"}


# --- Estado ---

@router.get("/{id}/estado")
def get_estado(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    emision = service.find_by_id(id)
    pasos = db.query(PasoWorkflow).filter(
        PasoWorkflow.id_emision == id,
        PasoWorkflow.activo == True,
    ).order_by(PasoWorkflow.numero_paso).all()
    return {
        "id": emision.id,
        "estado": emision.estado,
        "paso_actual": emision.paso_actual,
        "pasos": [
            {
                "numero_paso": p.numero_paso,
                "nombre_paso": p.nombre_paso,
                "estado": p.estado,
                "fecha_inicio": p.fecha_inicio,
                "fecha_fin": p.fecha_fin,
            }
            for p in pasos
        ],
    }


# --- Liquidaciones ---

@router.get("/{id}/liquidaciones", response_model=List[LiquidacionResponse])
def get_liquidaciones(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EmisionService(db)
    service.find_by_id(id)  # validate exists
    return (
        db.query(Liquidacion)
        .filter(Liquidacion.id_emision == id, Liquidacion.activo == True)
        .offset(skip).limit(limit).all()
    )


# --- 16 Workflow Steps ---

WORKFLOW_STEPS = {
    1: "validar_parametros",
    2: "cargar_padron",
    3: "validar_padron",
    4: "calcular_base_imponible",
    5: "aplicar_alicuotas",
    6: "calcular_bonificaciones",
    7: "calcular_recargos",
    8: "generar_liquidaciones",
    9: "validar_liquidaciones",
    10: "generar_ordenamiento",
    11: "generar_cuentas_corrientes",
    12: "generar_comprobantes",
    13: "imputacion_contable",
    14: "publicar_deuda",
    15: "solicitar_aprobacion",
    16: "aprobar_emision",
}


def _registrar_paso(db: Session, id_emision: int, numero_paso: int, estado: str,
                    resultado: str = None, error: str = None, id_usuario: int = None,
                    metadata_paso: dict = None):
    paso = PasoWorkflow(
        id_emision=id_emision,
        numero_paso=numero_paso,
        nombre_paso=WORKFLOW_STEPS.get(numero_paso, f"paso_{numero_paso}"),
        estado=estado,
        fecha_inicio=datetime.now(timezone.utc),
        fecha_fin=datetime.now(timezone.utc) if estado in ("completado", "error") else None,
        id_usuario=id_usuario,
        resultado=resultado,
        error=error,
        metadata_paso=metadata_paso,
    )
    db.add(paso)
    db.commit()
    return paso


def _validar_paso(db: Session, id_emision: int, paso_requerido: int):
    service = EmisionService(db)
    emision = service.find_by_id(id_emision)
    if emision.paso_actual < paso_requerido - 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Debe completar el paso {paso_requerido - 1} antes de ejecutar el paso {paso_requerido}",
        )
    return emision


# Step 1: Validar parametros
@router.post("/{id}/pasos/1-validar-parametros")
def paso_1_validar_parametros(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 1)
    try:
        errores = []
        if not emision.tipo_tributo:
            errores.append("tipo_tributo es requerido")
        if not emision.periodo:
            errores.append("periodo es requerido")
        if errores:
            _registrar_paso(db, id, 1, "error", error="; ".join(errores),
                            id_usuario=current_user.get("id"))
            raise HTTPException(status_code=400, detail={"errores": errores})

        emision.paso_actual = 1
        emision.estado = "en_proceso"
        db.commit()
        _registrar_paso(db, id, 1, "completado", resultado="Parametros validados",
                        id_usuario=current_user.get("id"))
        return {"paso": 1, "estado": "completado", "mensaje": "Parametros validados correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        _registrar_paso(db, id, 1, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 2: Cargar padron
@router.post("/{id}/pasos/2-cargar-padron")
def paso_2_cargar_padron(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 2)
    try:
        padron = Padron(
            id_emision=id,
            tipo_tributo=emision.tipo_tributo,
            nombre=f"Padron {emision.tipo_tributo} - {emision.periodo}",
            descripcion=f"Padron generado para emision {id}",
        )
        db.add(padron)
        db.commit()
        db.refresh(padron)

        emision.paso_actual = 2
        db.commit()
        _registrar_paso(db, id, 2, "completado", resultado=f"Padron {padron.id} creado",
                        id_usuario=current_user.get("id"))
        return {"paso": 2, "estado": "completado", "id_padron": padron.id}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 2, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 3: Validar padron
@router.post("/{id}/pasos/3-validar-padron")
def paso_3_validar_padron(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 3)
    try:
        padrones = db.query(Padron).filter(Padron.id_emision == id, Padron.activo == True).all()
        if not padrones:
            raise HTTPException(status_code=400, detail="No hay padrones cargados para esta emision")

        total_contribuyentes = 0
        for padron in padrones:
            count = db.query(ContribuyentePadron).filter(
                ContribuyentePadron.id_padron == padron.id,
                ContribuyentePadron.activo == True,
            ).count()
            padron.cantidad_registros = count
            total_contribuyentes += count
        db.commit()

        emision.cantidad_contribuyentes = total_contribuyentes
        emision.paso_actual = 3
        db.commit()
        _registrar_paso(db, id, 3, "completado",
                        resultado=f"Padron validado: {total_contribuyentes} contribuyentes",
                        id_usuario=current_user.get("id"))
        return {"paso": 3, "estado": "completado", "total_contribuyentes": total_contribuyentes}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 3, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 4: Calcular base imponible
@router.post("/{id}/pasos/4-calcular-base-imponible")
def paso_4_calcular_base_imponible(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 4)
    try:
        calculo_service = CalculoService(db)
        resultado = calculo_service.calcular_base_imponible(id)
        emision.paso_actual = 4
        db.commit()
        _registrar_paso(db, id, 4, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 4, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 4, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 5: Aplicar alicuotas
@router.post("/{id}/pasos/5-aplicar-alicuotas")
def paso_5_aplicar_alicuotas(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 5)
    try:
        calculo_service = CalculoService(db)
        resultado = calculo_service.aplicar_alicuotas(id)
        emision.paso_actual = 5
        db.commit()
        _registrar_paso(db, id, 5, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 5, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 5, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 6: Calcular bonificaciones
@router.post("/{id}/pasos/6-calcular-bonificaciones")
def paso_6_calcular_bonificaciones(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 6)
    try:
        calculo_service = CalculoService(db)
        resultado = calculo_service.calcular_bonificaciones(id)
        emision.paso_actual = 6
        db.commit()
        _registrar_paso(db, id, 6, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 6, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 6, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 7: Calcular recargos
@router.post("/{id}/pasos/7-calcular-recargos")
def paso_7_calcular_recargos(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 7)
    try:
        calculo_service = CalculoService(db)
        resultado = calculo_service.calcular_recargos(id)
        emision.paso_actual = 7
        db.commit()
        _registrar_paso(db, id, 7, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 7, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 7, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 8: Generar liquidaciones
@router.post("/{id}/pasos/8-generar-liquidaciones")
def paso_8_generar_liquidaciones(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 8)
    try:
        calculo_service = CalculoService(db)
        resultado = calculo_service.generar_liquidaciones(id)
        emision.paso_actual = 8
        db.commit()
        _registrar_paso(db, id, 8, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 8, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 8, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 9: Validar liquidaciones
@router.post("/{id}/pasos/9-validar-liquidaciones")
def paso_9_validar_liquidaciones(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 9)
    try:
        liquidaciones = db.query(Liquidacion).filter(
            Liquidacion.id_emision == id, Liquidacion.activo == True
        ).all()
        errores = []
        for liq in liquidaciones:
            if liq.monto_final is None or liq.monto_final <= 0:
                errores.append(f"Liquidacion {liq.id}: monto_final invalido")
        if errores:
            _registrar_paso(db, id, 9, "error", error="; ".join(errores),
                            id_usuario=current_user.get("id"))
            raise HTTPException(status_code=400, detail={"errores": errores})

        monto_total = sum(liq.monto_final or 0 for liq in liquidaciones)
        emision.monto_total = monto_total
        emision.paso_actual = 9
        db.commit()
        _registrar_paso(db, id, 9, "completado",
                        resultado=f"Liquidaciones validadas: {len(liquidaciones)}, monto_total: {monto_total}",
                        id_usuario=current_user.get("id"))
        return {"paso": 9, "estado": "completado", "total_liquidaciones": len(liquidaciones),
                "monto_total": float(monto_total)}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 9, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 10: Generar ordenamiento
@router.post("/{id}/pasos/10-generar-ordenamiento")
def paso_10_generar_ordenamiento(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 10)
    try:
        ordenamiento_service = OrdenamientoService(db)
        resultado = ordenamiento_service.generar_ordenamiento(id)
        emision.paso_actual = 10
        db.commit()
        _registrar_paso(db, id, 10, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 10, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 10, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 11: Generar cuentas corrientes
@router.post("/{id}/pasos/11-generar-cuentas-corrientes")
def paso_11_generar_cuentas_corrientes(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 11)
    try:
        cc_service = CuentaCorrienteService(db)
        resultado = cc_service.generar_cuentas_corrientes(id)
        emision.paso_actual = 11
        db.commit()
        _registrar_paso(db, id, 11, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 11, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 11, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 12: Generar comprobantes
@router.post("/{id}/pasos/12-generar-comprobantes")
def paso_12_generar_comprobantes(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 12)
    try:
        liquidaciones = db.query(Liquidacion).filter(
            Liquidacion.id_emision == id, Liquidacion.activo == True
        ).all()
        for i, liq in enumerate(liquidaciones, 1):
            liq.numero_comprobante = f"E{id:06d}-{i:06d}"
        db.commit()

        emision.paso_actual = 12
        db.commit()
        _registrar_paso(db, id, 12, "completado",
                        resultado=f"Comprobantes generados: {len(liquidaciones)}",
                        id_usuario=current_user.get("id"))
        return {"paso": 12, "estado": "completado", "comprobantes_generados": len(liquidaciones)}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 12, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 13: Imputacion contable
@router.post("/{id}/pasos/13-imputacion-contable")
def paso_13_imputacion_contable(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 13)
    try:
        emision.paso_actual = 13
        db.commit()
        _registrar_paso(db, id, 13, "completado",
                        resultado="Imputacion contable registrada",
                        id_usuario=current_user.get("id"),
                        metadata_paso={"tipo": "imputacion_contable", "id_emision": id})
        return {"paso": 13, "estado": "completado", "mensaje": "Imputacion contable registrada"}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 13, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 14: Publicar deuda
@router.post("/{id}/pasos/14-publicar-deuda")
def paso_14_publicar_deuda(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 14)
    try:
        cuentas = db.query(CuentaCorriente).filter(
            CuentaCorriente.id_emision == id, CuentaCorriente.activo == True
        ).all()
        for cuenta in cuentas:
            cuenta.estado = "publicada"
        db.commit()

        emision.paso_actual = 14
        db.commit()
        _registrar_paso(db, id, 14, "completado",
                        resultado=f"Deuda publicada: {len(cuentas)} cuentas",
                        id_usuario=current_user.get("id"))
        return {"paso": 14, "estado": "completado", "cuentas_publicadas": len(cuentas)}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 14, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 15: Solicitar aprobacion
@router.post("/{id}/pasos/15-solicitar-aprobacion")
def paso_15_solicitar_aprobacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 15)
    try:
        emision.estado = "pendiente_aprobacion"
        emision.paso_actual = 15
        db.commit()
        _registrar_paso(db, id, 15, "completado",
                        resultado="Aprobacion solicitada",
                        id_usuario=current_user.get("id"))
        return {"paso": 15, "estado": "completado", "mensaje": "Aprobacion solicitada"}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 15, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))


# Step 16: Aprobar emision
@router.post("/{id}/pasos/16-aprobar-emision")
def paso_16_aprobar_emision(
    id: int,
    data: AprobacionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 16)
    try:
        if data.aprobado:
            emision.estado = "aprobada"
            emision.id_usuario_aprobador = current_user.get("id")
            emision.fecha_aprobacion = datetime.now(timezone.utc)
            emision.observaciones_aprobacion = data.observaciones
            emision.fecha_emision = datetime.now(timezone.utc)
            emision.paso_actual = 16
            resultado = "Emision aprobada"
        else:
            emision.estado = "rechazada"
            emision.id_usuario_aprobador = current_user.get("id")
            emision.fecha_aprobacion = datetime.now(timezone.utc)
            emision.observaciones_aprobacion = data.observaciones
            resultado = "Emision rechazada"

        db.commit()
        _registrar_paso(db, id, 16, "completado", resultado=resultado,
                        id_usuario=current_user.get("id"),
                        metadata_paso={"aprobado": data.aprobado, "observaciones": data.observaciones})
        return {"paso": 16, "estado": "completado", "resultado": resultado}
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, 16, "error", error=str(e), id_usuario=current_user.get("id"))
        raise HTTPException(status_code=500, detail=str(e))
