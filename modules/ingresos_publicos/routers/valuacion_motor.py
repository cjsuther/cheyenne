import sys
import os
from decimal import Decimal
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.valuacion_motor import ValorTierra, AlicuotaRubro
from models.inmueble import Inmueble
from models.inmueble_valuacion import InmuebleValuacion
from models.inmueble_superficie import InmuebleSuperficie
from models.inmueble_frente import InmuebleFrente
from models.vehiculo import Vehiculo
from models.vehiculo_valuacion import VehiculoValuacion
from models.comercio import Comercio
from models.comercio_rubro import ComercioRubro
from models.comercio_ddjj import ComercioDDJJ

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _dec(v):
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


# ═══ Parámetros: Valor de la tierra ══════════════════════════════════
valor_tierra_router = APIRouter(prefix="/valor-tierra", tags=["Motor · Valor tierra"])
_VT = ["id", "ejercicio", "zona", "valor_m2", "coef_frente", "activo"]


class ValorTierraIn(BaseModel):
    ejercicio: int
    zona: str = "general"
    valor_m2: Decimal
    coef_frente: Decimal = Decimal("0")
    activo: bool = True


@valor_tierra_router.get("")
def listar_vt(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_read")
    q = filtered_query(db.query(ValorTierra), ValorTierra, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="ejercicio", default_dir="desc")
    return [{c: getattr(x, c) for c in _VT} for x in q.limit(200).all()]


@valor_tierra_router.post("", status_code=201)
def crear_vt(data: ValorTierraIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    ex = db.query(ValorTierra).filter(ValorTierra.ejercicio == data.ejercicio, ValorTierra.zona == data.zona.strip()).first()
    if ex:
        for k, v in data.model_dump().items():
            setattr(ex, k, v)
        db.commit(); return {c: getattr(ex, c) for c in _VT}
    x = ValorTierra(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _VT}


@valor_tierra_router.delete("/{id}")
def del_vt(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    x = db.query(ValorTierra).filter(ValorTierra.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="No existe")
    db.delete(x); db.commit(); return {"message": "eliminado"}


# ═══ Parámetros: Alícuota por rubro ══════════════════════════════════
alicuota_router = APIRouter(prefix="/alicuota-rubro", tags=["Motor · Alícuota rubro"])
_AR = ["id", "id_rubro", "ejercicio", "alicuota", "minimo", "activo"]


class AlicuotaIn(BaseModel):
    id_rubro: int
    ejercicio: int
    alicuota: Decimal
    minimo: Decimal = Decimal("0")
    activo: bool = True


@alicuota_router.get("")
def listar_ar(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_read")
    q = filtered_query(db.query(AlicuotaRubro), AlicuotaRubro, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id_rubro")
    return [{c: getattr(x, c) for c in _AR} for x in q.limit(300).all()]


@alicuota_router.post("", status_code=201)
def crear_ar(data: AlicuotaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    ex = db.query(AlicuotaRubro).filter(AlicuotaRubro.id_rubro == data.id_rubro, AlicuotaRubro.ejercicio == data.ejercicio).first()
    if ex:
        for k, v in data.model_dump().items():
            setattr(ex, k, v)
        db.commit(); return {c: getattr(ex, c) for c in _AR}
    x = AlicuotaRubro(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _AR}


@alicuota_router.delete("/{id}")
def del_ar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    x = db.query(AlicuotaRubro).filter(AlicuotaRubro.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="No existe")
    db.delete(x); db.commit(); return {"message": "eliminado"}


# ═══ Motores de cálculo ══════════════════════════════════════════════
motor_router = APIRouter(prefix="/valuacion", tags=["Motores de valuación"])


def _valuar_inmueble(db, inm: Inmueble, ejercicio: int, zona: str = "general"):
    vt = db.query(ValorTierra).filter(ValorTierra.ejercicio == ejercicio, ValorTierra.zona == zona,
                                      ValorTierra.activo == True).first()
    if not vt:
        return None, f"No hay valor de tierra para el ejercicio {ejercicio} zona '{zona}'"
    superficie = db.query(func.coalesce(func.sum(InmuebleSuperficie.superficie), 0)).filter(
        InmuebleSuperficie.id_inmueble == inm.id, InmuebleSuperficie.activo == True).scalar() or 0
    frente = db.query(func.coalesce(func.sum(InmuebleFrente.metros), 0)).filter(
        InmuebleFrente.id_inmueble == inm.id, InmuebleFrente.activo == True).scalar() or 0
    base = (_dec(vt.valor_m2) * _dec(superficie) + _dec(vt.valor_m2) * _dec(vt.coef_frente) * _dec(frente)).quantize(Decimal("0.01"))
    # crea/actualiza la valuación fiscal del ejercicio
    val = db.query(InmuebleValuacion).filter(InmuebleValuacion.id_inmueble == inm.id,
                                             InmuebleValuacion.ejercicio == ejercicio).first()
    if val:
        val.valor = base; val.activo = True
    else:
        db.add(InmuebleValuacion(id_inmueble=inm.id, id_tipo_valuacion=1, ejercicio=ejercicio,
                                 valor=base, fecha_vigencia=date(ejercicio, 1, 1), activo=True))
    return {"id_inmueble": inm.id, "superficie": float(superficie), "frente": float(frente),
            "valor_m2": float(vt.valor_m2), "base_imponible": float(base)}, None


@motor_router.post("/inmueble/{id}")
def valuar_inmueble(id: int, ejercicio: int = Query(...), zona: str = Query("general"),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_valuar")
    inm = db.query(Inmueble).filter(Inmueble.id == id).first()
    if not inm:
        raise HTTPException(status_code=404, detail="Inmueble inexistente")
    res, err = _valuar_inmueble(db, inm, ejercicio, zona)
    if err:
        raise HTTPException(status_code=400, detail=err)
    db.commit()
    return res


@motor_router.post("/inmuebles/masiva")
def valuar_inmuebles_masiva(ejercicio: int = Query(...), zona: str = Query("general"),
                            db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_valuar")
    inms = db.query(Inmueble).filter(Inmueble.activo == True).all() if hasattr(Inmueble, "activo") else db.query(Inmueble).all()
    ok = 0; total = CERO; errores = 0
    for inm in inms:
        res, err = _valuar_inmueble(db, inm, ejercicio, zona)
        if err:
            errores += 1
        else:
            ok += 1; total += _dec(res["base_imponible"])
    db.commit()
    return {"ejercicio": ejercicio, "zona": zona, "valuados": ok, "sin_valuar": errores, "base_total": float(total)}


@motor_router.get("/vehiculo/{id}")
def valuar_vehiculo(id: int, ejercicio: int = Query(...), db: Session = Depends(get_db),
                    current_user: dict = Depends(get_current_user)):
    """Resuelve la valuación fiscal (DNRPA) de un vehículo por código de modelo + año + ejercicio."""
    _requiere(current_user, "ingresos_read")
    v = db.query(Vehiculo).filter(Vehiculo.id == id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehículo inexistente")
    val = db.query(VehiculoValuacion).filter(
        VehiculoValuacion.codigo_modelo == v.codigo_modelo, VehiculoValuacion.anio == v.anio,
        VehiculoValuacion.ejercicio == ejercicio, VehiculoValuacion.activo == True).first()
    if not val:
        val = db.query(VehiculoValuacion).filter(
            VehiculoValuacion.codigo_modelo == v.codigo_modelo, VehiculoValuacion.anio == v.anio,
            VehiculoValuacion.activo == True).order_by(VehiculoValuacion.ejercicio.desc().nullslast()).first()
    if not val:
        return {"id_vehiculo": id, "codigo_modelo": v.codigo_modelo, "anio": v.anio,
                "base_imponible": None, "aviso": "Sin valor en la tabla DNRPA para ese modelo/año"}
    return {"id_vehiculo": id, "codigo_modelo": v.codigo_modelo, "anio": v.anio,
            "ejercicio": val.ejercicio, "base_imponible": float(val.valor)}


@motor_router.post("/comercio-ddjj/{id}/liquidar")
def liquidar_ddjj(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Liquida una DDJJ de comercio: importe = max(ingresos_declarados * alícuota(rubro), mínimo)."""
    _requiere(current_user, "ingresos_valuar")
    ddjj = db.query(ComercioDDJJ).filter(ComercioDDJJ.id == id).first()
    if not ddjj:
        raise HTTPException(status_code=404, detail="DDJJ inexistente")
    ejercicio = ddjj.periodo
    alic = db.query(AlicuotaRubro).filter(AlicuotaRubro.id_rubro == ddjj.id_rubro,
                                          AlicuotaRubro.ejercicio == ejercicio, AlicuotaRubro.activo == True).first()
    if not alic:
        alic = db.query(AlicuotaRubro).filter(AlicuotaRubro.id_rubro == ddjj.id_rubro,
                                              AlicuotaRubro.activo == True).order_by(AlicuotaRubro.ejercicio.desc()).first()
    if not alic:
        raise HTTPException(status_code=400, detail=f"No hay alícuota definida para el rubro {ddjj.id_rubro}")
    base = _dec(ddjj.ingresos_declarados)
    tributo = (base * _dec(alic.alicuota) / Decimal("100")).quantize(Decimal("0.01"))
    importe = max(tributo, _dec(alic.minimo))
    # guarda el importe liquidado si la columna existe (migración 023)
    if hasattr(ddjj, "importe_liquidado"):
        ddjj.importe_liquidado = importe
        db.commit()
    return {"id_ddjj": id, "id_rubro": ddjj.id_rubro, "ingresos_declarados": float(base),
            "alicuota": float(alic.alicuota), "tributo_calculado": float(tributo),
            "minimo": float(alic.minimo), "importe_liquidado": float(importe)}
