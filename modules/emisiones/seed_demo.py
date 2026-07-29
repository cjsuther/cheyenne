"""
Seed de DEMO para el módulo Emisiones.

Puebla la CUENTA CORRIENTE (libro mayor `emisiones_movimientos_ctacte`, hoy vacío)
para las cuentas_corrientes existentes: genera movimientos Debe/Haber coherentes
(DEBITOS por la emisión/comprobante, CREDITOS por pagos), dejando a ALGUNOS
contribuyentes con SALDO A FAVOR (crédito > débito) para poder demostrar la
compensación de saldos, y a otros con deuda pendiente. Ademas siembra
vencimientos_comprobante y coeficientes de mora.

El saldo NO se guarda: se DERIVA sumando débito − crédito de los movimientos
(ver services/cuenta_corriente_service.py). Por eso, para dejar saldo a favor a un
contribuyente, alcanza con que la suma de sus CREDITOS supere la de sus DEBITOS.

Ejecutar:
    docker compose exec emisiones python seed_demo.py

Idempotente: se detecta por movimientos con origen='demo'.
"""
import sys
import os
from datetime import date, datetime, timezone, timedelta
from decimal import Decimal, ROUND_HALF_UP

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.cuenta_corriente import CuentaCorriente
from models.movimiento_ctacte import MovimientoCtaCte
from models.comprobante import Comprobante
from models.vencimiento_comprobante import VencimientoComprobante
from models.coeficiente import Coeficiente
from models.pago_recibo import PagoRecibo


DEMO_ORIGEN = "demo"


