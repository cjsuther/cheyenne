import sys
import os
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.retencion import TipoRetencion, RetencionAplicada, REGIMENES, BASES
from models.gasto import GastoExpediente

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _q2(v) -> Decimal:
    return Decimal(str(v)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


# ── Tipos de retención (CRUD) ────────────────────────────────────────
tipos_router = APIRouter(prefix="/tipos-retencion", tags=["Retenciones"])
_T = ["id", "codigo", "nombre", "regimen", "alicuota", "base", "minimo_no_imponible", "activo"]


def _ser_tipo(t: TipoRetencion):
    return {
        "id": t.id, "codigo": t.codigo, "nombre": t.nombre, "regimen": t.regimen,
        "alicuota": float(t.alicuota), "base": t.base,
        "minimo_no_imponible": float(t.minimo_no_imponible) if t.minimo_no_imponible is not None else None,
        "activo": t.activo,
    }


class TipoRetencionIn(BaseModel):
    codigo: str
    nombre: str
    regimen: str = "otros"
    alicuota: Decimal = Decimal("0")
    base: str = "neto"
    minimo_no_imponible: Optional[Decimal] = None
    activo: bool = True


def _validar_tipo(data: TipoRetencionIn):
    if data.regimen not in REGIMENES:
        raise HTTPException(status_code=400, detail=f"Régimen inválido. Use uno de: {', '.join(REGIMENES)}")
    if data.base not in BASES:
        raise HTTPException(status_code=400, detail=f"Base inválida. Use uno de: {', '.join(BASES)}")
    if data.alicuota < 0:
        raise HTTPException(status_code=400, detail="La alícuota no puede ser negativa")


@tipos_router.get("")
def listar_tipos(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                 db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_read")
    q = db.query(TipoRetencion).filter(TipoRetencion.activo == True)
    q = filtered_query(q, TipoRetencion, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_ser_tipo(t) for t in q.offset(skip).limit(limit).all()]


@tipos_router.post("", status_code=201)
def crear_tipo(data: TipoRetencionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_retenciones")
    _validar_tipo(data)
    if db.query(TipoRetencion).filter(TipoRetencion.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el tipo de retención {data.codigo}")
    t = TipoRetencion(**data.model_dump())
    t.codigo = t.codigo.strip()
    db.add(t); db.commit(); db.refresh(t)
    return _ser_tipo(t)


@tipos_router.put("/{id}")
def editar_tipo(id: int, data: TipoRetencionIn, db: Session = Depends(get_db),
                current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_retenciones")
    _validar_tipo(data)
    t = db.query(TipoRetencion).filter(TipoRetencion.id == id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tipo de retención inexistente")
    for k, v in data.model_dump().items():
        setattr(t, k, v)
    db.commit(); db.refresh(t)
    return _ser_tipo(t)


@tipos_router.delete("/{id}")
def baja_tipo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_retenciones")
    t = db.query(TipoRetencion).filter(TipoRetencion.id == id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tipo de retención inexistente")
    t.activo = False; db.commit()
    return {"message": "dado de baja"}


# ── Retenciones aplicadas ────────────────────────────────────────────
retenciones_router = APIRouter(prefix="/retenciones", tags=["Retenciones"])


def _ser_ret(r: RetencionAplicada):
    return {
        "id": r.id, "id_gasto": r.id_gasto, "id_tipo_retencion": r.id_tipo_retencion,
        "tipo_codigo": r.tipo_codigo, "tipo_nombre": r.tipo_nombre, "regimen": r.regimen,
        "alicuota": float(r.alicuota) if r.alicuota is not None else None,
        "base_calculo": float(r.base_calculo), "importe": float(r.importe),
        "periodo": r.periodo, "comprobante": r.comprobante,
        "cuit_beneficiario": r.cuit_beneficiario, "beneficiario": r.beneficiario,
        "observaciones": r.observaciones, "creado_por": r.creado_por,
        "created_at": r.created_at, "activo": r.activo,
    }


@retenciones_router.get("")
def listar_retenciones(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                       db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_read")
    q = db.query(RetencionAplicada).filter(RetencionAplicada.activo == True)
    q = filtered_query(q, RetencionAplicada, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_ser_ret(r) for r in q.offset(skip).limit(limit).all()]


# ── Export TXT por régimen (formato simple documentado) ──────────────
# Cada línea (pipe-separated), una por retención, ordenadas por régimen/periodo:
#   REGIMEN|PERIODO|CUIT|FECHA(AAAAMMDD)|COMPROBANTE|BASE_CALCULO|ALICUOTA|IMPORTE_RETENIDO|BENEFICIARIO
# Importes con 2 decimales y punto decimal. Encoding UTF-8. Este layout es un
# denominador común simple para AFIP/ARBA; el organismo real puede exigir ancho fijo.
@retenciones_router.get("/export.txt", response_class=PlainTextResponse)
def export_txt(request: Request, regimen: Optional[str] = Query(None), periodo: Optional[str] = Query(None),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_retenciones")
    q = db.query(RetencionAplicada).filter(RetencionAplicada.activo == True)
    if regimen:
        if regimen not in REGIMENES:
            raise HTTPException(status_code=400, detail=f"Régimen inválido. Use uno de: {', '.join(REGIMENES)}")
        q = q.filter(RetencionAplicada.regimen == regimen)
    if periodo:
        q = q.filter(RetencionAplicada.periodo == periodo)
    q = q.order_by(RetencionAplicada.regimen, RetencionAplicada.periodo, RetencionAplicada.id)

    lineas = []
    for r in q.all():
        fecha = ""
        if r.created_at:
            try:
                fecha = r.created_at.strftime("%Y%m%d")
            except Exception:
                fecha = ""
        campos = [
            (r.regimen or "otros").upper(),
            r.periodo or "",
            (r.cuit_beneficiario or "").replace("-", ""),
            fecha,
            (r.comprobante or "").replace("|", " "),
            f"{Decimal(str(r.base_calculo)):.2f}",
            f"{Decimal(str(r.alicuota or 0)):.4f}",
            f"{Decimal(str(r.importe)):.2f}",
            (r.beneficiario or "").replace("|", " "),
        ]
        lineas.append("|".join(campos))
    return "\n".join(lineas) + ("\n" if lineas else "")


# ── Export SICORE (AFIP Ganancias) e IIBB (ARBA), ancho fijo ─────────
# NOTA: el layout sigue la ESTRUCTURA de campos del organismo; las posiciones/anchos
# exactos deben validarse contra el diseño de registro vigente (AFIP RG / ARBA disposición)
# antes de presentar. Los campos y su orden son los correctos; ajustar anchos si el aplicativo lo exige.
def _num_afip(v, enteros, decimales=2):
    """Importe sin punto decimal, con ceros a la izquierda (formato organismos)."""
    n = int((Decimal(str(v or 0)).quantize(Decimal("0.01")) * (10 ** decimales)).to_integral_value())
    return str(abs(n)).zfill(enteros + decimales)[: enteros + decimales]


def _txt(v, ancho, izq=True):
    s = (str(v or "")).replace("\n", " ").replace("|", " ")
    s = s[:ancho]
    return s.ljust(ancho) if izq else s.rjust(ancho, "0")


def _fecha_afip(dt):
    try:
        return dt.strftime("%d/%m/%Y")
    except Exception:
        return " " * 10


@retenciones_router.get("/sicore.txt", response_class=PlainTextResponse)
def export_sicore(periodo: Optional[str] = Query(None, description="AAAAMM"),
                  db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """SICORE — retenciones/percepciones de Ganancias (AFIP). Un registro por retención de régimen 'ganancias'.
    Campos: fecha ret. | cód. comprobante | nº comprobante | importe comprobante | cód. impuesto (217) |
    cód. régimen | cód. operación (1) | base cálculo | fecha ret. | cód. condición (01) | susp. (0) |
    importe retención | % excl. (000000) | tipo doc (80=CUIT) | nº doc | nº certificado."""
    _requiere(current_user, "contaduria_retenciones")
    q = db.query(RetencionAplicada).filter(RetencionAplicada.activo == True,
                                           RetencionAplicada.regimen == "ganancias")
    if periodo:
        q = q.filter(RetencionAplicada.periodo == periodo)
    lineas = []
    for r in q.order_by(RetencionAplicada.id).all():
        f = _fecha_afip(r.created_at)
        reg = [
            "06",                                        # cód. comprobante (06 = orden de pago)
            f,                                           # fecha del comprobante
            _txt(r.comprobante, 16),                     # nº comprobante
            _num_afip(r.base_calculo, 13),               # importe del comprobante (aprox = base)
            "217",                                       # impuesto Ganancias
            _txt((r.tipo_codigo or "078"), 3, izq=False),  # régimen
            "1",                                         # operación: retención
            _num_afip(r.base_calculo, 12),               # base de cálculo
            f,                                           # fecha de la retención
            "01",                                        # condición
            "0",                                         # sujeto suspendido
            _num_afip(r.importe, 12),                    # importe retención
            "000000",                                    # % exclusión
            "80",                                        # tipo doc: CUIT
            _txt((r.cuit_beneficiario or "").replace("-", ""), 20, izq=False),
            _txt(r.id, 14, izq=False),                   # nº certificado (usamos el id)
        ]
        lineas.append("".join(reg))
    return "\r\n".join(lineas) + ("\r\n" if lineas else "")


@retenciones_router.get("/iibb-arba.txt", response_class=PlainTextResponse)
def export_iibb(periodo: Optional[str] = Query(None, description="AAAAMM"),
                db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """ARBA — retenciones de Ingresos Brutos. Un registro por retención de régimen 'iibb'.
    Campos: CUIT | fecha ret. (AAAAMMDD) | tipo/nº comprobante | monto retención | tipo operación (R) | base."""
    _requiere(current_user, "contaduria_retenciones")
    q = db.query(RetencionAplicada).filter(RetencionAplicada.activo == True,
                                           RetencionAplicada.regimen == "iibb")
    if periodo:
        q = q.filter(RetencionAplicada.periodo == periodo)
    lineas = []
    for r in q.order_by(RetencionAplicada.id).all():
        fecha = r.created_at.strftime("%Y%m%d") if r.created_at else "        "
        campos = [
            (r.cuit_beneficiario or "").replace("-", "").rjust(11, "0")[:11],
            fecha,
            _txt(r.comprobante, 16),
            _num_afip(r.importe, 11),
            "R",
            _num_afip(r.base_calculo, 11),
        ]
        lineas.append("".join(campos))
    return "\r\n".join(lineas) + ("\r\n" if lineas else "")


# ── Cálculo/registro de retenciones sobre un gasto ───────────────────
gasto_ret_router = APIRouter(prefix="/gastos", tags=["Retenciones"])


class RetencionCalcItem(BaseModel):
    id_tipo_retencion: int
    # opcional: base explícita; si no se envía se usa el importe del gasto
    base_calculo: Optional[Decimal] = None


class RetencionesGastoIn(BaseModel):
    retenciones: List[RetencionCalcItem]
    periodo: Optional[str] = None          # AAAAMM; por defecto el del mes actual
    comprobante: Optional[str] = None
    cuit_beneficiario: Optional[str] = None
    simular: bool = False                  # si True, calcula pero no persiste


@gasto_ret_router.get("/{id}/retenciones")
def listar_retenciones_gasto(id: int, db: Session = Depends(get_db),
                             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contaduria_read")
    q = db.query(RetencionAplicada).filter(
        RetencionAplicada.id_gasto == id, RetencionAplicada.activo == True
    ).order_by(RetencionAplicada.id)
    return [_ser_ret(r) for r in q.all()]


@gasto_ret_router.post("/{id}/retenciones", status_code=201)
def aplicar_retenciones(id: int, data: RetencionesGastoIn = Body(...),
                        db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Calcula y (salvo simular) registra las retenciones elegidas sobre el importe del gasto.
    Se usa típicamente al devengar o pagar. Cálculo: base * alícuota%, respetando el
    mínimo no imponible del tipo (si la base < mínimo, la retención es 0)."""
    _requiere(current_user, "contaduria_retenciones")
    g = db.query(GastoExpediente).filter(GastoExpediente.id == id, GastoExpediente.activo == True).first()
    if not g:
        raise HTTPException(status_code=404, detail=f"Expediente {id} no encontrado")
    if g.estado not in ("devengado", "pagado"):
        raise HTTPException(status_code=409, detail="Solo se retiene sobre gastos devengados o pagados")
    if not data.retenciones:
        raise HTTPException(status_code=400, detail="Debe indicar al menos un tipo de retención")

    periodo = (data.periodo or "").strip() or datetime.now(timezone.utc).strftime("%Y%m")
    resultados = []
    total_retenido = Decimal("0")

    for item in data.retenciones:
        t = db.query(TipoRetencion).filter(
            TipoRetencion.id == item.id_tipo_retencion, TipoRetencion.activo == True
        ).first()
        if not t:
            raise HTTPException(status_code=404, detail=f"Tipo de retención {item.id_tipo_retencion} inexistente")
        base = _q2(item.base_calculo) if item.base_calculo is not None else _q2(g.importe)
        if base <= 0:
            raise HTTPException(status_code=400, detail="La base de cálculo debe ser mayor a cero")

        importe = Decimal("0")
        if t.minimo_no_imponible is None or base >= Decimal(str(t.minimo_no_imponible)):
            importe = _q2(base * Decimal(str(t.alicuota)) / Decimal("100"))

        r = RetencionAplicada(
            id_gasto=g.id, id_tipo_retencion=t.id,
            tipo_codigo=t.codigo, tipo_nombre=t.nombre, regimen=t.regimen, alicuota=t.alicuota,
            base_calculo=base, importe=importe, periodo=periodo,
            comprobante=data.comprobante or g.factura_numero,
            cuit_beneficiario=(data.cuit_beneficiario or "").strip() or None,
            beneficiario=g.proveedor, creado_por=_quien(current_user),
        )
        total_retenido += importe
        if not data.simular:
            db.add(r)
        resultados.append(r)

    if data.simular:
        return {
            "simulado": True, "periodo": periodo, "total_retenido": float(total_retenido),
            "retenciones": [{
                "id_tipo_retencion": r.id_tipo_retencion, "tipo_codigo": r.tipo_codigo,
                "regimen": r.regimen, "alicuota": float(r.alicuota or 0),
                "base_calculo": float(r.base_calculo), "importe": float(r.importe),
            } for r in resultados],
        }

    db.commit()
    for r in resultados:
        db.refresh(r)
    return {
        "id_gasto": g.id, "periodo": periodo, "total_retenido": float(total_retenido),
        "retenciones": [_ser_ret(r) for r in resultados],
    }
