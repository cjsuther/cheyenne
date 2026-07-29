"""
Seed de datos DEMO para el módulo Patrimonio (Municipalidad de Cheyenne).
Puebla bienes de uso (rodados, inmuebles, muebles y útiles, informáticos) con
amortización lineal coherente, y sus movimientos (alta, amortizaciones, pases, bajas).
Ejercicio de la demo: 2026.

    docker compose exec patrimonio python seed_demo.py

Idempotente: se detecta por el prefijo "DEMO-" en el código de los bienes.
"""
import sys
import os
from datetime import date, datetime, timezone
from decimal import Decimal
from calendar import monthrange

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.patrimonio import Bien, MovimientoBien

PREFIJO = "DEMO-"


def _dec(v):
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


def _fin_de_mes(anio, mes):
    return date(anio, mes, monthrange(anio, mes)[1])


def _meses_entre(desde: date, hasta: date):
    """Cantidad de cierres de mes completos entre alta y 'hasta' (inclusive del mes de corte)."""
    if hasta <= desde:
        return 0
    return (hasta.year - desde.year) * 12 + (hasta.month - desde.month)


# ---------------------------------------------------------------------------
# Catálogo de bienes DEMO. Fechas de alta variadas (algunas anteriores a 2026
# para mostrar amortización acumulada). Corte de amortización: 2026-06.
# ---------------------------------------------------------------------------
CORTE = date(2026, 6, 30)  # último período amortizado en la demo: 2026-06

