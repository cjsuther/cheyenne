import sys
import os
from typing import List, Optional
from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
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
from models.comprobante import Comprobante
from models.vencimiento_comprobante import VencimientoComprobante
from models.pago_recibo import PagoRecibo
from models.paso_workflow import PasoWorkflow
from services.emision_service import EmisionService
from services.calculo_service import CalculoService
from services.padron_loader import fetch_padron, items_a_contribuyentes
from services.ordenamiento_service import OrdenamientoService
from services.cuenta_corriente_service import CuentaCorrienteService
from services.comprobante_service import ComprobanteService
from services.pasos_workflow import PASOS, PASOS_POR_NUMERO, TOTAL_PASOS
from services.ejecutor_pasos import HANDLERS
from schemas.emision import (
    EmisionCreate, EmisionUpdate, EmisionResponse,
    ParametrosCalculo, AprobacionRequest, EmisionListResponse,
)
from schemas.liquidacion import LiquidacionResponse
from schemas.cuenta_corriente import CuentaCorrienteResponse, DeudaItem, PagoRequest, PagoResponse, ReciboResponse
from schemas.comprobante import ComprobanteResponse
from schemas.padron import PadronResponse, ContribuyentePadronResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/emisiones", tags=["Emisiones"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _postear_percibido(anio, tributo, importe, origen_ref, periodo, concepto, token):
    """POST best-effort a Presupuesto: devengado<->percibido (lado emisor).

    Informa el cobro de un tributo para que Presupuesto registre el PERCIBIDO del
    recurso mapeado. NUNCA rompe el flujo. Idempotente por origen_ref del lado del
    receptor. Si no hay mapeo tributo->recurso, Presupuesto responde 200 sin_mapeo.
    """
    import httpx
    try:
        if not tributo or not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as client:
            client.post(
                f"{settings.presupuesto_url}/percibido-por-tributo",
                json={"anio": int(anio), "tributo": str(tributo), "importe": float(importe),
                      "periodo": periodo, "origen_ref": str(origen_ref), "concepto": concepto},
                headers={"Authorization": token} if token else {})
    except Exception:
        pass


def _postear_contab(tipo, origen_ref, importe, concepto, contexto, token):
    """POST best-effort a Contabilidad del hecho económico (el contable arma el asiento).
    NUNCA rompe el flujo. Idempotente por origen_ref."""
    import httpx
    try:
        if not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as client:
            client.post(
                f"{settings.contabilidad_url}/transacciones",
                json={"origen_modulo": "emisiones", "origen_ref": str(origen_ref), "tipo": tipo,
                      "fecha": None, "importe": float(importe), "concepto": concepto,
                      "contexto": contexto or {}},
                headers={"Authorization": token} if token else {})
    except Exception:
        pass


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

