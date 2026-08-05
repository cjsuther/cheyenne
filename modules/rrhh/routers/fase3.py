"""FASE 3: ausencias/licencias, horas extra y embargos (RRHH).

CRUD de: motivos-ausencia, ausencias, licencias-anuales, horas-extra, embargos.
Todos siguen los patrones del módulo: auth create_auth_dependency + _requiere,
filtered_query, soft-delete `activo`, skip/limit<=100, serialización de Decimal.
"""
import sys
import os
from decimal import Decimal
from datetime import date, timedelta
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
from models.rrhh import (
    Legajo, MotivoAusencia, Ausencia, LicenciaAnual, HoraExtra,
    Embargo, EmbargoLiquidado,
    TIPOS_HORA_EXTRA, TIPOS_EMBARGO, RETIENE_EMBARGO, ESTADOS_EMBARGO,
)

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


def _dias_habiles(inicio, fin):
    """Cuenta días hábiles (lun-vie) entre dos fechas, inclusivo."""
    if not inicio or not fin or fin < inicio:
        return 0
    n = 0
    d = inicio
    while d <= fin:
        if d.weekday() < 5:  # 0=lun .. 4=vie
            n += 1
        d += timedelta(days=1)
    return n


# ═══ MOTIVOS DE AUSENCIA ══════════════════════════════════════════════
motivos_ausencia_router = APIRouter(prefix="/motivos-ausencia", tags=["Motivos de Ausencia"])
_MOT = ["id", "codigo", "descripcion", "porcentaje_descuento", "descuenta_dias",
        "descuenta_aguinaldo", "afecta_presentismo", "es_licencia_anual",
        "requiere_certificado", "activo"]


class MotivoAusenciaIn(BaseModel):
    codigo: str
    descripcion: str
    porcentaje_descuento: Decimal = Decimal("0")
    descuenta_dias: bool = False
    descuenta_aguinaldo: bool = False
    afecta_presentismo: bool = False
    es_licencia_anual: bool = False
    requiere_certificado: bool = False
    activo: bool = True