# (codigo, denominacion, tipo, dependencia, responsable, origen,
#  fecha_alta, valor_origen, valor_residual, vida_util_meses)
BIENES = [
    # --- Rodados (vida útil 60 meses) ---
    ("ROD-001", "Camioneta Toyota Hilux 4x4 2024", "rodado", "Obras Públicas", "Ing. Marta Quiroga", "compra",
     date(2024, 3, 15), "38500000.00", "3850000.00", 60),
    ("ROD-002", "Camión volcador Iveco Tector 170E22", "rodado", "Obras Públicas", "Sr. Raúl Ledesma", "compra",
     date(2023, 8, 10), "52000000.00", "5200000.00", 96),
    ("ROD-003", "Utilitario Renault Kangoo Express", "rodado", "Servicios Generales", "Sr. Diego Ferreyra", "compra",
     date(2025, 1, 20), "18700000.00", "1870000.00", 60),
    ("ROD-004", "Ambulancia Mercedes-Benz Sprinter 415", "rodado", "Secretaría de Salud", "Dra. Elena Sosa", "compra",
     date(2022, 11, 5), "41000000.00", "4100000.00", 84),
    ("ROD-005", "Motoniveladora John Deere 620G", "rodado", "Obras Públicas", "Ing. Marta Quiroga", "compra",
     date(2021, 6, 30), "95000000.00", "9500000.00", 120),
    ("ROD-006", "Motocicleta Honda CG 150 Tránsito", "rodado", "Dirección de Tránsito", "Ag. Pablo Vera", "compra",
     date(2026, 2, 12), "2450000.00", "245000.00", 48),

    # --- Inmuebles (no amortizables o vida larga) ---
    ("INM-001", "Edificio Palacio Municipal - Av. San Martín 1250", "inmueble", "Intendencia", "Intendente", "otro",
     date(1998, 1, 1), "180000000.00", "0.00", 0),
    ("INM-002", "Predio Corralón Municipal - Ruta 12 Km 4", "inmueble", "Obras Públicas", "Ing. Marta Quiroga", "otro",
     date(2005, 4, 1), "64000000.00", "0.00", 0),
    ("INM-003", "Centro de Salud N°2 - Barrio Sur", "inmueble", "Secretaría de Salud", "Dra. Elena Sosa", "construccion",
     date(2020, 9, 1), "88000000.00", "8800000.00", 600),
    ("INM-004", "Galpón depósito de insumos - Parque Industrial", "inmueble", "Compras y Suministros", "Cra. Lucía Bianchi", "compra",
     date(2019, 3, 1), "35000000.00", "3500000.00", 480),

    # --- Muebles y útiles (vida útil 120 meses) ---
    ("MUE-001", "Escritorio ejecutivo con cajonera (x15)", "mueble", "Mesa de Entradas", "Sra. Norma Duarte", "compra",
     date(2024, 5, 18), "3300000.00", "330000.00", 120),
    ("MUE-002", "Juego de sillas ergonómicas oficina (x40)", "mueble", "Administración", "Cr. Fernando Ríos", "compra",
     date(2025, 3, 22), "5600000.00", "560000.00", 120),
    ("MUE-003", "Archivo metálico 4 gavetas ignífugo (x8)", "mueble", "Archivo General", "Sr. Julio Paredes", "compra",
     date(2023, 10, 3), "2880000.00", "288000.00", 120),
    ("MUE-004", "Mostrador de atención al público (x2)", "mueble", "Rentas Municipal", "Cra. Silvia Molina", "compra",
     date(2026, 1, 15), "1950000.00", "195000.00", 120),
    ("MUE-005", "Aire acondicionado split 6000 frigorías (x10)", "mueble", "Servicios Generales", "Sr. Diego Ferreyra", "compra",
     date(2025, 11, 8), "7200000.00", "720000.00", 96),

    # --- Equipos informáticos (vida útil 36 meses) ---
    ("INF-001", "Servidor Dell PowerEdge R750", "informatico", "Dirección de Sistemas", "Lic. Andrés Cabral", "compra",
     date(2024, 2, 9), "12500000.00", "1250000.00", 48),
    ("INF-002", "Notebooks Lenovo ThinkPad E14 (x25)", "informatico", "Dirección de Sistemas", "Lic. Andrés Cabral", "compra",
     date(2025, 4, 14), "18750000.00", "1875000.00", 36),
    ("INF-003", "Impresora multifunción láser Xerox (x6)", "informatico", "Mesa de Entradas", "Sra. Norma Duarte", "compra",
     date(2023, 7, 25), "4200000.00", "420000.00", 36),
    ("INF-004", "Switch de red administrable Cisco Catalyst (x4)", "informatico", "Dirección de Sistemas", "Lic. Andrés Cabral", "compra",
     date(2026, 3, 1), "6800000.00", "680000.00", 48),
    ("INF-005", "UPS online 10 KVA para Data Center", "informatico", "Dirección de Sistemas", "Lic. Andrés Cabral", "compra",
     date(2022, 12, 1), "5400000.00", "540000.00", 60),
    ("INF-006", "Terminales de consulta táctiles atención (x3)", "informatico", "Rentas Municipal", "Cra. Silvia Molina", "donacion",
     date(2021, 5, 20), "3600000.00", "360000.00", 36),
]

# Bienes que en la demo tienen una baja registrada (por su valor neto).
BAJAS = {
    "INF-006": "Baja por obsolescencia tecnológica - Res. 214/2026",
}