@router.get("/{id}/referencias")
def listar_referencias(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Emisiones anteriores del MISMO tipo de tributo (para el paso 1 'Importar cálculo anterior').
    Excluye la emisión actual. Si la lista viene vacía, no hay de dónde importar (primera del tipo)."""
    emision = EmisionService(db).find_by_id(id)
    refs = (
        db.query(Emision)
        .filter(
            Emision.tipo_tributo == emision.tipo_tributo,
            Emision.id != emision.id,
            Emision.activo == True,
        )
        .order_by(Emision.id.desc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": r.id, "periodo": r.periodo, "numero_cuota": r.numero_cuota,
            "estado": r.estado, "paso_actual": r.paso_actual, "created_at": r.created_at,
        }
        for r in refs
    ]


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
    permisos_usuario = set(p["codigo"] for p in current_user.get("permisos", []))
    es_super = bool(current_user.get("superuser"))
    definicion = [
        {
            "numero": d["numero"], "key": d["key"], "nombre": d["nombre"],
            "descripcion": d["descripcion"], "tipo": d["tipo"], "permiso": d["permiso"],
            "puede_ejecutar": es_super or d["permiso"] in permisos_usuario,
        }
        for d in PASOS
    ]
    return {
        "id": emision.id,
        "estado": emision.estado,
        "paso_actual": emision.paso_actual,
        "total_pasos": TOTAL_PASOS,
        "definicion": definicion,
        "pasos": [
            {
                "numero_paso": p.numero_paso,
                "nombre_paso": p.nombre_paso,
                "estado": p.estado,
                "fecha_inicio": p.fecha_inicio,
                "fecha_fin": p.fecha_fin,
                "ejecutado_en": p.fecha_fin or p.fecha_inicio,
                "id_usuario": p.id_usuario,
                "usuario_nombre": p.usuario_nombre,
                "usuario_codigo": p.usuario_codigo,
                "resultado": p.resultado,
                "error": p.error,
            }
            for p in pasos
        ],
    }


@router.post("/{id}/pasos/{numero}/ejecutar")
def ejecutar_paso(
    id: int,
    numero: int,
    request: Request,
    data: dict = Body(default={}),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ejecuta un paso del workflow. Requiere el permiso de ejecución del paso."""
    paso = PASOS_POR_NUMERO.get(numero)
    if not paso:
        raise HTTPException(status_code=404, detail=f"Paso {numero} inexistente")
    if not current_user.get("superuser"):
        permisos = [p["codigo"] for p in current_user.get("permisos", [])]
        if paso["permiso"] not in permisos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tiene el permiso '{paso['permiso']}' para ejecutar el paso {numero} ({paso['nombre']})",
            )
    emision = _validar_paso(db, id, numero)
    handler = HANDLERS.get(paso["key"])
    if handler is None:
        raise HTTPException(status_code=501, detail=f"Paso {numero} sin handler")
    token = request.headers.get("authorization")
    quien = dict(
        id_usuario=current_user.get("id"),
        usuario_nombre=current_user.get("nombre_apellido"),
        usuario_codigo=current_user.get("codigo"),
    )
    # Reejecución: el paso ya estaba completado. Se invalida todo lo generado por los pasos posteriores.
    es_reejecucion = (emision.paso_actual or 0) >= numero
    try:
        if es_reejecucion:
            _limpiar_posteriores(db, id, numero)
        resultado = handler(db, emision, data or {}, token)
        if es_reejecucion:
            emision.paso_actual = numero  # retrocede: los pasos siguientes deben re-ejecutarse
        else:
            emision.paso_actual = max(emision.paso_actual or 0, numero)
        db.commit()
        _registrar_paso(db, id, numero, "completado", resultado=str(resultado)[:480],
                        metadata_paso=(data or None), **quien)
        return {"paso": numero, "nombre": paso["nombre"], "estado": "completado",
                "resultado": resultado, "reejecucion": es_reejecucion}
    except HTTPException:
        db.rollback(); raise
    except Exception as e:
        db.rollback()
        _registrar_paso(db, id, numero, "error", error=str(e), **quien)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{id}/resumen")
