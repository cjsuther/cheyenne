import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from database import get_db
from models.patrimonio import Bien, MovimientoBien
from .bienes import get_current_user, _requiere, _quien, _dec, postear_contab, CERO

amortizacion_router = APIRouter(prefix="/amortizacion", tags=["Amortización"])


def _cuota_mensual(b: Bien):
    """Amortización lineal mensual = (valor_origen - valor_residual) / vida_util_meses."""
    if not b.vida_util_meses or b.vida_util_meses <= 0:
        return CERO
    base = _dec(b.valor_origen) - _dec(b.valor_residual)
    if base <= 0:
        return CERO
    return (base / Decimal(b.vida_util_meses)).quantize(Decimal("0.01"))


@amortizacion_router.get("/preview")
def preview(periodo: str = Query(..., description="YYYY-MM"),
            db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Previsualiza la amortización del período sin registrarla."""
    _requiere(current_user, "patrimonio_read")
    bienes = db.query(Bien).filter(Bien.activo == True, Bien.estado == "alta", Bien.vida_util_meses > 0).all()
    filas = []
    total = CERO
    for b in bienes:
        ya = db.query(MovimientoBien).filter(
            MovimientoBien.id_bien == b.id, MovimientoBien.tipo == "amortizacion",
            MovimientoBien.periodo == periodo).first()
        if ya:
            continue
        cuota = _cuota_mensual(b)
        # no amortizar por debajo del valor residual
        restante = _dec(b.valor_origen) - _dec(b.valor_residual) - _dec(b.amortizacion_acumulada)
        cuota = min(cuota, max(restante, CERO))
        if cuota <= 0:
            continue
        total += cuota
        filas.append({"id_bien": b.id, "codigo": b.codigo, "denominacion": b.denominacion,
                      "cuota": float(cuota), "amortizacion_acumulada": float(b.amortizacion_acumulada)})
    return {"periodo": periodo, "cantidad": len(filas), "total": float(total), "bienes": filas}


@amortizacion_router.post("/correr")
def correr(request: Request, data: dict = Body(...), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    """Registra la amortización lineal del período para todos los bienes amortizables.
    Idempotente por (bien, período). Postea un asiento consolidado al contable."""
    _requiere(current_user, "patrimonio_amortizar")
    periodo = (data.get("periodo") or "").strip()
    if len(periodo) != 7 or periodo[4] != "-":
        raise HTTPException(status_code=400, detail="Período inválido; use 'YYYY-MM'")
    bienes = db.query(Bien).filter(Bien.activo == True, Bien.estado == "alta", Bien.vida_util_meses > 0).all()
    total = CERO
    n = 0
    for b in bienes:
        ya = db.query(MovimientoBien).filter(
            MovimientoBien.id_bien == b.id, MovimientoBien.tipo == "amortizacion",
            MovimientoBien.periodo == periodo).first()
        if ya:
            continue
        cuota = _cuota_mensual(b)
        restante = _dec(b.valor_origen) - _dec(b.valor_residual) - _dec(b.amortizacion_acumulada)
        cuota = min(cuota, max(restante, CERO))
        if cuota <= 0:
            continue
        b.amortizacion_acumulada = _dec(b.amortizacion_acumulada) + cuota
        db.add(MovimientoBien(id_bien=b.id, tipo="amortizacion", periodo=periodo, importe=cuota,
                              detalle=f"Amortización {periodo}", usuario_nombre=_quien(current_user)))
        total += cuota
        n += 1
    db.commit()
    if total > 0:
        postear_contab("patrimonio.amortizacion", f"amort-{periodo}", total,
                       f"Amortización del período {periodo} ({n} bienes)",
                       {"periodo": periodo, "cantidad": n}, request.headers.get("authorization"))
    return {"periodo": periodo, "bienes_amortizados": n, "total": float(total)}