def _q2(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _dt(y, m, d):
    return datetime(y, m, d, tzinfo=timezone.utc)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── Idempotencia ────────────────────────────────────────────────────
    ya = (
        db.query(MovimientoCtaCte)
        .filter(MovimientoCtaCte.origen == DEMO_ORIGEN)
        .first()
    )
    if ya:
        print("seed_demo emisiones: ya sembrado, omito")
        db.close()
        return

    resumen = {
        "movimientos": 0,
        "pago_recibos": 0,
        "vencimientos": 0,
        "coeficientes": 0,
        "saldo_a_favor": 0,
        "con_deuda": 0,
        "canceladas": 0,
    }

    # ── COEFICIENTES de mora (curva temporal) ───────────────────────────
    # Solo si la tabla está vacía; son globales (tipo_tributo NULL => todos).
    try:
        if not db.query(Coeficiente).filter(Coeficiente.activo == True).first():
            coefs = [
                Coeficiente(tipo_tributo=None, fecha_desde=_dt(2026, 1, 1),
                            fecha_hasta=_dt(2026, 3, 31), tipo="mensual",
                            valor=Decimal("3.000000"),
                            descripcion="DEMO recargo mora 1er trimestre 2026"),
                Coeficiente(tipo_tributo=None, fecha_desde=_dt(2026, 4, 1),
                            fecha_hasta=_dt(2026, 6, 30), tipo="mensual",
                            valor=Decimal("3.500000"),
                            descripcion="DEMO recargo mora 2do trimestre 2026"),
                Coeficiente(tipo_tributo=None, fecha_desde=_dt(2026, 7, 1),
                            fecha_hasta=None, tipo="mensual",
                            valor=Decimal("4.000000"),
                            descripcion="DEMO recargo mora 2do semestre 2026"),
            ]
            for c in coefs:
                db.add(c)
            db.flush()
            resumen["coeficientes"] += len(coefs)
    except Exception as e:
        db.rollback()
        print(f"seed_demo emisiones: coeficientes fallaron ({e}); continuo")

    # ── ANCHORS: cuentas corrientes existentes ──────────────────────────
    cuentas = (
        db.query(CuentaCorriente)
        .filter(CuentaCorriente.activo == True)
        .order_by(CuentaCorriente.id)
        .all()
    )

    if not cuentas:
        db.commit()
        db.close()
        print("seed_demo emisiones: no hay cuentas_corrientes existentes; "
              "no se generaron movimientos. "
              f"+{resumen['coeficientes']} coeficientes")
        return

    # Comprobantes existentes indexados por número, para anclar vencimientos.
    comprobantes = (
        db.query(Comprobante)
        .filter(Comprobante.activo == True)
        .all()
    )
    comp_por_numero = {}
    for cp in comprobantes:
        if cp.numero_comprobante:
            comp_por_numero.setdefault(cp.numero_comprobante, cp)

    # Fecha base de la demo
    hoy = _dt(2026, 6, 23)

    # ── MOVIMIENTOS por cuenta corriente ────────────────────────────────
    # Estrategia por índice de cuenta para repartir escenarios:
    #   idx % 5 == 0  -> saldo A FAVOR  (pago > deuda)
    #   idx % 5 == 1  -> CANCELADA      (pago == deuda)
    #   idx % 5 == 2  -> PARCIAL        (pago < deuda)
    #   idx % 5 == 3  -> deuda con MORA (vencida, sin pago)
    #   idx % 5 == 4  -> deuda vigente  (sin pago, no vencida)
    for idx, cc in enumerate(cuentas):
        try:
            monto = _q2(cc.monto_original if cc.monto_original is not None else cc.saldo)
            if monto <= 0:
                monto = Decimal("15000.00")

            # fecha del débito = vencimiento del concepto o base demo
            f_deb = cc.fecha_vencimiento or _dt(2026, 3, 10)
            if isinstance(f_deb, date) and not isinstance(f_deb, datetime):
                f_deb = datetime(f_deb.year, f_deb.month, f_deb.day, tzinfo=timezone.utc)

            escenario = idx % 5

            # DEBITO por la emisión/comprobante (deuda imputada)
            db.add(MovimientoCtaCte(
                id_cuenta_corriente=cc.id,
                id_contribuyente=cc.id_contribuyente,
                id_emision=cc.id_emision,
                tipo_tributo=cc.tipo_tributo,
                periodo=cc.periodo,
                cuota=cc.cuota,
                numero_comprobante=cc.numero_comprobante,
                fecha=f_deb,
                tipo="debito",
                concepto="emision",
                importe=monto,
                descripcion=(cc.concepto or f"Emisión {cc.tipo_tributo or ''} {cc.periodo or ''}").strip() + " [DEMO]",
                comprobante=cc.numero_comprobante,
                saldo_posterior=monto,
                origen=DEMO_ORIGEN,
                origen_modulo="demo",
                origen_ref=f"DEMO-DEB-{cc.id}",
                detalle={"demo": True, "escenario": escenario},
            ))
            resumen["movimientos"] += 1

            # CREDITO por pago según escenario
            credito = None
            f_pago = _dt(2026, 5, 15)
            recibo_num = None
            if escenario == 0:
                # saldo a favor: paga de más (p.ej. duplicó la boleta / anticipo)
                credito = _q2(monto + (monto * Decimal("0.25")))
                resumen["saldo_a_favor"] += 1
            elif escenario == 1:
                # cancelada
                credito = monto
                resumen["canceladas"] += 1
            elif escenario == 2:
                # parcial
                credito = _q2(monto * Decimal("0.40"))
                resumen["con_deuda"] += 1
            else:
                # escenarios 3 y 4: sin pago, quedan con deuda
                resumen["con_deuda"] += 1

            if credito and credito > 0:
                # recibo de pago
                recibo = PagoRecibo(
                    fecha_pago=f_pago,
                    id_contribuyente=cc.id_contribuyente,
                    id_cuenta_corriente=cc.id,
                    id_emision=cc.id_emision,
                    tipo_tributo=cc.tipo_tributo,
                    periodo=cc.periodo,
                    concepto=cc.concepto,
                    capital_pagado=min(credito, monto),
                    recargo_mora=Decimal("0.00"),
                    total_pagado=credito,
                    dias_mora=0,
                    estado_resultante="pagado" if credito >= monto else "parcial",
                )
                db.add(recibo)
                db.flush()
                recibo.numero_recibo = f"REC-DEMO-{recibo.id:06d}"
                recibo_num = recibo.numero_recibo
                resumen["pago_recibos"] += 1

                saldo_post = _q2(monto - credito)
                db.add(MovimientoCtaCte(
                    id_cuenta_corriente=cc.id,
                    id_contribuyente=cc.id_contribuyente,
                    id_emision=cc.id_emision,
                    tipo_tributo=cc.tipo_tributo,
                    periodo=cc.periodo,
                    cuota=cc.cuota,
                    numero_comprobante=cc.numero_comprobante,
                    fecha=f_pago,
                    tipo="credito",
                    concepto="pago",
                    importe=credito,
                    descripcion=f"Pago capital {cc.concepto or ''}".strip() + " [DEMO]",
                    comprobante=recibo_num,
                    saldo_posterior=saldo_post,
                    origen=DEMO_ORIGEN,
                    origen_modulo="demo",
                    origen_ref=f"DEMO-CRE-{cc.id}",
                    detalle={"demo": True, "escenario": escenario},
                ))
                resumen["movimientos"] += 1

                # Actualizar los campos-foto del concepto (monto_pagado/saldo/estado)
                capital = min(credito, monto)
                cc.monto_pagado = _q2((cc.monto_pagado or 0) + capital)
                cc.saldo = _q2(monto - cc.monto_pagado)
                cc.estado = "pagado" if cc.saldo <= 0 else "parcial"

        except Exception as e:
            db.rollback()
            print(f"seed_demo emisiones: cuenta {cc.id} falló ({e}); continuo")
            # re-abrir sesión limpia para seguir
            continue

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"seed_demo emisiones: commit de movimientos falló ({e})")

    # ── VENCIMIENTOS de comprobante ─────────────────────────────────────
    # Escalera de 2 vencimientos (1er y 2do) por comprobante existente.
    try:
        if not db.query(VencimientoComprobante).filter(
                VencimientoComprobante.activo == True).first():
            objetivo = comprobantes[:20] if comprobantes else []
            for cp in objetivo:
                base = _q2(cp.importe_total or cp.importe_a_cancelar or Decimal("15000.00"))
                if base <= 0:
                    base = Decimal("15000.00")
                fv1 = cp.fecha_emision or _dt(2026, 3, 1)
                if isinstance(fv1, date) and not isinstance(fv1, datetime):
                    fv1 = datetime(fv1.year, fv1.month, fv1.day, tzinfo=timezone.utc)
                fv2 = fv1 + timedelta(days=15)
                db.add(VencimientoComprobante(
                    id_comprobante=cp.id, id_emision=cp.id_emision, numero=1,
                    fecha_vencimiento=fv1, importe=base, tipo="aPagar",
                ))
                db.add(VencimientoComprobante(
                    id_comprobante=cp.id, id_emision=cp.id_emision, numero=2,
                    fecha_vencimiento=fv2, importe=_q2(base * Decimal("1.10")),
                    tipo="aPagar",
                ))
                resumen["vencimientos"] += 2
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"seed_demo emisiones: vencimientos fallaron ({e}); continuo")

    db.close()

    print(
        "seed_demo emisiones: "
        f"+{resumen['movimientos']} movimientos_ctacte, "
        f"+{resumen['pago_recibos']} pago_recibos, "
        f"+{resumen['vencimientos']} vencimientos_comprobante, "
        f"+{resumen['coeficientes']} coeficientes "
        f"| {resumen['saldo_a_favor']} ctas con SALDO A FAVOR, "
        f"{resumen['canceladas']} canceladas, "
        f"{resumen['con_deuda']} con deuda "
        f"(sobre {len(cuentas)} cuentas_corrientes)"
    )


if __name__ == "__main__":
    seed()