@motivos_ausencia_router.get("")
def listar_motivos(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(MotivoAusencia).filter(MotivoAusencia.activo == True)
    q = filtered_query(q, MotivoAusencia, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_ser(x, _MOT) for x in q.offset(skip).limit(limit).all()]


@motivos_ausencia_router.get("/{id}")
def obtener_motivo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(MotivoAusencia).filter(MotivoAusencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Motivo inexistente")
    return _ser(x, _MOT)


@motivos_ausencia_router.post("", status_code=201)
def crear_motivo(data: MotivoAusenciaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    codigo = data.codigo.strip()
    if db.query(MotivoAusencia).filter(MotivoAusencia.codigo == codigo).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
    payload = data.model_dump()
    payload["codigo"] = codigo
    x = MotivoAusencia(**payload); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _MOT)


@motivos_ausencia_router.put("/{id}")
def editar_motivo(id: int, data: MotivoAusenciaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(MotivoAusencia).filter(MotivoAusencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Motivo inexistente")
    for k, v in data.model_dump().items():
        if k == "codigo":
            v = v.strip()
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _MOT)


@motivos_ausencia_router.delete("/{id}")
def borrar_motivo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(MotivoAusencia).filter(MotivoAusencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Motivo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ AUSENCIAS ════════════════════════════════════════════════════════
ausencias_router = APIRouter(prefix="/ausencias", tags=["Ausencias"])
_AUS = ["id", "id_legajo", "id_motivo", "fecha_inicio", "fecha_fin", "dias_habiles",
        "certificado", "observaciones", "activo"]


class AusenciaIn(BaseModel):
    id_legajo: int
    id_motivo: Optional[int] = None
    fecha_inicio: date
    fecha_fin: date
    dias_habiles: int = 0
    certificado: bool = False
    observaciones: Optional[str] = None
    activo: bool = True


@ausencias_router.get("")
def listar_ausencias(request: Request, id_legajo: int = Query(None), anio: int = Query(None),
                     mes: int = Query(None), skip: int = Query(0, ge=0),
                     limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Ausencia).filter(Ausencia.activo == True)
    if id_legajo is not None:
        q = q.filter(Ausencia.id_legajo == id_legajo)
    if anio is not None and mes is not None:
        ini = date(anio, mes, 1)
        fin = date(anio, 12, 31) if mes == 12 else (date(anio, mes + 1, 1) - timedelta(days=1))
        q = q.filter(Ausencia.fecha_inicio <= fin, Ausencia.fecha_fin >= ini)
    elif anio is not None:
        ini = date(anio, 1, 1); fin = date(anio, 12, 31)
        q = q.filter(Ausencia.fecha_inicio <= fin, Ausencia.fecha_fin >= ini)
    q = filtered_query(q, Ausencia, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "anio", "mes"}, default_sort="id")
    return [_ser(x, _AUS) for x in q.offset(skip).limit(limit).all()]


@ausencias_router.get("/{id}")
def obtener_ausencia(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Ausencia).filter(Ausencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Ausencia inexistente")
    return _ser(x, _AUS)


@ausencias_router.post("", status_code=201)
def crear_ausencia(data: AusenciaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    if data.fecha_fin < data.fecha_inicio:
        raise HTTPException(status_code=400, detail="fecha_fin no puede ser anterior a fecha_inicio")
    if data.id_motivo is not None and not db.query(MotivoAusencia).filter(MotivoAusencia.id == data.id_motivo).first():
        raise HTTPException(status_code=404, detail="Motivo inexistente")
    payload = data.model_dump()
    if not payload.get("dias_habiles"):
        payload["dias_habiles"] = _dias_habiles(data.fecha_inicio, data.fecha_fin)
    x = Ausencia(**payload); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _AUS)


@ausencias_router.put("/{id}")
def editar_ausencia(id: int, data: AusenciaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Ausencia).filter(Ausencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Ausencia inexistente")
    if data.fecha_fin < data.fecha_inicio:
        raise HTTPException(status_code=400, detail="fecha_fin no puede ser anterior a fecha_inicio")
    payload = data.model_dump()
    if not payload.get("dias_habiles"):
        payload["dias_habiles"] = _dias_habiles(data.fecha_inicio, data.fecha_fin)
    for k, v in payload.items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _AUS)


@ausencias_router.delete("/{id}")
def borrar_ausencia(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Ausencia).filter(Ausencia.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Ausencia inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ LICENCIAS ANUALES ════════════════════════════════════════════════
licencias_anuales_router = APIRouter(prefix="/licencias-anuales", tags=["Licencias Anuales"])
_LIC = ["id", "id_legajo", "anio", "cant_dias", "dias_tomados", "activo"]


def _ser_lic(x):
    out = _ser(x, _LIC)
    out["saldo"] = int(x.cant_dias) - int(x.dias_tomados)
    return out


class LicenciaAnualIn(BaseModel):
    id_legajo: int
    anio: int
    cant_dias: int = 0
    dias_tomados: int = 0
    activo: bool = True


@licencias_anuales_router.get("")
def listar_licencias(request: Request, id_legajo: int = Query(None), anio: int = Query(None),
                     skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
                     db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(LicenciaAnual).filter(LicenciaAnual.activo == True)
    if id_legajo is not None:
        q = q.filter(LicenciaAnual.id_legajo == id_legajo)
    if anio is not None:
        q = q.filter(LicenciaAnual.anio == anio)
    q = filtered_query(q, LicenciaAnual, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "anio"}, default_sort="anio")
    return [_ser_lic(x) for x in q.offset(skip).limit(limit).all()]


@licencias_anuales_router.get("/{id}")
def obtener_licencia(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(LicenciaAnual).filter(LicenciaAnual.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Licencia inexistente")
    return _ser_lic(x)


@licencias_anuales_router.post("", status_code=201)
def crear_licencia(data: LicenciaAnualIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = LicenciaAnual(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser_lic(x)


@licencias_anuales_router.put("/{id}")
def editar_licencia(id: int, data: LicenciaAnualIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(LicenciaAnual).filter(LicenciaAnual.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Licencia inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser_lic(x)


@licencias_anuales_router.delete("/{id}")
def borrar_licencia(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(LicenciaAnual).filter(LicenciaAnual.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Licencia inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ HORAS EXTRA ══════════════════════════════════════════════════════
horas_extra_router = APIRouter(prefix="/horas-extra", tags=["Horas Extra"])
_HE = ["id", "id_legajo", "anio", "mes", "tipo", "cantidad", "valor_hora", "activo"]


class HoraExtraIn(BaseModel):
    id_legajo: int
    anio: int
    mes: int
    tipo: str = "50"
    cantidad: Decimal = Decimal("0")
    valor_hora: Decimal = Decimal("0")
    activo: bool = True


def _valida_he(data):
    if data.tipo not in TIPOS_HORA_EXTRA:
        raise HTTPException(status_code=400, detail=f"Tipo inválido; use uno de {TIPOS_HORA_EXTRA}")
    if not (1 <= data.mes <= 12):
        raise HTTPException(status_code=400, detail="Mes inválido (1-12)")


@horas_extra_router.get("")
def listar_he(request: Request, id_legajo: int = Query(None), anio: int = Query(None),
              mes: int = Query(None), skip: int = Query(0, ge=0),
              limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(HoraExtra).filter(HoraExtra.activo == True)
    if id_legajo is not None:
        q = q.filter(HoraExtra.id_legajo == id_legajo)
    if anio is not None:
        q = q.filter(HoraExtra.anio == anio)
    if mes is not None:
        q = q.filter(HoraExtra.mes == mes)
    q = filtered_query(q, HoraExtra, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "anio", "mes"}, default_sort="id")
    return [_ser(x, _HE) for x in q.offset(skip).limit(limit).all()]


@horas_extra_router.get("/{id}")
def obtener_he(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(HoraExtra).filter(HoraExtra.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Hora extra inexistente")
    return _ser(x, _HE)


@horas_extra_router.post("", status_code=201)
def crear_he(data: HoraExtraIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_he(data)
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = HoraExtra(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _HE)


@horas_extra_router.put("/{id}")
def editar_he(id: int, data: HoraExtraIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_he(data)
    x = db.query(HoraExtra).filter(HoraExtra.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Hora extra inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _HE)


@horas_extra_router.delete("/{id}")
def borrar_he(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(HoraExtra).filter(HoraExtra.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Hora extra inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ EMBARGOS ═════════════════════════════════════════════════════════
embargos_router = APIRouter(prefix="/embargos", tags=["Embargos"])
_EMB = ["id", "id_legajo", "numero", "tipo", "retiene", "cuota_valor", "monto_total",
        "respeta_salario_familiar", "fecha", "fecha_vencimiento", "caratula", "juzgado",
        "estado", "banco_destino", "activo"]
_EMBLIQ = ["id", "id_embargo", "id_proceso", "id_legajo", "anio", "mes", "monto"]


class EmbargoIn(BaseModel):
    id_legajo: int
    numero: Optional[str] = None
    tipo: str = "comun"
    retiene: str = "porcentaje"
    cuota_valor: Decimal = Decimal("0")
    monto_total: Decimal = Decimal("0")
    respeta_salario_familiar: bool = True
    fecha: Optional[date] = None
    fecha_vencimiento: Optional[date] = None
    caratula: Optional[str] = None
    juzgado: Optional[str] = None
    estado: str = "autorizado"
    banco_destino: Optional[str] = None
    activo: bool = True


def _valida_embargo(data):
    if data.tipo not in TIPOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"Tipo inválido; use uno de {TIPOS_EMBARGO}")
    if data.retiene not in RETIENE_EMBARGO:
        raise HTTPException(status_code=400, detail=f"'retiene' inválido; use uno de {RETIENE_EMBARGO}")
    if data.estado not in ESTADOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"Estado inválido; use uno de {ESTADOS_EMBARGO}")


@embargos_router.get("")
def listar_embargos(request: Request, id_legajo: int = Query(None), estado: str = Query(None),
                    skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    q = db.query(Embargo).filter(Embargo.activo == True)
    if id_legajo is not None:
        q = q.filter(Embargo.id_legajo == id_legajo)
    if estado:
        q = q.filter(Embargo.estado == estado)
    q = filtered_query(q, Embargo, dict(request.query_params),
                       exclude={"skip", "limit", "id_legajo", "estado"}, default_sort="id")
    return [_ser(x, _EMB) for x in q.offset(skip).limit(limit).all()]


@embargos_router.get("/{id}")
def obtener_embargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    x = db.query(Embargo).filter(Embargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    return _ser(x, _EMB)


@embargos_router.get("/{id}/liquidados")
def liquidados_embargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Cuotas retenidas del embargo + total_retenido y saldo contra monto_total."""
    _requiere(current_user, "rrhh_read")
    emb = db.query(Embargo).filter(Embargo.id == id).first()
    if not emb:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    filas = (db.query(EmbargoLiquidado)
             .filter(EmbargoLiquidado.id_embargo == id)
             .order_by(EmbargoLiquidado.anio, EmbargoLiquidado.mes, EmbargoLiquidado.id).all())
    total = sum((f.monto for f in filas), Decimal(0))
    saldo = None
    if emb.monto_total and emb.monto_total > 0:
        saldo = float(emb.monto_total - total)
    return {
        "id_embargo": id,
        "monto_total": float(emb.monto_total),
        "total_retenido": float(total),
        "saldo": saldo,
        "liquidados": [_ser(f, _EMBLIQ) for f in filas],
    }


@embargos_router.post("", status_code=201)
def crear_embargo(data: EmbargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_embargo(data)
    if not db.query(Legajo).filter(Legajo.id == data.id_legajo).first():
        raise HTTPException(status_code=404, detail="Legajo inexistente")
    x = Embargo(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser(x, _EMB)


@embargos_router.put("/{id}")
def editar_embargo(id: int, data: EmbargoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    _valida_embargo(data)
    x = db.query(Embargo).filter(Embargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _ser(x, _EMB)


@embargos_router.delete("/{id}")
def borrar_embargo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    x = db.query(Embargo).filter(Embargo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