def get_resumen_calculo(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Totalizador del último cálculo (para las aprobaciones): cuentas, importes y por vencimiento."""
    EmisionService(db).find_by_id(id)
    liqs = db.query(Liquidacion).filter(Liquidacion.id_emision == id, Liquidacion.activo == True).all()
    por_vto = {}
    for l in liqs:
        v = l.numero_vencimiento or l.cuota or 0
        d = por_vto.setdefault(v, {"vencimiento": v, "a_cancelar": 0.0, "a_pagar": 0.0})
        d["a_cancelar"] += float(l.a_cancelar or 0)
        d["a_pagar"] += float(l.a_pagar or 0)
    return {
        "cuentas": len({l.id_contribuyente for l in liqs}),
        "lineas": len(liqs),
        "total_a_cancelar": round(sum(float(l.a_cancelar or 0) for l in liqs), 2),
        "total_a_pagar": round(sum(float(l.a_pagar or 0) for l in liqs), 2),
        "por_vencimiento": [por_vto[k] for k in sorted(por_vto)],
    }


@router.get("/{id}/recibos-pdf")
def listar_recibos_pdf(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Lista los PDF de recibos generados (impresión de prueba/general)."""
    EmisionService(db).find_by_id(id)
    from services.pdf_service import listar_recibos
    return listar_recibos(id)


@router.get("/recibos-pdf/by-contribuyente/{id_contribuyente}")
def listar_recibos_pdf_contribuyente(
    id_contribuyente: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Vista 360 / Tesorería: recibos PDF de un contribuyente en todas sus emisiones.
    La descarga usa el endpoint /{id}/recibos-pdf/archivo con id_emision, ambito y archivo."""
    from services.pdf_service import recibos_de_contribuyente
    return recibos_de_contribuyente(db, id_contribuyente)


@router.get("/{id}/recibos-pdf/archivo")
def descargar_recibo_pdf(
    id: int,
    ambito: str,
    archivo: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Descarga un PDF de recibo."""
    import os
    from fastapi.responses import FileResponse
    from services.pdf_service import ruta_recibo
    EmisionService(db).find_by_id(id)
    path = ruta_recibo(id, ambito, archivo)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Recibo no encontrado")
    return FileResponse(path, media_type="application/pdf", filename=os.path.basename(path))


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


@router.get("/{id}/cuenta-corriente", response_model=List[CuentaCorrienteResponse])
def get_cuenta_corriente(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    EmisionService(db).find_by_id(id)
    return (
        db.query(CuentaCorriente)
        .filter(CuentaCorriente.id_emision == id, CuentaCorriente.activo == True)
        .offset(skip).limit(limit).all()
    )


@router.get("/{id}/comprobantes", response_model=List[ComprobanteResponse])
def get_comprobantes(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    EmisionService(db).find_by_id(id)
    return (
        db.query(Comprobante)
        .filter(Comprobante.id_emision == id, Comprobante.activo == True)
        .offset(skip).limit(limit).all()
    )


@router.get("/cuenta-corriente/by-contribuyente/{id_contribuyente}", response_model=List[DeudaItem])
def get_deuda_por_contribuyente(
    id_contribuyente: int,
    solo_deuda: bool = Query(True, description="Si es True, solo filas con saldo > 0"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Vista 360: cuenta corriente del contribuyente con el recargo por mora calculado a hoy."""
    return CuentaCorrienteService(db).deuda_de_contribuyente(id_contribuyente, solo_deuda)


@router.post("/cuenta-corriente/{id_cc}/pagar", response_model=PagoResponse)
def pagar_concepto(
    id_cc: int,
    data: PagoRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Registra un pago contra un concepto de deuda: baja el saldo de la cuenta corriente."""
    return CuentaCorrienteService(db).registrar_pago(id_cc, data.importe, data.fecha_pago)


@router.get("/cuenta-corriente/by-contribuyente/{id_contribuyente}/saldo-a-favor")
def get_saldo_a_favor(
    id_contribuyente: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Saldo a favor (crédito) global del contribuyente disponible para compensar."""
    saldo = CuentaCorrienteService(db).saldo_a_favor(id_contribuyente)
    return {"id_contribuyente": id_contribuyente, "saldo_a_favor": float(saldo)}


@router.post("/cuenta-corriente/{id_cc}/compensar")
def compensar_saldo(
    id_cc: int,
    data: dict = Body(default={}),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Compensa el saldo a favor del contribuyente contra un concepto de deuda.

    Body: {id_contribuyente:int, importe?:float, origen_ref?:str}. Si no se pasa
    importe, compensa el máximo posible (min entre saldo a favor y saldo del concepto).
    Deja doble traza en el libro mayor (concepto 'compensacion')."""
    _requiere(current_user, "emisiones_compensar")
    id_contribuyente = data.get("id_contribuyente")
    if not id_contribuyente:
        raise HTTPException(status_code=400, detail="id_contribuyente es obligatorio")
    fecha = None
    f = data.get("fecha")
    if isinstance(f, str) and f:
        from datetime import date as _date
        try:
            fecha = _date.fromisoformat(f[:10])
        except ValueError:
            fecha = None
    return CuentaCorrienteService(db).compensar_saldo_a_favor(
        int(id_contribuyente), id_cc,
        importe=data.get("importe"), fecha=fecha,
        origen_ref=data.get("origen_ref"),
        usuario=current_user.get("codigo") or current_user.get("id"),
    )


# --- Código de pago / barcode ITF + QR ---

def _vencimiento_de_comprobante(db: Session, comp: Comprobante):
    """Primera fecha de vencimiento del comprobante (escalera o la de la emisión)."""
    from models.vencimiento_comprobante import VencimientoComprobante
    v = (
        db.query(VencimientoComprobante)
        .filter(VencimientoComprobante.id_comprobante == comp.id,
                VencimientoComprobante.activo == True)
        .order_by(VencimientoComprobante.numero)
        .first()
    )
    if v and v.fecha_vencimiento:
        return v.fecha_vencimiento
    em = db.query(Emision).filter(Emision.id == comp.id_emision).first()
    if em is not None:
        return getattr(em, "fecha_vencimiento_1", None)
    return None


def _get_comprobante(db: Session, id_comprobante: int) -> Comprobante:
    comp = (
        db.query(Comprobante)
        .filter(Comprobante.id == id_comprobante, Comprobante.activo == True)
        .first()
    )
    if not comp:
        raise HTTPException(status_code=404, detail=f"Comprobante {id_comprobante} no encontrado")
    return comp


@router.get("/comprobantes/{id_comprobante}/codigo-pago")
def get_codigo_pago(
    id_comprobante: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Datos del código de pago de un comprobante: código ITF con verificador mod-10
    y payload del QR (código + importe + vencimiento). Sin binarios."""
    from services.codigo_pago_service import datos_codigo_pago
    comp = _get_comprobante(db, id_comprobante)
    venc = _vencimiento_de_comprobante(db, comp)
    return datos_codigo_pago(comp, venc)


@router.get("/comprobantes/{id_comprobante}/barcode.png")
def get_barcode_png(
    id_comprobante: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """PNG del código de barras Interleaved 2of5 (con verificador mod-10)."""
    from fastapi.responses import Response
    from services.codigo_pago_service import (
        construir_codigo_pago, codigo_barras_itf, render_barcode_png,
    )
    comp = _get_comprobante(db, id_comprobante)
    venc = _vencimiento_de_comprobante(db, comp)
    itf = codigo_barras_itf(construir_codigo_pago(comp, venc))
    png = render_barcode_png(itf["codigo"])
    return Response(content=png, media_type="image/png",
                    headers={"Content-Disposition": f'inline; filename="barcode-{comp.numero_comprobante}.png"'})


@router.get("/comprobantes/{id_comprobante}/qr.png")
def get_qr_png(
    id_comprobante: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """PNG del QR de pago con payload estructurado (código + importe + vencimiento)."""
    from fastapi.responses import Response
    from services.codigo_pago_service import (
        construir_codigo_pago, codigo_barras_itf, construir_payload_qr, render_qr_png,
    )
    comp = _get_comprobante(db, id_comprobante)
    venc = _vencimiento_de_comprobante(db, comp)
    itf = codigo_barras_itf(construir_codigo_pago(comp, venc))
    payload = construir_payload_qr(comp, itf["codigo"], venc)
    png = render_qr_png(payload)
    return Response(content=png, media_type="image/png",
                    headers={"Content-Disposition": f'inline; filename="qr-{comp.numero_comprobante}.png"'})


@router.post("/cuenta-corriente/pagar-por-comprobante")
def pagar_por_comprobante(
    request: Request,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Impacta un cobro en la cuenta corriente a partir del numero_comprobante.
    Lo usa Tesorería (HTTP) al registrar una recaudación para bajar la deuda."""
    numero = data.get("numero_comprobante")
    importe = data.get("importe")
    if not numero or importe is None:
        raise HTTPException(status_code=400, detail="numero_comprobante e importe son obligatorios")
    fecha = data.get("fecha_pago")
    if isinstance(fecha, str) and fecha:
        from datetime import date as _date
        try:
            fecha = _date.fromisoformat(fecha[:10])
        except ValueError:
            fecha = None
    else:
        fecha = None
    resultado = CuentaCorrienteService(db).pagar_por_comprobante(
        numero, importe, fecha,
        origen_modulo=data.get("origen_modulo"),
        origen_ref=data.get("origen_ref"),
    )
    token = request.headers.get("authorization")
    # cierre contable: hecho económico "recurso.cobrado" (Recaudación a depositar a Deudores)
    ref = data.get("origen_ref") or f"cobro-comp-{numero}"
    aplicado = resultado.get("aplicado")
    _postear_contab("recurso.cobrado", ref, importe,
                    f"Cobro tributo comprobante {numero}",
                    {"comprobante": numero, "origen": data.get("origen_modulo")},
                    token)
    # devengado<->percibido (lado emisor): informar el PERCIBIDO del recurso a Presupuesto,
    # según el CONTRATO percibido-por-tributo. Best-effort e idempotente por origen_ref.
    if aplicado and float(aplicado) > 0 and not resultado.get("idempotente"):
        comp = (
            db.query(Comprobante)
            .filter(Comprobante.numero_comprobante == numero, Comprobante.activo == True)
            .first()
        )
        tributo = data.get("tributo") or (comp.tipo_tributo if comp else None)
        periodo = data.get("periodo") or (comp.periodo if comp else None)
        anio = None
        if periodo:
            try:
                anio = int(str(periodo)[:4])
            except (ValueError, TypeError):
                anio = None
        if anio is None:
            anio = datetime.now(timezone.utc).year
        _postear_percibido(anio, tributo, aplicado, f"percibido-{ref}", periodo,
                           f"Percibido {tributo} comprobante {numero}", token)
    return resultado


@router.get("/cuenta-corriente/by-contribuyente/{id_contribuyente}/movimientos")
def get_libro_mayor(
    id_contribuyente: int,
    id_cuenta_corriente: Optional[int] = Query(None, description="Filtra un solo concepto/cuenta"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Libro mayor (extracto Debe/Haber) inmutable del contribuyente, con saldo corrido.

    El saldo se DERIVA de los movimientos (no es un campo mutable)."""
    return CuentaCorrienteService(db).movimientos_de_contribuyente(
        id_contribuyente, id_cuenta_corriente
    )


@router.get("/cuenta-corriente/{id_cc}/saldo")
def get_saldo_cuenta(
    id_cc: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Saldo derivado del libro mayor para un concepto de cuenta corriente."""
    return {"id_cuenta_corriente": id_cc, "saldo": float(CuentaCorrienteService(db).saldo_por_cuenta(id_cc))}


@router.get("/pagos/by-contribuyente/{id_contribuyente}", response_model=List[ReciboResponse])
def get_pagos_por_contribuyente(
    id_contribuyente: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Recibos de pago de un contribuyente (historial de cobros)."""
    return (
        db.query(PagoRecibo)
        .filter(PagoRecibo.id_contribuyente == id_contribuyente, PagoRecibo.activo == True)
        .order_by(PagoRecibo.fecha_pago.desc(), PagoRecibo.id.desc())
        .all()
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
                    metadata_paso: dict = None, usuario_nombre: str = None,
                    usuario_codigo: str = None):
    paso = PasoWorkflow(
        id_emision=id_emision,
        numero_paso=numero_paso,
        nombre_paso=(PASOS_POR_NUMERO.get(numero_paso, {}).get("nombre")
                     or WORKFLOW_STEPS.get(numero_paso, f"paso_{numero_paso}")),
        estado=estado,
        fecha_inicio=datetime.now(timezone.utc),
        fecha_fin=datetime.now(timezone.utc) if estado in ("completado", "error") else None,
        id_usuario=id_usuario,
        usuario_nombre=usuario_nombre,
        usuario_codigo=usuario_codigo,
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


def _limpiar_posteriores(db: Session, id_emision: int, numero: int):
    """Al REEJECUTAR el paso `numero`, elimina la información de los pasos POSTERIORES.
    Cada artefacto se borra si algún paso que lo genera está después de `numero`:
      - cuenta corriente (paso 16)        -> numero < 16
      - comprobantes + vencimientos (8/14)-> numero < 14
      - ordenamiento + items (7/12)       -> numero < 12
      - liquidaciones (3/5)               -> numero < 5 (el handler de cálculo igual las regenera)
    También borra el historial de pasos ejecutados posteriores al reejecutado.
    """
    borrados = {}
    if numero < 16:
        borrados["cuenta_corriente"] = (
            db.query(CuentaCorriente).filter(CuentaCorriente.id_emision == id_emision)
            .delete(synchronize_session=False))
    if numero < 14:
        borrados["vencimientos"] = (
            db.query(VencimientoComprobante).filter(VencimientoComprobante.id_emision == id_emision)
            .delete(synchronize_session=False))
        borrados["comprobantes"] = (
            db.query(Comprobante).filter(Comprobante.id_emision == id_emision)
            .delete(synchronize_session=False))
    if numero < 12:
        ord_ids = [o.id for o in db.query(Ordenamiento.id).filter(Ordenamiento.id_emision == id_emision)]
        if ord_ids:
            db.query(OrdenamientoItem).filter(OrdenamientoItem.id_ordenamiento.in_(ord_ids)).delete(synchronize_session=False)
        borrados["ordenamientos"] = (
            db.query(Ordenamiento).filter(Ordenamiento.id_emision == id_emision)
            .delete(synchronize_session=False))
    if numero < 5:
        borrados["liquidaciones"] = (
            db.query(Liquidacion).filter(Liquidacion.id_emision == id_emision)
            .delete(synchronize_session=False))
    db.query(PasoWorkflow).filter(
        PasoWorkflow.id_emision == id_emision,
        PasoWorkflow.numero_paso > numero,
    ).delete(synchronize_session=False)
    return {k: v for k, v in borrados.items() if v}


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
    request: Request,
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

        # traer el padrón real desde ingresos_publicos (con la base imponible de cada cuenta)
        token = request.headers.get("authorization")
        items = fetch_padron(settings.ingresos_publicos_url, emision.tipo_tributo, token)
        for kw in items_a_contribuyentes(padron.id, items):
            db.add(ContribuyentePadron(**kw))
        padron.cantidad_registros = len(items)

        emision.paso_actual = 2
        emision.cantidad_contribuyentes = len(items)
        db.commit()

        if not items:
            # padrón vacío: NO es un éxito silencioso (evita el "falso verde")
            _registrar_paso(db, id, 2, "error",
                            error="El padrón vino vacío de ingresos_publicos",
                            id_usuario=current_user.get("id"))
            raise HTTPException(status_code=400,
                                detail="El padrón de cálculo vino vacío; no hay cuentas para liquidar")

        _registrar_paso(db, id, 2, "completado",
                        resultado=f"Padron {padron.id}: {len(items)} contribuyentes cargados",
                        id_usuario=current_user.get("id"))
        return {"paso": 2, "estado": "completado", "id_padron": padron.id,
                "contribuyentes": len(items)}
    except HTTPException:
        raise
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
        resultado = ComprobanteService(db).generar_comprobantes(id)
        emision.paso_actual = 12
        db.commit()
        _registrar_paso(db, id, 12, "completado", resultado=str(resultado),
                        id_usuario=current_user.get("id"))
        return {"paso": 12, "estado": "completado", "resultado": resultado}
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
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    emision = _validar_paso(db, id, 14)
    try:
        cuentas = db.query(CuentaCorriente).filter(
            CuentaCorriente.id_emision == id, CuentaCorriente.activo == True
        ).all()
        total = Decimal("0")
        for cuenta in cuentas:
            cuenta.estado = "publicada"
            total += Decimal(str(cuenta.monto_original or 0))
        db.commit()

        emision.paso_actual = 14
        db.commit()
        _registrar_paso(db, id, 14, "completado",
                        resultado=f"Deuda publicada: {len(cuentas)} cuentas",
                        id_usuario=current_user.get("id"))
        # cierre contable: hecho económico "recurso.emitido" (Deudores a Recursos)
        _postear_contab("recurso.emitido", f"emision-{id}", total,
                        f"Emisión de deuda #{id} — {len(cuentas)} cuentas",
                        {"id_emision": id, "cuentas": len(cuentas)},
                        request.headers.get("authorization"))
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
