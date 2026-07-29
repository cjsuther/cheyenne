from typing import Dict, Any, List, Optional
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone, date

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from config import get_settings
from models.coeficiente import Coeficiente


def _q2(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _as_date(v) -> Optional[date]:
    if v is None:
        return None
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, date):
        return v
    if isinstance(v, str) and v:
        try:
            return date.fromisoformat(v[:10])
        except ValueError:
            return None
    return None


class CoeficienteService:
    """ABM de la curva de coeficientes y cálculo de recargo por mora recorriéndola."""

    def __init__(self, db: Session):
        self.db = db

    # ── ABM ─────────────────────────────────────────────────────────────
    def listar(self, tipo_tributo: Optional[str] = None, activo: Optional[bool] = True):
        q = self.db.query(Coeficiente)
        if activo is not None:
            q = q.filter(Coeficiente.activo == activo)
        if tipo_tributo is not None:
            q = q.filter(Coeficiente.tipo_tributo == tipo_tributo)
        return q.order_by(Coeficiente.fecha_desde).all()

    def crear(self, data: dict) -> Coeficiente:
        fd = _as_date(data.get("fecha_desde"))
        if not fd:
            raise HTTPException(status_code=400, detail="fecha_desde es obligatoria")
        fh = _as_date(data.get("fecha_hasta"))
        tipo = (data.get("tipo") or "mensual").lower()
        if tipo not in ("mensual", "diario"):
            raise HTTPException(status_code=400, detail="tipo debe ser 'mensual' o 'diario'")
        coef = Coeficiente(
            tipo_tributo=data.get("tipo_tributo"),
            fecha_desde=datetime(fd.year, fd.month, fd.day, tzinfo=timezone.utc),
            fecha_hasta=datetime(fh.year, fh.month, fh.day, tzinfo=timezone.utc) if fh else None,
            tipo=tipo,
            valor=Decimal(str(data.get("valor") or 0)),
            descripcion=data.get("descripcion"),
        )
        self.db.add(coef)
        self.db.commit()
        self.db.refresh(coef)
        return coef

    def actualizar(self, id_coef: int, data: dict) -> Coeficiente:
        coef = self.db.query(Coeficiente).filter(Coeficiente.id == id_coef).first()
        if not coef:
            raise HTTPException(status_code=404, detail=f"Coeficiente {id_coef} no encontrado")
        if "tipo_tributo" in data:
            coef.tipo_tributo = data["tipo_tributo"]
        if "fecha_desde" in data and data["fecha_desde"]:
            fd = _as_date(data["fecha_desde"])
            coef.fecha_desde = datetime(fd.year, fd.month, fd.day, tzinfo=timezone.utc)
        if "fecha_hasta" in data:
            fh = _as_date(data["fecha_hasta"])
            coef.fecha_hasta = datetime(fh.year, fh.month, fh.day, tzinfo=timezone.utc) if fh else None
        if "tipo" in data and data["tipo"]:
            t = data["tipo"].lower()
            if t not in ("mensual", "diario"):
                raise HTTPException(status_code=400, detail="tipo debe ser 'mensual' o 'diario'")
            coef.tipo = t
        if "valor" in data and data["valor"] is not None:
            coef.valor = Decimal(str(data["valor"]))
        if "descripcion" in data:
            coef.descripcion = data["descripcion"]
        if "activo" in data and data["activo"] is not None:
            coef.activo = bool(data["activo"])
        self.db.commit()
        self.db.refresh(coef)
        return coef

    def eliminar(self, id_coef: int):
        coef = self.db.query(Coeficiente).filter(Coeficiente.id == id_coef).first()
        if not coef:
            raise HTTPException(status_code=404, detail=f"Coeficiente {id_coef} no encontrado")
        coef.activo = False
        self.db.commit()

    # ── Cálculo de recargo recorriendo la curva ─────────────────────────
    def _curva(self, tipo_tributo: Optional[str]) -> List[Coeficiente]:
        q = self.db.query(Coeficiente).filter(Coeficiente.activo == True)
        coefs = q.order_by(Coeficiente.fecha_desde).all()
        # aplica los del tributo + los genéricos (tipo_tributo NULL)
        return [c for c in coefs if c.tipo_tributo in (None, tipo_tributo)]

    def calcular_recargo(self, saldo, fecha_vencimiento, fecha_corte=None,
                         tipo_tributo: Optional[str] = None) -> Dict[str, Any]:
        """Recargo por mora acumulando la curva de coeficientes tramo a tramo.

        Recorre desde el vencimiento hasta la fecha de corte y por cada tramo de
        coeficiente vigente aplica su porcentaje sobre el saldo, prorrateado por
        los días efectivos del tramo (mensual = /30, diario = por día).
        Si no hay curva cargada, cae al % plano configurado (compatibilidad).
        """
        saldo = _q2(saldo)
        corte = _as_date(fecha_corte) or datetime.now(timezone.utc).date()
        venc = _as_date(fecha_vencimiento)
        if not venc or saldo <= 0 or corte <= venc:
            dias = (corte - venc).days if venc else 0
            return {"dias_mora": max(dias, 0), "recargo": _q2(0),
                    "total_a_pagar": saldo, "tramos": []}

        dias_totales = (corte - venc).days
        curva = self._curva(tipo_tributo)

        if not curva:
            # fallback: % plano mensual configurado
            tasa = Decimal(str(get_settings().mora_tasa_mensual_pct)) / Decimal("100")
            recargo = _q2(saldo * tasa * Decimal(dias_totales) / Decimal("30"))
            return {"dias_mora": dias_totales, "recargo": recargo,
                    "total_a_pagar": _q2(saldo + recargo),
                    "tramos": [{"origen": "fallback_plano", "dias": dias_totales,
                                "valor": float(get_settings().mora_tasa_mensual_pct),
                                "tipo": "mensual", "recargo": float(recargo)}]}

        recargo_total = Decimal("0")
        tramos = []
        cursor = venc
        while cursor < corte:
            # coeficiente vigente para 'cursor'
            vigente = None
            for c in curva:
                cd = _as_date(c.fecha_desde)
                ch = _as_date(c.fecha_hasta)
                if cd and cursor >= cd and (ch is None or cursor < ch):
                    vigente = c  # el último que matchea (orden por fecha_desde) gana
            # fin de este tramo = min(corte, próxima fecha_hasta del vigente o próximo fecha_desde)
            fin_tramo = corte
            if vigente and _as_date(vigente.fecha_hasta) and _as_date(vigente.fecha_hasta) < fin_tramo:
                fin_tramo = _as_date(vigente.fecha_hasta)
            for c in curva:
                cd = _as_date(c.fecha_desde)
                if cd and cursor < cd < fin_tramo:
                    fin_tramo = cd
            dias_tramo = (fin_tramo - cursor).days
            if dias_tramo <= 0:
                cursor = fin_tramo
                continue
            if vigente:
                valor = Decimal(str(vigente.valor)) / Decimal("100")
                if vigente.tipo == "diario":
                    r = saldo * valor * Decimal(dias_tramo)
                else:  # mensual
                    r = saldo * valor * Decimal(dias_tramo) / Decimal("30")
                r = _q2(r)
                recargo_total += r
                tramos.append({
                    "desde": cursor.isoformat(), "hasta": fin_tramo.isoformat(),
                    "dias": dias_tramo, "tipo": vigente.tipo,
                    "valor": float(vigente.valor), "recargo": float(r),
                    "id_coeficiente": vigente.id,
                })
            cursor = fin_tramo

        recargo_total = _q2(recargo_total)
        return {"dias_mora": dias_totales, "recargo": recargo_total,
                "total_a_pagar": _q2(saldo + recargo_total), "tramos": tramos}
