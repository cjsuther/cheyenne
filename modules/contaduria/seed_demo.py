"""
Seed de DEMO para el módulo Contaduría (ciclo del gasto RAFAM).
Puebla contaduria_gastos en distintos estados (preventivado, comprometido,
devengado, pagado), retenciones aplicadas sobre devengados/pagados y algunos
movimientos extracontables (fondos de terceros). Ejercicio 2026.

Ejecutar:
    docker compose exec contaduria python seed_demo.py

IDEMPOTENTE: detecta si ya sembró buscando gastos con observaciones que
empiezan por "DEMO"; si los encuentra, omite.
"""
import sys
import os
from datetime import date, datetime, timezone, timedelta
from decimal import Decimal, ROUND_HALF_UP

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy import func

from database import SessionLocal, engine
from shared.database import Base

from models.gasto import GastoExpediente
from models.retencion import TipoRetencion, RetencionAplicada
from models.extracontable import MovimientoExtracontable

ANIO = 2026
DEMO_TAG = "DEMO"

# Partidas presupuestarias del módulo presupuesto (otra DB). Se referencian por
# id (asumidas 1..6). partida_etiqueta es sólo cache para mostrar en pantalla.
PARTIDAS = {
    1: "1.1.1.01 · 01.00 · 1.1.1 · 1.1",   # Personal - Retribuciones
    2: "1.1.1.01 · 01.00 · 2.1.1 · 1.1",   # Bienes de consumo - Alimentos
    3: "1.1.1.01 · 02.00 · 2.5.6 · 1.1",   # Combustibles y lubricantes
    4: "1.1.1.01 · 03.00 · 3.3.1 · 1.2",   # Mantenimiento y reparación
    5: "1.1.1.01 · 03.00 · 3.4.5 · 1.2",   # Servicios técnicos y profesionales
    6: "1.1.1.01 · 04.00 · 4.3.3 · 1.4",   # Bienes de uso - Maquinaria y equipo
}

# Proveedores demo (CUIT argentinos plausibles)
PROVEEDORES = [
    ("Distribuidora Cheyenne S.A.",      "30-71045892-3"),
    ("Constructora del Sur S.R.L.",      "30-68992145-7"),
    ("Servicios Viales Patagónicos S.A.","30-70998234-1"),
    ("Insumos Médicos Andinos S.R.L.",   "30-71223456-9"),
    ("Combustibles La Meseta S.A.",      "30-69554123-2"),
    ("Ferretería Industrial Norte SRL",  "30-70112398-4"),
    ("Consultora Territorial S.A.",      "30-71889001-6"),
    ("Tecnología Municipal S.R.L.",      "30-70445612-8"),
]

CENTAVOS = Decimal("0.01")


def _q(x):
    return Decimal(str(x)).quantize(CENTAVOS, rounding=ROUND_HALF_UP)


def _hist(etapa, referencia, importe, id_afect, fecha):
    return {
        "etapa": etapa,
        "usuario": "Contador Demo",
        "fecha": fecha.replace(tzinfo=timezone.utc).isoformat(),
        "referencia": referencia,
        "importe": float(importe),
        "id_afectacion": id_afect,
    }


