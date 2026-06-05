"""
Seed de datos para el módulo Tesorería.
Ejecutar DESPUÉS de los seeds de administracion e ingresos_publicos.
    docker compose exec tesoreria python seed.py
"""
import sys
import os
from datetime import date, datetime
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.lista import Lista
from models.dependencia import Dependencia
from models.recaudadora import Recaudadora
from models.caja import Caja
from models.caja_asignacion import CajaAsignacion
from models.recaudacion_lote import RecaudacionLote
from models.recaudacion import Recaudacion
from models.recibo_publicacion_lote import ReciboPublicacionLote
from models.recibo_publicacion import ReciboPublicacion
from models.pago_rendicion_lote import PagoRendicionLote
from models.pago_rendicion import PagoRendicion
from models.registro_contable_lote import RegistroContableLote
from models.registro_contable import RegistroContable
from models.tipo_movimiento import TipoMovimiento
from models.configuracion import Configuracion


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Lista).first():
        print("Ya existen datos en tesoreria. Seed omitido.")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════════
    # LISTAS
    # ══════════════════════════════════════════════════════════════════
    listas = [
        Lista(codigo="CAJA_ABIERTA", tipo="estado_caja", nombre="Abierta", orden=1),
        Lista(codigo="CAJA_CERRADA", tipo="estado_caja", nombre="Cerrada", orden=2),
        Lista(codigo="CAJA_SUSPENDIDA", tipo="estado_caja", nombre="Suspendida", orden=3),
        Lista(codigo="LOTE_PENDIENTE", tipo="estado_lote", nombre="Pendiente", orden=1),
        Lista(codigo="LOTE_PROCESADO", tipo="estado_lote", nombre="Procesado", orden=2),
        Lista(codigo="LOTE_CONFIRMADO", tipo="estado_lote", nombre="Confirmado", orden=3),
        Lista(codigo="LOTE_ANULADO", tipo="estado_lote", nombre="Anulado", orden=4),
        Lista(codigo="ORIG_VENTANILLA", tipo="origen_recaudacion", nombre="Ventanilla", orden=1),
        Lista(codigo="ORIG_BANCO", tipo="origen_recaudacion", nombre="Banco", orden=2),
        Lista(codigo="ORIG_ONLINE", tipo="origen_recaudacion", nombre="Online", orden=3),
        Lista(codigo="ORIG_DEBITO", tipo="origen_recaudacion", nombre="Débito Automático", orden=4),
        Lista(codigo="LP_MUNICIPIO", tipo="lugar_pago", nombre="Municipio", orden=1),
        Lista(codigo="LP_BANCO", tipo="lugar_pago", nombre="Banco", orden=2),
        Lista(codigo="LP_RAPIPAGO", tipo="lugar_pago", nombre="Rapipago", orden=3),
        Lista(codigo="LP_PAGOFACIL", tipo="lugar_pago", nombre="Pago Fácil", orden=4),
        Lista(codigo="LP_ONLINE", tipo="lugar_pago", nombre="Online", orden=5),
        Lista(codigo="FP_EFECTIVO", tipo="forma_pago", nombre="Efectivo", orden=1),
        Lista(codigo="FP_TRANSFERENCIA", tipo="forma_pago", nombre="Transferencia", orden=2),
        Lista(codigo="FP_CHEQUE", tipo="forma_pago", nombre="Cheque", orden=3),
        Lista(codigo="FP_TARJETA", tipo="forma_pago", nombre="Tarjeta", orden=4),
        Lista(codigo="MI_MANUAL", tipo="metodo_importacion", nombre="Manual", orden=1),
        Lista(codigo="MI_ARCHIVO", tipo="metodo_importacion", nombre="Archivo", orden=2),
        Lista(codigo="MI_API", tipo="metodo_importacion", nombre="API", orden=3),
    ]
    for i, l in enumerate(listas):
        l.id = i + 1
        db.add(l)
    db.flush()

    est_caja = {l.codigo: l.id for l in listas if l.tipo == "estado_caja"}
    orig_rec = {l.codigo: l.id for l in listas if l.tipo == "origen_recaudacion"}

    # ══════════════════════════════════════════════════════════════════
    # DEPENDENCIAS
    # ══════════════════════════════════════════════════════════════════
    dependencias = [
        Dependencia(codigo="TES_CENTRAL", nombre="Tesorería Central", orden=1),
        Dependencia(codigo="TES_SUC1", nombre="Sucursal Norte", orden=2),
        Dependencia(codigo="TES_SUC2", nombre="Sucursal Sur", orden=3),
        Dependencia(codigo="TES_ONLINE", nombre="Recaudación Online", orden=4),
    ]
    for d in dependencias:
        db.add(d)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # RECAUDADORAS
    # ══════════════════════════════════════════════════════════════════
    recaudadoras = [
        Recaudadora(codigo="BNA", nombre="Banco Nación", orden=1, codigo_cliente="MUN001"),
        Recaudadora(codigo="BPBA", nombre="Banco Provincia", orden=2, codigo_cliente="MUN002"),
        Recaudadora(codigo="RAPIPAGO", nombre="Rapipago", orden=3, codigo_cliente="MUN003"),
        Recaudadora(codigo="PAGOFACIL", nombre="Pago Fácil", orden=4, codigo_cliente="MUN004"),
        Recaudadora(codigo="MP", nombre="Mercado Pago", orden=5, codigo_cliente="MUN005"),
    ]
    for r in recaudadoras:
        db.add(r)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CAJAS
    # ══════════════════════════════════════════════════════════════════
    cajas = [
        Caja(codigo="CAJA-01", nombre="Caja Principal", orden=1, id_dependencia=dependencias[0].id, id_estado_caja=est_caja["CAJA_ABIERTA"]),
        Caja(codigo="CAJA-02", nombre="Caja Secundaria", orden=2, id_dependencia=dependencias[0].id, id_estado_caja=est_caja["CAJA_ABIERTA"]),
        Caja(codigo="CAJA-N1", nombre="Caja Norte 1", orden=3, id_dependencia=dependencias[1].id, id_estado_caja=est_caja["CAJA_ABIERTA"]),
        Caja(codigo="CAJA-S1", nombre="Caja Sur 1", orden=4, id_dependencia=dependencias[2].id, id_estado_caja=est_caja["CAJA_CERRADA"]),
    ]
    for c in cajas:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # ASIGNACIONES DE CAJA
    # ══════════════════════════════════════════════════════════════════
    asignaciones = [
        CajaAsignacion(id_caja=cajas[0].id, id_usuario=1, fecha_apertura=datetime(2025, 3, 10, 8, 0), importe_saldo_inicial=Decimal("0"), importe_cobro=Decimal("125400.50"), importe_cobro_efectivo=Decimal("85000.00")),
        CajaAsignacion(id_caja=cajas[1].id, id_usuario=1, fecha_apertura=datetime(2025, 3, 10, 8, 0), importe_saldo_inicial=Decimal("0"), importe_cobro=Decimal("87650.00"), importe_cobro_efectivo=Decimal("45000.00")),
        CajaAsignacion(id_caja=cajas[0].id, id_usuario=1, fecha_apertura=datetime(2025, 3, 3, 8, 0), fecha_cierre=datetime(2025, 3, 7, 18, 0), importe_saldo_inicial=Decimal("0"), importe_saldo_final=Decimal("0"), importe_cobro=Decimal("210300.00"), importe_cobro_efectivo=Decimal("150000.00")),
    ]
    for a in asignaciones:
        db.add(a)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # LOTES DE RECAUDACIÓN + RECAUDACIONES
    # ══════════════════════════════════════════════════════════════════
    rec_lote1 = RecaudacionLote(numero_lote=1, fecha_lote=date(2025, 1, 15), casos=4, id_recaudadora=recaudadoras[0].id, id_origen_recaudacion=orig_rec["ORIG_VENTANILLA"], importe_total=Decimal("27810.00"), importe_neto=Decimal("27810.00"), nombre_archivo_recaudacion="recaudacion_2025_01_15.csv")
    rec_lote2 = RecaudacionLote(numero_lote=2, fecha_lote=date(2025, 2, 15), casos=5, id_recaudadora=recaudadoras[1].id, id_origen_recaudacion=orig_rec["ORIG_BANCO"], importe_total=Decimal("123575.00"), importe_neto=Decimal("122339.25"), nombre_archivo_recaudacion="recaudacion_2025_02_15.csv")
    rec_lote3 = RecaudacionLote(numero_lote=3, fecha_lote=date(2025, 3, 10), casos=3, id_recaudadora=recaudadoras[4].id, id_origen_recaudacion=orig_rec["ORIG_ONLINE"], importe_total=Decimal("52725.00"), importe_neto=Decimal("51670.50"))
    for rl in [rec_lote1, rec_lote2, rec_lote3]:
        db.add(rl)
    db.flush()

    recaudaciones = [
        Recaudacion(id_recaudacion_lote=rec_lote1.id, numero_control="RC-2025-001", codigo_tipo_tributo="ABL", numero_cuenta="ABL-001-2025", numero_recibo="R-001", importe_cobro=Decimal("7650.00"), fecha_cobro=datetime(2025, 1, 10, 10, 30)),
        Recaudacion(id_recaudacion_lote=rec_lote1.id, numero_control="RC-2025-002", codigo_tipo_tributo="ABL", numero_cuenta="ABL-002-2025", numero_recibo="R-002", importe_cobro=Decimal("5580.00"), fecha_cobro=datetime(2025, 1, 10, 11, 15)),
        Recaudacion(id_recaudacion_lote=rec_lote1.id, numero_control="RC-2025-003", codigo_tipo_tributo="ABL", numero_cuenta="ABL-001-2025", numero_recibo="R-003", importe_cobro=Decimal("7650.00"), fecha_cobro=datetime(2025, 1, 12, 9, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote1.id, numero_control="RC-2025-004", codigo_tipo_tributo="ABL", numero_cuenta="ABL-003-2025", numero_recibo="R-004", importe_cobro=Decimal("6930.00"), fecha_cobro=datetime(2025, 1, 14, 14, 20)),
        Recaudacion(id_recaudacion_lote=rec_lote2.id, numero_control="RC-2025-005", codigo_tipo_tributo="ABL", numero_cuenta="ABL-002-2025", numero_recibo="R-005", importe_cobro=Decimal("5580.00"), fecha_cobro=datetime(2025, 2, 10, 10, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote2.id, numero_control="RC-2025-006", codigo_tipo_tributo="ABL", numero_cuenta="ABL-004-2025", numero_recibo="R-006", importe_cobro=Decimal("6200.00"), fecha_cobro=datetime(2025, 2, 10, 11, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote2.id, numero_control="RC-2025-007", codigo_tipo_tributo="AUTOMOTOR", numero_cuenta="AUT-001-2025", numero_recibo="R-007", importe_cobro=Decimal("10200.00"), fecha_cobro=datetime(2025, 2, 12, 9, 30)),
        Recaudacion(id_recaudacion_lote=rec_lote2.id, numero_control="RC-2025-008", codigo_tipo_tributo="ISH", numero_cuenta="ISH-001-2025", numero_recibo="R-008", importe_cobro=Decimal("45000.00"), fecha_cobro=datetime(2025, 2, 14, 15, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote2.id, numero_control="RC-2025-009", codigo_tipo_tributo="ISH", numero_cuenta="ISH-001-2025", numero_recibo="R-009", importe_cobro=Decimal("45000.00"), fecha_cobro=datetime(2025, 2, 15, 10, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote3.id, numero_control="RC-2025-010", codigo_tipo_tributo="ABL", numero_cuenta="ABL-002-2025", numero_recibo="R-010", importe_cobro=Decimal("5580.00"), fecha_cobro=datetime(2025, 3, 8, 16, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote3.id, numero_control="RC-2025-011", codigo_tipo_tributo="ISH", numero_cuenta="ISH-003-2025", numero_recibo="R-011", importe_cobro=Decimal("17575.00"), fecha_cobro=datetime(2025, 3, 9, 12, 0)),
        Recaudacion(id_recaudacion_lote=rec_lote3.id, numero_control="RC-2025-012", codigo_tipo_tributo="ISH", numero_cuenta="ISH-002-2025", numero_recibo="R-012", importe_cobro=Decimal("29570.00"), fecha_cobro=datetime(2025, 3, 10, 9, 0)),
    ]
    for r in recaudaciones:
        db.add(r)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # LOTES DE RECIBO PUBLICACIÓN + PUBLICACIONES
    # ══════════════════════════════════════════════════════════════════
    pub_lote1 = ReciboPublicacionLote(numero_lote=1, fecha_lote=date(2025, 1, 1), casos=6, importe_total_1=Decimal("88315.00"), importe_total_2=Decimal("91900.00"))
    pub_lote2 = ReciboPublicacionLote(numero_lote=2, fecha_lote=date(2025, 2, 1), casos=4, importe_total_1=Decimal("68430.00"), importe_total_2=Decimal("71700.00"))
    for pl in [pub_lote1, pub_lote2]:
        db.add(pl)
    db.flush()

    publicaciones = [
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ABL-001-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-001", periodo="1", cuota=1, importe_vencimiento_1=Decimal("7650.00"), importe_vencimiento_2=Decimal("8500.00"), fecha_vencimiento_1=date(2025, 1, 10), fecha_vencimiento_2=date(2025, 1, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ABL-002-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-002", periodo="1", cuota=1, importe_vencimiento_1=Decimal("5580.00"), importe_vencimiento_2=Decimal("6200.00"), fecha_vencimiento_1=date(2025, 1, 10), fecha_vencimiento_2=date(2025, 1, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ABL-003-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-003", periodo="1", cuota=1, importe_vencimiento_1=Decimal("6930.00"), importe_vencimiento_2=Decimal("7700.00"), fecha_vencimiento_1=date(2025, 1, 10), fecha_vencimiento_2=date(2025, 1, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ABL-004-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-004", periodo="1", cuota=1, importe_vencimiento_1=Decimal("5580.00"), importe_vencimiento_2=Decimal("6200.00"), fecha_vencimiento_1=date(2025, 1, 10), fecha_vencimiento_2=date(2025, 1, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ISH-001-2025", codigo_tipo_tributo="ISH", numero_recibo="PUB-005", periodo="1", cuota=1, importe_vencimiento_1=Decimal("45000.00"), importe_vencimiento_2=Decimal("45000.00"), fecha_vencimiento_1=date(2025, 1, 15), fecha_vencimiento_2=date(2025, 1, 25)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote1.id, numero_cuenta="ISH-003-2025", codigo_tipo_tributo="ISH", numero_recibo="PUB-006", periodo="1", cuota=1, importe_vencimiento_1=Decimal("17575.00"), importe_vencimiento_2=Decimal("18300.00"), fecha_vencimiento_1=date(2025, 1, 15), fecha_vencimiento_2=date(2025, 1, 25)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote2.id, numero_cuenta="ABL-001-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-007", periodo="2", cuota=1, importe_vencimiento_1=Decimal("7650.00"), importe_vencimiento_2=Decimal("8500.00"), fecha_vencimiento_1=date(2025, 2, 10), fecha_vencimiento_2=date(2025, 2, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote2.id, numero_cuenta="ABL-002-2025", codigo_tipo_tributo="ABL", numero_recibo="PUB-008", periodo="2", cuota=1, importe_vencimiento_1=Decimal("5580.00"), importe_vencimiento_2=Decimal("6200.00"), fecha_vencimiento_1=date(2025, 2, 10), fecha_vencimiento_2=date(2025, 2, 20)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote2.id, numero_cuenta="AUT-001-2025", codigo_tipo_tributo="AUTOMOTOR", numero_recibo="PUB-009", periodo="1", cuota=1, importe_vencimiento_1=Decimal("10200.00"), importe_vencimiento_2=Decimal("12000.00"), fecha_vencimiento_1=date(2025, 2, 15), fecha_vencimiento_2=date(2025, 2, 28)),
        ReciboPublicacion(id_recibo_publicacion_lote=pub_lote2.id, numero_cuenta="ISH-001-2025", codigo_tipo_tributo="ISH", numero_recibo="PUB-010", periodo="2", cuota=1, importe_vencimiento_1=Decimal("45000.00"), importe_vencimiento_2=Decimal("45000.00"), fecha_vencimiento_1=date(2025, 2, 15), fecha_vencimiento_2=date(2025, 2, 25)),
    ]
    for p in publicaciones:
        db.add(p)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # PAGO RENDICIÓN LOTES + RENDICIONES
    # ══════════════════════════════════════════════════════════════════
    pago_lote1 = PagoRendicionLote(numero_lote=1, fecha_lote=date(2025, 1, 20), casos=3, importe_total=Decimal("20880.00"), id_usuario_proceso=1, fecha_proceso=datetime(2025, 1, 20, 10, 0), fecha_confirmacion=datetime(2025, 1, 21, 9, 0))
    pago_lote2 = PagoRendicionLote(numero_lote=2, fecha_lote=date(2025, 2, 20), casos=3, importe_total=Decimal("55780.00"), id_usuario_proceso=1, fecha_proceso=datetime(2025, 2, 20, 10, 0))
    for pl in [pago_lote1, pago_lote2]:
        db.add(pl)
    db.flush()

    rendiciones = [
        PagoRendicion(id_pago_rendicion_lote=pago_lote1.id, numero_recibo="R-001", importe_pago=Decimal("7650.00"), fecha_pago=datetime(2025, 1, 10, 10, 30), codigo_lugar_pago="LP_MUNICIPIO"),
        PagoRendicion(id_pago_rendicion_lote=pago_lote1.id, numero_recibo="R-002", importe_pago=Decimal("5580.00"), fecha_pago=datetime(2025, 1, 10, 11, 15), codigo_lugar_pago="LP_MUNICIPIO"),
        PagoRendicion(id_pago_rendicion_lote=pago_lote1.id, numero_recibo="R-003", importe_pago=Decimal("7650.00"), fecha_pago=datetime(2025, 1, 12, 9, 0), codigo_lugar_pago="LP_BANCO"),
        PagoRendicion(id_pago_rendicion_lote=pago_lote2.id, numero_recibo="R-005", importe_pago=Decimal("5580.00"), fecha_pago=datetime(2025, 2, 10, 10, 0), codigo_lugar_pago="LP_BANCO"),
        PagoRendicion(id_pago_rendicion_lote=pago_lote2.id, numero_recibo="R-007", importe_pago=Decimal("10200.00"), fecha_pago=datetime(2025, 2, 12, 9, 30), codigo_lugar_pago="LP_BANCO"),
        PagoRendicion(id_pago_rendicion_lote=pago_lote2.id, numero_recibo="R-008", importe_pago=Decimal("45000.00"), fecha_pago=datetime(2025, 2, 14, 15, 0), codigo_lugar_pago="LP_RAPIPAGO"),
    ]
    for r in rendiciones:
        db.add(r)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # REGISTRO CONTABLE LOTES + REGISTROS
    # ══════════════════════════════════════════════════════════════════
    reg_lote1 = RegistroContableLote(numero_lote=1, fecha_lote=date(2025, 1, 31), casos=4, importe_total=Decimal("27810.00"), id_usuario_proceso=1, fecha_proceso=datetime(2025, 2, 1, 10, 0), fecha_confirmacion=datetime(2025, 2, 2, 9, 0))
    reg_lote2 = RegistroContableLote(numero_lote=2, fecha_lote=date(2025, 2, 28), casos=4, importe_total=Decimal("111780.00"), id_usuario_proceso=1, fecha_proceso=datetime(2025, 3, 1, 10, 0))
    for rl in [reg_lote1, reg_lote2]:
        db.add(rl)
    db.flush()

    registros = [
        RegistroContable(id_registro_contable_lote=reg_lote1.id, cuenta_contable="1.1.2", jurisdiccion="MUN", recurso_por_rubro="1.1.1", ejercicio=2025, importe=Decimal("20880.00"), fecha_ingreso=date(2025, 1, 31)),
        RegistroContable(id_registro_contable_lote=reg_lote1.id, cuenta_contable="4.1.2", jurisdiccion="DIR_ING", recurso_por_rubro="1.1.1", ejercicio=2025, importe=Decimal("20880.00"), fecha_ingreso=date(2025, 1, 31)),
        RegistroContable(id_registro_contable_lote=reg_lote1.id, cuenta_contable="1.1.2", jurisdiccion="MUN", recurso_por_rubro="1.1.3", ejercicio=2025, importe=Decimal("6930.00"), fecha_ingreso=date(2025, 1, 31)),
        RegistroContable(id_registro_contable_lote=reg_lote1.id, cuenta_contable="4.1.2", jurisdiccion="DIR_ING", recurso_por_rubro="1.1.3", ejercicio=2025, importe=Decimal("6930.00"), fecha_ingreso=date(2025, 1, 31)),
        RegistroContable(id_registro_contable_lote=reg_lote2.id, cuenta_contable="1.1.2", jurisdiccion="MUN", recurso_por_rubro="1.1.1", ejercicio=2025, importe=Decimal("11780.00"), fecha_ingreso=date(2025, 2, 28)),
        RegistroContable(id_registro_contable_lote=reg_lote2.id, cuenta_contable="1.1.2", jurisdiccion="MUN", recurso_por_rubro="1.2.1", ejercicio=2025, importe=Decimal("10200.00"), fecha_ingreso=date(2025, 2, 28)),
        RegistroContable(id_registro_contable_lote=reg_lote2.id, cuenta_contable="1.1.2", jurisdiccion="MUN", recurso_por_rubro="1.1.3", ejercicio=2025, importe=Decimal("90000.00"), fecha_ingreso=date(2025, 2, 28)),
        RegistroContable(id_registro_contable_lote=reg_lote2.id, cuenta_contable="4.1.1", jurisdiccion="DIR_ING", recurso_por_rubro="1.1.3", ejercicio=2025, importe=Decimal("90000.00"), fecha_ingreso=date(2025, 2, 28)),
    ]
    for r in registros:
        db.add(r)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # TIPOS DE MOVIMIENTO + CONFIGURACIONES
    # ══════════════════════════════════════════════════════════════════
    for t in [
        TipoMovimiento(codigo="COBRO", nombre="Cobro", orden=1, tipo="ingreso", automatico=True, autonumerado=True),
        TipoMovimiento(codigo="DEVOLUCION", nombre="Devolución", orden=2, tipo="egreso", automatico=False, autonumerado=True),
        TipoMovimiento(codigo="AJUSTE_POS", nombre="Ajuste Positivo", orden=3, tipo="ingreso", automatico=False, autonumerado=False),
        TipoMovimiento(codigo="AJUSTE_NEG", nombre="Ajuste Negativo", orden=4, tipo="egreso", automatico=False, autonumerado=False),
    ]:
        db.add(t)

    for c in [
        Configuracion(nombre="ejercicio_actual", valor="2025"),
        Configuracion(nombre="permitir_cobro_vencido", valor="true"),
        Configuracion(nombre="dias_gracia_vencimiento", valor="5"),
        Configuracion(nombre="porcentaje_recargo_mora", valor="3.5"),
    ]:
        db.add(c)

    db.commit()
    db.close()

    print("Seed de Tesorería completado.")
    print(f"  - {len(listas)} listas, {len(dependencias)} dependencias, {len(recaudadoras)} recaudadoras")
    print(f"  - {len(cajas)} cajas, {len(asignaciones)} asignaciones")
    print(f"  - 3 lotes recaudación, {len(recaudaciones)} recaudaciones")
    print(f"  - 2 lotes publicación, {len(publicaciones)} publicaciones")
    print(f"  - 2 lotes pago, {len(rendiciones)} rendiciones")
    print(f"  - 2 lotes contables, {len(registros)} registros")


if __name__ == "__main__":
    seed()
