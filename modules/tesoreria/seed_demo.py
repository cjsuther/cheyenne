"""
Seed de DEMO para el módulo Tesorería — LADO BANCARIO.
Puebla cuentas bancarias, chequeras + cheques, depósitos bancarios y
movimientos de caja para que las pantallas de banca se vean llenas.

Ejercicio de la demo: 2026. Idempotente (marcador DEMO).
    docker compose exec tesoreria python seed_demo.py
"""
import sys
import os
from datetime import date, datetime
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.egresos import CuentaBancaria, DepositoBancario, OrdenPago, Egreso
from models.banca import Chequera, Cheque
from models.movimiento_caja import MovimientoCaja
from models.caja import Caja
from models.caja_asignacion import CajaAsignacion
from models.tipo_movimiento import TipoMovimiento


# marcador de idempotencia: descripción de cuenta bancaria con prefijo DEMO
DEMO_TAG = "DEMO"

DEMO_CUENTAS = [
    # banco, numero, tipo, descripcion, cbu, saldo_inicial
    ("Banco de la Nación Argentina", "0210-4477/8", "cuenta corriente",
     "DEMO Cuenta Recaudación Municipal", "0110042230000447788012", Decimal("4500000.00")),
    ("Banco Provincia", "50012-9/33", "cuenta corriente",
     "DEMO Cuenta Pagos a Proveedores", "0140000801500129330015", Decimal("2800000.00")),
    ("Banco Credicoop", "191-002233/7", "caja de ahorro",
     "DEMO Fondo Rotatorio Obras", "1910191455000223370029", Decimal("1250000.00")),
    ("Banco Galicia", "9800-1 044-9", "cuenta corriente",
     "DEMO Cuenta Coparticipación", "0070044420000098001449", Decimal("6750000.00")),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── Idempotencia ────────────────────────────────────────────────
    ya = db.query(CuentaBancaria).filter(
        CuentaBancaria.descripcion.like(f"{DEMO_TAG}%")
    ).first()
    if ya:
        print("seed_demo tesoreria: ya sembrado, omito")
        db.close()
        return

    resumen = {
        "cuentas_bancarias": 0,
        "chequeras": 0,
        "cheques": 0,
        "depositos_bancarios": 0,
        "movimientos_caja": 0,
        "egresos": 0,
    }

    # ══════════════════════════════════════════════════════════════
    # 1) CUENTAS BANCARIAS
    # ══════════════════════════════════════════════════════════════
    cuentas = []
    try:
        for banco, numero, tipo, desc, cbu, saldo in DEMO_CUENTAS:
            # el modelo CuentaBancaria no tiene columna cbu -> lo dejamos en descripción
            desc_full = f"{desc} · CBU {cbu}"
            c = CuentaBancaria(
                banco=banco, numero=numero, tipo=tipo,
                descripcion=desc_full[:150], saldo_inicial=saldo, activo=True,
            )
            db.add(c)
            cuentas.append(c)
        db.flush()
        resumen["cuentas_bancarias"] = len(cuentas)
    except Exception as e:
        db.rollback()
        print(f"seed_demo tesoreria: ERROR cuentas_bancarias: {e}")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════
    # 2) CHEQUERAS (2) + CHEQUES (~40)
    #    Chequeras en las cuentas corrientes (0 y 1).
    # ══════════════════════════════════════════════════════════════
    beneficiarios_demo = [
        "Vialidad del Sur S.A.", "Constructora Andina S.R.L.", "Distribuidora Pampa S.A.",
        "Ferretería Central", "Insumos Médicos del Litoral S.A.", "Transporte Rivadavia S.R.L.",
        "Combustibles Cheyenne S.A.", "Papelera Municipal S.R.L.", "Servicios Verdes S.A.",
        "Electro Instalaciones Norte", "Aguas y Redes S.A.", "Cooperativa Obrera Ltda.",
    ]
    try:
        # Chequera 1: cuenta 0, numeración 12001..12030
        cq1 = Chequera(
            id_cuenta_bancaria=cuentas[0].id,
            descripcion="DEMO Chequera BNA 12001-12030",
            numero_desde=12001, numero_hasta=12030, proximo_numero=12021, activo=True,
        )
        # Chequera 2: cuenta 1, numeración 30501..30520
        cq2 = Chequera(
            id_cuenta_bancaria=cuentas[1].id,
            descripcion="DEMO Chequera BAPRO 30501-30520",
            numero_desde=30501, numero_hasta=30520, proximo_numero=30511, activo=True,
        )
        db.add_all([cq1, cq2])
        db.flush()
        resumen["chequeras"] = 2

        n_ben = len(beneficiarios_demo)
        # Chequera 1: 20 cheques emitidos (12001..12020), resto disponible (proximo=12021)
        for i in range(20):
            num = 12001 + i
            estado = "cobrado" if i < 12 else ("entregado" if i < 17 else "emitido")
            importe = Decimal("50000.00") + Decimal(str((i + 1) * 12500))
            emis = datetime(2026, 1 + (i % 6), 3 + (i % 20), 10, 0)
            ch = Cheque(
                id_cuenta_bancaria=cuentas[0].id, id_chequera=cq1.id,
                numero=str(num), importe=importe,
                beneficiario_nombre=beneficiarios_demo[i % n_ben],
                diferido=False, fecha_emision=emis, estado=estado,
                creado_por="tesoreria.demo", created_at=emis, activo=True,
            )
            db.add(ch)
            resumen["cheques"] += 1

        # Chequera 2: 20 cheques, algunos diferidos (30501..30520), proximo=30511
        for i in range(20):
            num = 30501 + i
            diferido = i >= 10
            if i < 10:
                estado = "cobrado" if i < 6 else "entregado"
                fpago = None
            else:
                estado = "emitido"
                fpago = date(2026, 4 + ((i - 10) % 4), 15)
            importe = Decimal("80000.00") + Decimal(str((i + 1) * 9800))
            emis = datetime(2026, 1 + (i % 5), 5 + (i % 15), 11, 30)
            ch = Cheque(
                id_cuenta_bancaria=cuentas[1].id, id_chequera=cq2.id,
                numero=str(num), importe=importe,
                beneficiario_nombre=beneficiarios_demo[(i + 3) % n_ben],
                diferido=diferido, fecha_emision=emis, fecha_pago=fpago,
                estado=estado, creado_por="tesoreria.demo", created_at=emis, activo=True,
            )
            db.add(ch)
            resumen["cheques"] += 1

        db.flush()
    except Exception as e:
        db.rollback()
        print(f"seed_demo tesoreria: ERROR cheques/chequeras: {e}")
        # ya se hizo flush de cuentas; intentamos continuar con lo commiteable
        # pero como flush falló, abortamos para no dejar estado inconsistente
        db.close()
        return

    # ══════════════════════════════════════════════════════════════
    # 3) DEPÓSITOS BANCARIOS (~12 créditos)
    # ══════════════════════════════════════════════════════════════
    try:
        depositos_data = [
            # (idx_cuenta, importe, concepto, origen, referencia, mes, dia)
            (0, Decimal("827500.00"), "DEMO Depósito recaudación ABL enero", "recaudacion", "DEMO-LOTE-2026-01", 1, 12),
            (0, Decimal("945300.00"), "DEMO Depósito recaudación ABL febrero", "recaudacion", "DEMO-LOTE-2026-02", 2, 11),
            (0, Decimal("612000.00"), "DEMO Depósito recaudación Automotor", "recaudacion", "DEMO-LOTE-2026-03", 3, 10),
            (0, Decimal("1200000.00"), "DEMO Transferencia coparticipación", "transferencia", "DEMO-COPART-2026-Q1", 3, 28),
            (1, Decimal("350000.00"), "DEMO Reintegro fondos no aplicados", "manual", "DEMO-REINT-001", 2, 20),
            (1, Decimal("480000.00"), "DEMO Depósito derechos de cementerio", "cementerio", "DEMO-CEM-2026-02", 2, 25),
            (2, Decimal("750000.00"), "DEMO Transferencia fondo obras FONID", "transferencia", "DEMO-OBRAS-2026-01", 1, 30),
            (2, Decimal("300000.00"), "DEMO Recupero apremios judiciales", "apremios", "DEMO-APR-2026-01", 3, 5),
            (3, Decimal("2100000.00"), "DEMO Coparticipación provincial marzo", "transferencia", "DEMO-COPART-2026-03", 3, 15),
            (3, Decimal("1850000.00"), "DEMO Coparticipación provincial abril", "transferencia", "DEMO-COPART-2026-04", 4, 15),
            (3, Decimal("560000.00"), "DEMO Depósito manual tesorería", "manual", "DEMO-MAN-2026-04", 4, 22),
            (0, Decimal("398750.00"), "DEMO Depósito recaudación ABL abril", "recaudacion", "DEMO-LOTE-2026-04", 4, 14),
        ]
        for idx, importe, concepto, origen, ref, mes, dia in depositos_data:
            d = DepositoBancario(
                id_cuenta_bancaria=cuentas[idx].id, importe=importe,
                concepto=concepto, origen=origen, referencia=ref,
                fecha=datetime(2026, mes, dia, 9, 0),
                usuario_nombre="tesoreria.demo", activo=True,
            )
            db.add(d)
            resumen["depositos_bancarios"] += 1
        db.flush()
    except Exception as e:
        db.rollback()
        print(f"seed_demo tesoreria: ERROR depositos_bancarios: {e}")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════
    # 4) EGRESOS (débitos por cheque) para que el ledger cierre
    #    Referencian OP existentes si hay; si no, egresos sueltos con OP demo.
    # ══════════════════════════════════════════════════════════════
    sp = db.begin_nested()
    try:
        ops_existentes = db.query(OrdenPago).order_by(OrdenPago.id).all()
        # 8 egresos por cheque contra cuentas corrientes
        egresos_cfg = [
            (0, "12001", Decimal("62500.00"), 1, 15),
            (0, "12002", Decimal("75000.00"), 1, 22),
            (0, "12003", Decimal("87500.00"), 2, 8),
            (0, "12004", Decimal("100000.00"), 2, 18),
            (1, "30501", Decimal("89800.00"), 1, 20),
            (1, "30502", Decimal("99600.00"), 2, 5),
            (1, "30503", Decimal("109400.00"), 2, 26),
            (1, "30504", Decimal("119200.00"), 3, 12),
        ]
        for i, (idx, nch, importe, mes, dia) in enumerate(egresos_cfg):
            id_op = ops_existentes[i % len(ops_existentes)].id if ops_existentes else None
            eg = Egreso(
                id_orden_pago=id_op if id_op is not None else 0,
                medio="cheque", id_cuenta_bancaria=cuentas[idx].id,
                numero_cheque=nch, importe=importe,
                fecha=datetime(2026, mes, dia, 12, 0),
                usuario_nombre="tesoreria.demo",
                observaciones="DEMO egreso bancario",
                activo=True,
            )
            db.add(eg)
            resumen["egresos"] += 1
        db.flush()
        sp.commit()
    except Exception as e:
        sp.rollback()
        resumen["egresos"] = 0
        print(f"seed_demo tesoreria: WARN egresos omitidos: {e}")

    # ══════════════════════════════════════════════════════════════
    # 5) MOVIMIENTOS DE CAJA (~15)
    #    Necesita anchors: Caja, CajaAsignacion, TipoMovimiento (del seed.py).
    # ══════════════════════════════════════════════════════════════
    sp2 = db.begin_nested()
    try:
        cajas = db.query(Caja).order_by(Caja.id).all()
        asignaciones = db.query(CajaAsignacion).order_by(CajaAsignacion.id).all()
        tipos = db.query(TipoMovimiento).order_by(TipoMovimiento.id).all()

        if cajas and asignaciones and tipos:
            tipo_ing = next((t for t in tipos if (t.tipo or "").lower() == "ingreso"), tipos[0])
            tipo_egr = next((t for t in tipos if (t.tipo or "").lower() == "egreso"), tipos[-1])

            conceptos = [
                "Cobro tasa ABL ventanilla", "Cobro derecho de cementerio",
                "Cobro habilitación comercial", "Cobro multa de tránsito",
                "Cobro sellado municipal", "Devolución cobro duplicado",
                "Ajuste arqueo positivo", "Cobro tasa seguridad e higiene",
            ]
            for i in range(16):
                asig = asignaciones[i % len(asignaciones)]
                # id_caja de la asignación cuando exista, si no, caja rotativa
                id_caja = asig.id_caja if getattr(asig, "id_caja", None) else cajas[i % len(cajas)].id
                es_egreso = i in (5, 11)  # un par de egresos/devoluciones
                tipo = tipo_egr if es_egreso else tipo_ing
                importe = Decimal("12000.00") + Decimal(str((i + 1) * 3450))
                mov = MovimientoCaja(
                    id_caja=id_caja,
                    id_caja_asignacion=asig.id,
                    id_tipo_movimiento_caja=tipo.id,
                    importe_cobro=importe,
                    fecha_cobro=datetime(2026, 1 + (i % 4), 2 + (i % 25), 10, 30),
                    observacion=f"DEMO {conceptos[i % len(conceptos)]}",
                )
                db.add(mov)
                resumen["movimientos_caja"] += 1
        else:
            print("seed_demo tesoreria: WARN sin anchors de caja/tipo_mov, "
                  "movimientos_caja omitidos (corré seed.py primero)")
        db.flush()
        sp2.commit()
    except Exception as e:
        sp2.rollback()
        resumen["movimientos_caja"] = 0
        print(f"seed_demo tesoreria: WARN movimientos_caja omitidos: {e}")

    db.commit()
    db.close()

    print(
        "seed_demo tesoreria: "
        f"+{resumen['cuentas_bancarias']} cuentas_bancarias, "
        f"+{resumen['chequeras']} chequeras, "
        f"+{resumen['cheques']} cheques, "
        f"+{resumen['depositos_bancarios']} depositos_bancarios, "
        f"+{resumen['egresos']} egresos, "
        f"+{resumen['movimientos_caja']} movimientos_caja"
    )


if __name__ == "__main__":
    seed()