def _tipos_retencion(db):
    """Asegura tipos de retención base (mi propio módulo). Devuelve dict codigo->tipo."""
    definiciones = [
        ("IIBB-CHU", "Ingresos Brutos - Régimen General", "iibb", Decimal("3.0000"), "neto", Decimal("5000.00")),
        ("GAN-INSC", "Ganancias - Bienes/Servicios inscriptos", "ganancias", Decimal("2.0000"), "neto", Decimal("67170.00")),
        ("IVA-RG",   "IVA - Retención Régimen General", "iva", Decimal("6.0000"), "neto", Decimal("0.00")),
        ("SUSS",     "SUSS - Servicios de limpieza/seguridad", "sijp", Decimal("6.0000"), "total", Decimal("8000.00")),
    ]
    tipos = {}
    for codigo, nombre, regimen, alic, base, minimo in definiciones:
        t = db.query(TipoRetencion).filter(TipoRetencion.codigo == codigo).first()
        if not t:
            t = TipoRetencion(codigo=codigo, nombre=nombre, regimen=regimen,
                              alicuota=alic, base=base, minimo_no_imponible=minimo, activo=True)
            db.add(t)
        tipos[codigo] = t
    db.flush()
    return tipos


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── IDEMPOTENCIA ────────────────────────────────────────────────
    ya = db.query(GastoExpediente).filter(
        GastoExpediente.anio == ANIO,
        GastoExpediente.observaciones.like(f"{DEMO_TAG}%"),
    ).first()
    if ya:
        print("seed_demo contaduria: ya sembrado, omito")
        db.close()
        return

    resumen = {"gastos": 0, "retenciones": 0, "extracontables": 0, "tipos_retencion": 0}

    # ── TIPOS DE RETENCIÓN (mi módulo) ──────────────────────────────
    try:
        antes = db.query(TipoRetencion).count()
        tipos = _tipos_retencion(db)
        resumen["tipos_retencion"] = db.query(TipoRetencion).count() - antes
    except Exception as e:
        print(f"seed_demo contaduria: fallo tipos_retencion: {e}")
        tipos = {}

    # número de expediente: arranca por encima de lo existente para no chocar UK
    base_num = (db.query(func.max(GastoExpediente.numero))
                .filter(GastoExpediente.anio == ANIO).scalar() or 0)

    # ── GASTOS: 20 expedientes en distintos estados ─────────────────
    # (estado_objetivo, id_partida, importe, descripcion, dias_atras)
    plan = [
        ("preventivado", 1, "1450000.00", "Adelanto haberes personal contratado obra pública", 12),
        ("preventivado", 2, "382500.50",  "Provisión de alimentos para comedor municipal", 11),
        ("preventivado", 3, "725000.00",  "Compra de combustible flota vehicular", 10),
        ("preventivado", 4, "196800.00",  "Reparación de bombas cloacales barrio Centro", 9),
        ("preventivado", 5, "540000.00",  "Servicio de consultoría catastral", 8),

        ("comprometido", 3, "725000.00",  "Compra de combustible flota vehicular Q3", 22),
        ("comprometido", 2, "298400.00",  "Insumos de limpieza edificios municipales", 21),
        ("comprometido", 6, "3850000.00", "Adquisición de retroexcavadora usada", 20),
        ("comprometido", 4, "412300.75",  "Mantenimiento de alumbrado público av. San Martín", 19),
        ("comprometido", 5, "168000.00",  "Servicios técnicos de topografía", 18),

        ("devengado", 2, "455900.00",  "Provisión de alimentos - factura B mensual", 35),
        ("devengado", 3, "610250.00",  "Combustible gasoil - remito y factura", 33),
        ("devengado", 5, "890000.00",  "Honorarios consultoría planeamiento urbano", 31),
        ("devengado", 6, "1275000.00", "Equipamiento informático áreas administrativas", 30),
        ("devengado", 4, "233450.00",  "Reparación de veredas microcentro", 28),

        ("pagado", 2, "512000.00",  "Provisión de alimentos comedor - pago mayo", 50),
        ("pagado", 3, "748900.00",  "Combustible flota - pago mensual", 48),
        ("pagado", 5, "1120000.00", "Servicios profesionales auditoría externa", 46),
        ("pagado", 6, "2650000.00", "Compra de camión volcador - pago único", 44),
        ("pagado", 4, "305700.00",  "Mantenimiento red de agua - pago final", 42),
    ]

    partida_ids = list(PARTIDAS.keys())
    gastos_devengados_pagados = []  # (gasto, base_neto) para retenciones
    hoy = datetime.now(timezone.utc)
    fake_afect = 5000  # id de afectación ficticio incremental (presupuesto es otra DB)

    for i, (estado_obj, idp, imp, desc, dias) in enumerate(plan):
        try:
            numero = base_num + i + 1
            prov_nombre, prov_cuit = PROVEEDORES[i % len(PROVEEDORES)]
            importe = _q(imp)
            id_partida = idp if idp in PARTIDAS else partida_ids[i % len(partida_ids)]
            etiqueta = PARTIDAS.get(id_partida)
            referencia = f"GEX-{ANIO}-{numero:04d}"
            f_prev = hoy - timedelta(days=dias)

            historial = []
            fake_afect += 1
            historial.append(_hist("preventivo", referencia, importe, fake_afect, f_prev))

            oc_numero = factura_numero = op_numero = None

            if estado_obj in ("comprometido", "devengado", "pagado"):
                fake_afect += 1
                oc_numero = f"OC-{ANIO}-{1000 + numero}"
                historial.append(_hist("compromiso", oc_numero, importe, fake_afect, f_prev + timedelta(days=2)))
            if estado_obj in ("devengado", "pagado"):
                fake_afect += 1
                factura_numero = f"FC-B-{5000 + numero:07d}"
                historial.append(_hist("devengado", factura_numero, importe, fake_afect, f_prev + timedelta(days=5)))
            if estado_obj == "pagado":
                fake_afect += 1
                op_numero = f"OP-{ANIO}-{2000 + numero}"
                historial.append(_hist("pagado", op_numero, importe, fake_afect, f_prev + timedelta(days=8)))

            g = GastoExpediente(
                anio=ANIO, numero=numero, descripcion=desc,
                proveedor=prov_nombre, id_partida=id_partida, partida_etiqueta=etiqueta,
                importe=importe, estado=estado_obj, id_afectacion_actual=fake_afect,
                oc_numero=oc_numero, factura_numero=factura_numero, op_numero=op_numero,
                historial=historial,
                observaciones=f"{DEMO_TAG} expediente de demostración - ciclo del gasto {ANIO}",
                creado_por="Contador Demo",
                created_at=f_prev,
                activo=True,
            )
            db.add(g)
            db.flush()  # obtener g.id para retenciones
            resumen["gastos"] += 1

            if estado_obj in ("devengado", "pagado"):
                gastos_devengados_pagados.append((g, importe, prov_cuit, prov_nombre, factura_numero, f_prev))
        except Exception as e:
            print(f"seed_demo contaduria: fallo gasto #{i}: {e}")
            db.rollback()

    db.commit()

    # ── RETENCIONES APLICADAS sobre devengados/pagados ──────────────
    # ~8 retenciones: alternamos tipos sobre los gastos devengados/pagados.
    tipos_lista = [tipos.get(c) for c in ("IIBB-CHU", "GAN-INSC", "IVA-RG", "SUSS") if tipos.get(c)]
    if tipos_lista and gastos_devengados_pagados:
        objetivo = 8
        idx = 0
        for (g, importe, cuit, prov, factura, fecha) in gastos_devengados_pagados:
            if resumen["retenciones"] >= objetivo:
                break
            # aplicar 1-2 retenciones por gasto hasta llegar al objetivo
            n_ret = 2 if (resumen["retenciones"] + 2) <= objetivo and idx % 2 == 0 else 1
            for k in range(n_ret):
                if resumen["retenciones"] >= objetivo:
                    break
                try:
                    t = tipos_lista[(idx + k) % len(tipos_lista)]
                    base = _q(importe)
                    if t.minimo_no_imponible and base <= t.minimo_no_imponible:
                        continue  # no retiene bajo el mínimo
                    imp_ret = _q(base * (t.alicuota / Decimal("100")))
                    if imp_ret <= 0:
                        continue
                    periodo = f"{fecha.year}{fecha.month:02d}"
                    r = RetencionAplicada(
                        id_gasto=g.id, id_tipo_retencion=t.id,
                        tipo_codigo=t.codigo, tipo_nombre=t.nombre, regimen=t.regimen,
                        alicuota=t.alicuota, base_calculo=base, importe=imp_ret,
                        periodo=periodo, comprobante=factura,
                        cuit_beneficiario=cuit, beneficiario=prov,
                        observaciones=f"{DEMO_TAG} retención {t.codigo} sobre {g.descripcion[:60]}",
                        creado_por="Contador Demo",
                        created_at=fecha + timedelta(days=6),
                        activo=True,
                    )
                    db.add(r)
                    resumen["retenciones"] += 1
                except Exception as e:
                    print(f"seed_demo contaduria: fallo retencion gasto {g.id}: {e}")
                    db.rollback()
            idx += 1
        db.commit()

    # ── MOVIMIENTOS EXTRACONTABLES (fondos de terceros) ─────────────
    extra = [
        ("Garantías de oferta", "ingreso", "150000.00", "Constructora del Sur S.R.L.", "GAR-2026-0012", 40),
        ("Garantías de oferta", "ingreso", "220000.00", "Servicios Viales Patagónicos S.A.", "GAR-2026-0018", 33),
        ("Garantías de contrato", "ingreso", "385000.00", "Tecnología Municipal S.R.L.", "GAR-2026-0025", 27),
        ("Embargos judiciales", "ingreso", "78500.00", "Juzgado Civil N°2 - Autos s/ embargo", "EMB-2026-0007", 22),
        ("Depósitos en garantía", "ingreso", "95000.00", "Insumos Médicos Andinos S.R.L.", "DEP-2026-0003", 18),
        ("Garantías de oferta", "egreso", "150000.00", "Constructora del Sur S.R.L.", "GAR-2026-0012 devolución", 6),
        ("Fondo permanente - reposición", "egreso", "60000.00", "Caja Chica Secretaría de Obras", "FP-2026-0004", 10),
    ]
    for j, (concepto, tipo, imp, benef, ref, dias) in enumerate(extra):
        try:
            m = MovimientoExtracontable(
                concepto=concepto, tipo=tipo, importe=_q(imp),
                beneficiario=benef, referencia=ref,
                fecha=(hoy - timedelta(days=dias)).date(),
                observaciones=f"{DEMO_TAG} movimiento extracontable de demostración",
                creado_por="Contador Demo",
                created_at=hoy - timedelta(days=dias),
                activo=True,
            )
            db.add(m)
            resumen["extracontables"] += 1
        except Exception as e:
            print(f"seed_demo contaduria: fallo extracontable #{j}: {e}")
            db.rollback()
    db.commit()
    db.close()

    print(
        f"seed_demo contaduria: +{resumen['gastos']} gastos, "
        f"+{resumen['retenciones']} retenciones_aplicadas, "
        f"+{resumen['extracontables']} movimientos_extracontables, "
        f"+{resumen['tipos_retencion']} tipos_retencion"
    )


if __name__ == "__main__":
    seed()
