from typing import Dict, Any, List, Optional
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timezone, date

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from sqlalchemy import func

from config import get_settings
from models.emision import Emision
from models.liquidacion import Liquidacion
from models.cuenta_corriente import CuentaCorriente
from models.pago_recibo import PagoRecibo
from models.movimiento_ctacte import MovimientoCtaCte
from services.coeficiente_service import CoeficienteService


def _q2(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class CuentaCorrienteService:
    def __init__(self, db: Session):
        self.db = db

    def generar_cuentas_corrientes(self, id_emision: int) -> Dict[str, Any]:
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")

        liquidaciones = self.db.query(Liquidacion).filter(
            Liquidacion.id_emision == id_emision,
            Liquidacion.activo == True,
        ).all()

        # idempotente: limpiar lo previo de esta emisión antes de regenerar
        # (también los movimientos-débito de esta emisión, que se regeneran)
        self.db.query(CuentaCorriente).filter(CuentaCorriente.id_emision == id_emision).delete()
        self.db.query(MovimientoCtaCte).filter(
            MovimientoCtaCte.id_emision == id_emision,
            MovimientoCtaCte.concepto == "emision",
        ).delete()

        cuentas_creadas = 0
        total_deuda = 0
        for liq in liquidaciones:
            # la deuda imputada a la cuenta corriente es `a_cancelar` (no a_pagar, que ya
            # incluye el descuento por pago anticipado del recibo)
            deuda = liq.a_cancelar if liq.a_cancelar is not None else (liq.monto_final or 0)
            if not deuda:
                continue
            concepto_txt = f"Emision {emision.tipo_tributo} {emision.periodo} - tasa {liq.id_tasa or ''} vto {liq.numero_vencimiento or ''}"
            cuenta = CuentaCorriente(
                id_emision=id_emision,
                id_contribuyente=liq.id_contribuyente,
                id_objeto_imponible=liq.id_objeto_imponible,
                id_liquidacion=liq.id,
                tipo_tributo=liq.tipo,
                periodo=liq.periodo,
                cuota=liq.cuota,
                concepto=concepto_txt,
                monto_original=deuda,
                monto_pagado=0,
                saldo=deuda,
                fecha_vencimiento=liq.fecha_vencimiento_1,
                estado="pendiente",
                numero_comprobante=liq.numero_comprobante,
            )
            self.db.add(cuenta)
            self.db.flush()  # necesitamos cuenta.id para anclar el movimiento
            # LIBRO MAYOR: la emisión genera un DEBITO inmutable
            self._agregar_movimiento(
                cuenta, tipo="debito", concepto="emision", importe=_q2(deuda),
                fecha=liq.fecha_vencimiento_1 or datetime.now(timezone.utc),
                descripcion=concepto_txt, comprobante=liq.numero_comprobante,
                origen="emision", saldo_posterior=_q2(deuda),
            )
            cuentas_creadas += 1
            total_deuda += float(deuda)

        self.db.commit()
        return {"cuentas_creadas": cuentas_creadas, "total_deuda": round(total_deuda, 2)}

    # ── Libro mayor (movimientos inmutables) ─────────────────────────────
    def _agregar_movimiento(self, cc: CuentaCorriente, tipo: str, concepto: str,
                            importe, fecha=None, descripcion=None, comprobante=None,
                            origen=None, origen_modulo=None, origen_ref=None,
                            saldo_posterior=None, detalle=None) -> MovimientoCtaCte:
        """Inserta un movimiento INMUTABLE en el libro mayor del contribuyente."""
        if isinstance(fecha, date) and not isinstance(fecha, datetime):
            fecha = datetime(fecha.year, fecha.month, fecha.day, tzinfo=timezone.utc)
        mov = MovimientoCtaCte(
            id_cuenta_corriente=cc.id,
            id_contribuyente=cc.id_contribuyente,
            id_emision=cc.id_emision,
            tipo_tributo=cc.tipo_tributo,
            periodo=cc.periodo,
            cuota=cc.cuota,
            numero_comprobante=cc.numero_comprobante,
            fecha=fecha or datetime.now(timezone.utc),
            tipo=tipo,
            concepto=concepto,
            importe=_q2(importe),
            descripcion=descripcion or cc.concepto,
            comprobante=comprobante,
            saldo_posterior=_q2(saldo_posterior) if saldo_posterior is not None else None,
            origen=origen,
            origen_modulo=origen_modulo,
            origen_ref=origen_ref,
            detalle=detalle,
        )
        self.db.add(mov)
        return mov

    def saldo_por_cuenta(self, id_cc: int) -> Decimal:
        """Saldo DERIVADO del libro mayor: Σ débitos − Σ créditos del concepto."""
        rows = (
            self.db.query(MovimientoCtaCte.tipo, func.coalesce(func.sum(MovimientoCtaCte.importe), 0))
            .filter(MovimientoCtaCte.id_cuenta_corriente == id_cc,
                    MovimientoCtaCte.activo == True)
            .group_by(MovimientoCtaCte.tipo)
            .all()
        )
        debito = credito = Decimal("0")
        for tipo, total in rows:
            if tipo == "debito":
                debito = Decimal(str(total or 0))
            elif tipo == "credito":
                credito = Decimal(str(total or 0))
        return _q2(debito - credito)

    def movimientos_de_contribuyente(self, id_contribuyente: int, id_cc: int = None) -> Dict[str, Any]:
        """Extracto (libro mayor) del contribuyente: movimientos Debe/Haber con saldo corrido."""
        q = self.db.query(MovimientoCtaCte).filter(
            MovimientoCtaCte.id_contribuyente == id_contribuyente,
            MovimientoCtaCte.activo == True,
        )
        if id_cc is not None:
            q = q.filter(MovimientoCtaCte.id_cuenta_corriente == id_cc)
        movs = q.order_by(MovimientoCtaCte.fecha, MovimientoCtaCte.id).all()
        saldo = Decimal("0")
        total_debe = Decimal("0")
        total_haber = Decimal("0")
        out = []
        for m in movs:
            imp = _q2(m.importe)
            if m.tipo == "debito":
                saldo += imp
                total_debe += imp
                debe, haber = float(imp), 0.0
            else:
                saldo -= imp
                total_haber += imp
                debe, haber = 0.0, float(imp)
            out.append({
                "id": m.id,
                "id_cuenta_corriente": m.id_cuenta_corriente,
                "fecha": m.fecha.isoformat() if m.fecha else None,
                "tipo": m.tipo,
                "concepto": m.concepto,
                "descripcion": m.descripcion,
                "comprobante": m.comprobante or m.numero_comprobante,
                "tipo_tributo": m.tipo_tributo,
                "periodo": m.periodo,
                "debe": debe,
                "haber": haber,
                "saldo": float(_q2(saldo)),
                "origen": m.origen,
            })
        return {
            "id_contribuyente": id_contribuyente,
            "total_debe": float(_q2(total_debe)),
            "total_haber": float(_q2(total_haber)),
            "saldo": float(_q2(saldo)),
            "movimientos": out,
        }

    # ── Mora y cobranza ──────────────────────────────────────────────────
    def _hoy(self) -> date:
        return datetime.now(timezone.utc).date()

    def calcular_recargo(self, saldo, fecha_vencimiento, fecha=None,
                         tipo_tributo=None) -> Dict[str, Any]:
        """Recargo por mora recorriendo la curva temporal de coeficientes.

        Delega en CoeficienteService, que acumula tramo a tramo según la fecha de
        corte. Si no hay curva cargada cae al % plano configurado.
        """
        return CoeficienteService(self.db).calcular_recargo(
            saldo, fecha_vencimiento, fecha, tipo_tributo
        )

    def deuda_de_contribuyente(self, id_contribuyente: int, solo_deuda: bool = True) -> List[Dict[str, Any]]:
        q = self.db.query(CuentaCorriente).filter(
            CuentaCorriente.id_contribuyente == id_contribuyente,
            CuentaCorriente.activo == True,
        )
        if solo_deuda:
            q = q.filter(CuentaCorriente.saldo > 0)
        filas = q.order_by(CuentaCorriente.fecha_vencimiento).all()
        out = []
        for c in filas:
            mora = self.calcular_recargo(c.saldo, c.fecha_vencimiento, tipo_tributo=c.tipo_tributo)
            d = {col.name: getattr(c, col.name) for col in CuentaCorriente.__table__.columns}
            d.update({k: mora[k] for k in ("dias_mora", "recargo", "total_a_pagar")})
            out.append(d)
        return out

    def pagar_por_comprobante(self, numero_comprobante: str, importe, fecha_pago=None,
                              origen_modulo=None, origen_ref=None) -> Dict[str, Any]:
        """Aplica un cobro (p. ej. desde Tesorería/WAV) a la deuda de un comprobante.

        Reparte el importe entre las cuotas pendientes del comprobante, de la más
        antigua a la más nueva. Devuelve los recibos generados y el sobrante no imputado.

        Idempotencia: si se envían origen_modulo + origen_ref y ya existe un
        movimiento con esa clave, se devuelve el resultado previo sin re-imputar.
        """
        if not numero_comprobante:
            raise HTTPException(status_code=400, detail="numero_comprobante es obligatorio")
        importe = _q2(importe)
        if importe <= 0:
            raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
        if origen_modulo and origen_ref:
            ya = (
                self.db.query(MovimientoCtaCte)
                .filter(MovimientoCtaCte.origen_modulo == origen_modulo,
                        MovimientoCtaCte.origen_ref == origen_ref,
                        MovimientoCtaCte.tipo == "credito",
                        MovimientoCtaCte.concepto == "pago",
                        MovimientoCtaCte.activo == True)
                .first()
            )
            if ya:
                return {
                    "numero_comprobante": numero_comprobante,
                    "aplicado": 0.0, "sobrante": float(importe),
                    "recibos": [], "idempotente": True,
                    "detalle": "Pago ya registrado para esta referencia de origen",
                }
        filas = (
            self.db.query(CuentaCorriente)
            .filter(
                CuentaCorriente.numero_comprobante == numero_comprobante,
                CuentaCorriente.activo == True,
                CuentaCorriente.saldo > 0,
            )
            .order_by(CuentaCorriente.fecha_vencimiento)
            .all()
        )
        if not filas:
            raise HTTPException(
                status_code=404,
                detail=f"No hay deuda pendiente para el comprobante {numero_comprobante}",
            )
        restante = importe
        recibos = []
        for cc in filas:
            if restante <= 0:
                break
            pagar = min(restante, _q2(cc.saldo))
            recibos.append(self.registrar_pago(cc.id, pagar, fecha_pago,
                                               origen_modulo=origen_modulo, origen_ref=origen_ref))
            restante = _q2(restante - pagar)
            origen_ref = None  # la clave de idempotencia se asocia al primer movimiento
        return {
            "numero_comprobante": numero_comprobante,
            "aplicado": float(_q2(importe - restante)),
            "sobrante": float(restante),
            "recibos": recibos,
        }

    def registrar_pago(self, id_cc: int, importe, fecha_pago=None,
                       origen_modulo=None, origen_ref=None) -> Dict[str, Any]:
        cc = self.db.query(CuentaCorriente).filter(
            CuentaCorriente.id == id_cc, CuentaCorriente.activo == True
        ).first()
        if not cc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Concepto {id_cc} no encontrado")
        saldo = _q2(cc.saldo)
        if saldo <= 0:
            raise HTTPException(status_code=400, detail="El concepto ya está cancelado")
        importe = _q2(importe)
        if importe <= 0:
            raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")

        fecha = fecha_pago or self._hoy()
        mora = self.calcular_recargo(saldo, cc.fecha_vencimiento, fecha, tipo_tributo=cc.tipo_tributo)
        capital_pagado = min(importe, saldo)  # lo que reduce el capital de la cuenta corriente
        cc.monto_pagado = _q2(_q2(cc.monto_pagado) + capital_pagado)
        cc.saldo = _q2(_q2(cc.monto_original) - cc.monto_pagado)
        cc.estado = "pagado" if cc.saldo <= 0 else "parcial"

        # LIBRO MAYOR: el pago genera un CREDITO inmutable por el capital cancelado.
        # El recargo de mora se registra como DEBITO de interés + su CREDITO (neto 0
        # sobre el capital pero deja traza del interés cobrado en el extracto).
        saldo_derivado = _q2(saldo - capital_pagado)
        if mora["recargo"] and mora["recargo"] > 0:
            self._agregar_movimiento(
                cc, tipo="debito", concepto="interes", importe=mora["recargo"],
                fecha=fecha, descripcion=f"Interés por mora ({mora['dias_mora']} días)",
                origen="pago", detalle={"dias_mora": mora["dias_mora"]},
            )
            self._agregar_movimiento(
                cc, tipo="credito", concepto="interes", importe=mora["recargo"],
                fecha=fecha, descripcion="Pago interés por mora", origen="pago",
            )
        mov_pago = self._agregar_movimiento(
            cc, tipo="credito", concepto="pago", importe=capital_pagado,
            fecha=fecha, descripcion=f"Pago capital {cc.concepto or ''}".strip(),
            origen=origen_modulo or "pago", origen_modulo=origen_modulo, origen_ref=origen_ref,
            saldo_posterior=saldo_derivado,
        )

        historial = list(cc.historial_pagos or [])
        historial.append({
            "fecha": fecha.isoformat(),
            "importe": float(importe),
            "capital_pagado": float(capital_pagado),
            "recargo_mora": float(mora["recargo"]),
            "dias_mora": mora["dias_mora"],
            "saldo_resultante": float(cc.saldo),
        })
        cc.historial_pagos = historial

        # comprobante del pago
        total_pagado = _q2(capital_pagado + mora["recargo"])
        recibo = PagoRecibo(
            fecha_pago=datetime.combine(fecha, datetime.min.time(), tzinfo=timezone.utc),
            id_contribuyente=cc.id_contribuyente,
            id_cuenta_corriente=cc.id,
            id_emision=cc.id_emision,
            tipo_tributo=cc.tipo_tributo,
            periodo=cc.periodo,
            concepto=cc.concepto,
            capital_pagado=capital_pagado,
            recargo_mora=mora["recargo"],
            total_pagado=total_pagado,
            dias_mora=mora["dias_mora"],
            estado_resultante=cc.estado,
        )
        self.db.add(recibo)
        self.db.flush()
        recibo.numero_recibo = f"REC-{recibo.id:08d}"
        mov_pago.comprobante = recibo.numero_recibo  # traza recibo↔movimiento en el libro mayor
        self.db.commit()
        self.db.refresh(cc)
        return {
            "id": cc.id,
            "estado": cc.estado,
            "capital_pagado": float(capital_pagado),
            "recargo_mora": float(mora["recargo"]),
            "saldo": float(cc.saldo),
            "numero_recibo": recibo.numero_recibo,
            "total_pagado": float(total_pagado),
        }