# Pases entre dependencias (código -> (dep_destino, responsable_destino, motivo))
PASES = {
    "MUE-001": ("Juzgado de Faltas", "Dr. Hernán Ojeda", "Reasignación por reorganización de áreas"),
    "INF-003": ("Dirección de Tránsito", "Ag. Pablo Vera", "Traslado de impresora a nueva oficina"),
    "ROD-003": ("Secretaría de Salud", "Dra. Elena Sosa", "Afectación a reparto de medicamentos"),
}


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    ya = db.query(Bien).filter(Bien.codigo.like(f"{PREFIJO}%")).first()
    if ya:
        print("seed_demo patrimonio: ya sembrado, omito")
        db.close()
        return

    usuario = "Cra. Lucía Bianchi (DEMO)"
    n_bienes = 0
    n_movs = 0
    n_amort = 0
    n_pases = 0
    n_bajas = 0

    for (cod, denom, tipo, dep, resp, origen, f_alta, v_orig, v_res, vida) in BIENES:
        codigo = PREFIJO + cod
        try:
            valor_origen = _dec(v_orig)
            valor_residual = _dec(v_res)

            # --- Amortización acumulada coherente (lineal) al corte 2026-06 ---
            amort_acum = Decimal("0.00")
            cuota = Decimal("0.00")
            if vida and vida > 0:
                base = valor_origen - valor_residual
                if base > 0:
                    cuota = (base / Decimal(vida)).quantize(Decimal("0.01"))
                    meses = _meses_entre(f_alta, CORTE)
                    meses = max(0, min(meses, vida))
                    amort_acum = (cuota * Decimal(meses)).quantize(Decimal("0.01"))
                    # nunca amortizar por debajo del residual
                    if amort_acum > base:
                        amort_acum = base

            b = Bien(
                codigo=codigo,
                denominacion=denom,
                tipo=tipo,
                dependencia=dep,
                responsable=resp,
                origen=origen,
                fecha_alta=f_alta,
                valor_origen=valor_origen,
                valor_residual=valor_residual,
                vida_util_meses=vida,
                amortizacion_acumulada=amort_acum,
                estado="alta",
                creado_por=usuario,
                created_at=datetime.now(timezone.utc),
                activo=True,
            )
            db.add(b)
            db.flush()
            n_bienes += 1

            # Movimiento de alta
            db.add(MovimientoBien(
                id_bien=b.id, tipo="alta",
                fecha=datetime(f_alta.year, f_alta.month, f_alta.day, tzinfo=timezone.utc),
                importe=valor_origen,
                dependencia_destino=dep,
                detalle=f"Alta patrimonial ({origen})",
                usuario_nombre=usuario,
            ))
            n_movs += 1

            # Movimientos de amortización: generamos las cuotas de 2026 (Ene..Jun)
            # ya reflejadas en amortizacion_acumulada, para poblar el historial.
            if cuota > 0 and amort_acum > 0:
                base = valor_origen - valor_residual
                for mes in range(1, 7):  # 2026-01 .. 2026-06
                    periodo = f"2026-{mes:02d}"
                    f_periodo = _fin_de_mes(2026, mes)
                    if f_periodo <= f_alta:
                        continue  # el bien aún no existía ese mes
                    # tope: no superar la base amortizable
                    # (para bienes altas 2026 arrancan a amortizar el mes siguiente)
                    db.add(MovimientoBien(
                        id_bien=b.id, tipo="amortizacion",
                        fecha=datetime(f_periodo.year, f_periodo.month, f_periodo.day, tzinfo=timezone.utc),
                        periodo=periodo,
                        importe=cuota,
                        detalle=f"Amortización {periodo}",
                        usuario_nombre=usuario,
                    ))
                    n_movs += 1
                    n_amort += 1

            # Pase entre dependencias
            if cod in PASES:
                destino, resp_dest, motivo = PASES[cod]
                origen_dep = b.dependencia
                b.dependencia = destino
                b.responsable = resp_dest
                db.add(MovimientoBien(
                    id_bien=b.id, tipo="pase",
                    fecha=datetime(2026, 4, 10, tzinfo=timezone.utc),
                    dependencia_origen=origen_dep, dependencia_destino=destino,
                    detalle=motivo, usuario_nombre=usuario,
                ))
                n_movs += 1
                n_pases += 1

            # Baja patrimonial
            if cod in BAJAS:
                neto = (valor_origen - amort_acum).quantize(Decimal("0.01"))
                b.estado = "baja"
                db.add(MovimientoBien(
                    id_bien=b.id, tipo="baja",
                    fecha=datetime(2026, 5, 22, tzinfo=timezone.utc),
                    importe=neto,
                    detalle=BAJAS[cod], usuario_nombre=usuario,
                ))
                n_movs += 1
                n_bajas += 1

            db.commit()
        except Exception as e:
            db.rollback()
            print(f"seed_demo patrimonio: error en bien {codigo}: {e}")

    db.close()
    print(f"seed_demo patrimonio: +{n_bienes} bienes, +{n_movs} movimientos "
          f"({n_amort} amortizaciones, {n_pases} pases, {n_bajas} bajas)")


if __name__ == "__main__":
    seed()
