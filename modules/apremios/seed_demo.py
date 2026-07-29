"""Seed de datos DEMO para el módulo Apremios (ejercicio 2026).

Puebla juicios de apremio contra contribuyentes con deuda, sus mandamientos,
embargos, honorarios y actos procesales, de forma COHERENTE con el circuito
de estados (iniciado -> mandamiento -> embargo -> sentencia -> cobrado).

Idempotente: se detecta por la carátula prefijada con "DEMO ". Correr 2+ veces
no duplica.

Ejecutar: docker compose exec apremios python seed_demo.py
"""
import sys, os
from datetime import date, datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.apremios import (
    Juicio, ActoProcesal, EmbargoJudicial, Honorario, Mandamiento,
)

DEMO_PREFIX = "DEMO "


def _dt(y, m, d):
    return datetime(y, m, d, tzinfo=timezone.utc)


# Contribuyentes ficticios con deuda tributaria (id_contribuyente coherente,
# denormalizado en contribuyente_nombre como en el modelo).
CONTRIBUYENTES = [
    (101, "Comercial del Sur S.R.L.", "30-71045821-3"),
    (102, "Gómez, Ricardo Alberto", "20-14785236-9"),
    (103, "Fernández, María Cristina", "27-18963254-1"),
    (104, "Metalúrgica Rivadavia S.A.", "30-65984123-7"),
    (105, "Torres, Juan Domingo", "20-22548791-4"),
    (106, "Panadería La Espiga S.H.", "30-70895412-6"),
    (107, "López, Silvina Beatriz", "27-25896314-8"),
    (108, "Transporte Andino S.R.L.", "30-71458963-2"),
    (109, "Molina, Héctor Osvaldo", "20-16324578-5"),
    (110, "Agropecuaria El Ceibo S.A.", "30-68975421-9"),
    (111, "Ramírez, Ana Laura", "27-30125478-3"),
    (112, "Ferretería Industrial Norte S.R.L.", "30-71789456-1"),
]

JUZGADOS = [
    "Juzgado Contencioso Administrativo Nº 1 de Cheyenne",
    "Juzgado Contencioso Administrativo Nº 2 de Cheyenne",
    "Juzgado de Ejecuciones Fiscales Nº 1",
]

PROFESIONALES = [
    "Dr. Alberto Sánchez (Apoderado Fiscal)",
    "Dra. Patricia Núñez (Apoderado Fiscal)",
    "Dr. Marcelo Ibáñez (Apoderado Fiscal)",
]

OFICIALES = [
    "Of. Justicia J. Pérez",
    "Of. Justicia R. Domínguez",
    "Of. Justicia C. Aguirre",
]

# (idx_contrib, estado_final, deuda_capital, tributo)
JUICIOS_DEF = [
    (0,  "iniciado",     "185430.50", "Tasa por Servicios Generales"),
    (1,  "mandamiento",  "92750.00",  "Impuesto Automotor"),
    (2,  "mandamiento",  "134890.75", "Tasa por Servicios Generales"),
    (3,  "embargo",      "845620.00", "Contribución Comercio e Industria"),
    (4,  "embargo",      "56320.40",  "Impuesto Inmobiliario"),
    (5,  "sentencia",    "298450.00", "Contribución Comercio e Industria"),
    (6,  "sentencia",    "73210.90",  "Tasa por Servicios Generales"),
    (7,  "cobrado",      "412780.00", "Contribución Comercio e Industria"),
    (8,  "cobrado",      "48950.25",  "Impuesto Automotor"),
    (9,  "embargo",      "1024500.00","Impuesto Inmobiliario Rural"),
    (10, "iniciado",     "67840.00",  "Tasa por Servicios Generales"),
    (11, "archivado",    "38920.60",  "Contribución Comercio e Industria"),
]

# Orden del circuito para saber qué actos generar hasta el estado final.
CIRCUITO = ["iniciado", "mandamiento", "embargo", "sentencia", "cobrado"]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    n_juicios = n_actos = n_mand = n_emb = n_hon = 0

    try:
        ya = db.query(Juicio).filter(Juicio.caratula.like(DEMO_PREFIX + "%")).first()
        if ya:
            print("seed_demo apremios: ya sembrado, omito")
            return

        juicios = []
        for i, (ci, estado, cap, tributo) in enumerate(JUICIOS_DEF, start=1):
            id_c, nombre, cuit = CONTRIBUYENTES[ci]
            capital = Decimal(cap)
            # Deuda actualizada = capital + intereses/actualización (~35-45%)
            factor = Decimal("1.42") if i % 2 == 0 else Decimal("1.38")
            actualizada = (capital * factor).quantize(Decimal("0.01"))
            expte = f"AP-2026-{2000 + i:05d}"
            j = Juicio(
                id_contribuyente=id_c,
                contribuyente_nombre=nombre,
                caratula=f"{DEMO_PREFIX}MUNICIPALIDAD DE CHEYENNE c/ {nombre} s/ APREMIO ({tributo})",
                juzgado=JUZGADOS[i % len(JUZGADOS)],
                deuda_capital=capital,
                deuda_actualizada=actualizada,
                estado=estado,
                fecha_inicio=_dt(2026, 1 + (i % 6), 3 + (i % 20)),
                expediente_judicial=expte,
                activo=True,
                created_at=datetime.now(timezone.utc),
            )
            db.add(j)
            juicios.append((j, estado, capital, actualizada, i))
        db.flush()  # asigna PKs
        n_juicios = len(juicios)

        # Actos procesales: generamos la línea de tiempo según el circuito
        # recorrido hasta el estado alcanzado.
        for j, estado, capital, actualizada, i in juicios:
            if estado == "archivado":
                etapas = ["iniciado", "archivado"]
            else:
                idx = CIRCUITO.index(estado)
                etapas = CIRCUITO[: idx + 1]

            for k, etapa in enumerate(etapas):
                fecha = _dt(2026, min(1 + (i % 6) + k, 12), 5 + (k * 3) % 20)
                detalle = {
                    "iniciado": f"Inicio de juicio de apremio. Expte {j.expediente_judicial}. Deuda capital ${capital}.",
                    "mandamiento": "Libramiento de mandamiento de intimación de pago y embargo.",
                    "embargo": "Traba de embargo sobre bienes del ejecutado.",
                    "sentencia": "Sentencia de trance y remate. Se manda llevar adelante la ejecución.",
                    "cobrado": f"Percepción total de la deuda. Monto cobrado ${actualizada}.",
                    "archivado": "Archivo del expediente por pago voluntario / plan de pagos.",
                }[etapa]
                db.add(ActoProcesal(
                    id_juicio=j.id, tipo=etapa, fecha=fecha,
                    detalle=DEMO_PREFIX + detalle, activo=True,
                    created_at=datetime.now(timezone.utc),
                ))
                n_actos += 1

        # Mandamientos: para juicios que alcanzaron al menos "mandamiento".
        estados_con_mand = {"mandamiento", "embargo", "sentencia", "cobrado"}
        for j, estado, capital, actualizada, i in juicios:
            if estado in estados_con_mand:
                resultado = (
                    "Intimado personalmente. Manifestó voluntad de acogerse a plan de pagos."
                    if i % 3 == 0 else
                    "Domicilio cerrado. Se dejó cédula bajo puerta. Sin bienes a la vista."
                    if i % 3 == 1 else
                    "Intimación cumplida. Se trabó embargo sobre bienes denunciados."
                )
                db.add(Mandamiento(
                    id_juicio=j.id,
                    fecha=_dt(2026, min(2 + (i % 5), 12), 10 + (i % 15)),
                    oficial=OFICIALES[i % len(OFICIALES)],
                    resultado=DEMO_PREFIX + resultado,
                    activo=True, created_at=datetime.now(timezone.utc),
                ))
                n_mand += 1

        # Embargos: para juicios que alcanzaron "embargo" o posterior.
        estados_con_emb = {"embargo", "sentencia", "cobrado"}
        tipos = ["inmueble", "vehiculo", "cuenta", "sueldo"]
        bienes = {
            "inmueble": "Inmueble Nomenclatura Catastral Circ. II, Secc. B, Manz. 45, Parc. 12",
            "vehiculo": "Automotor dominio AB-345-CD, marca Toyota Hilux modelo 2019",
            "cuenta": "Cuenta corriente Nº 4520-8/7 Banco de la Nación Argentina",
            "sueldo": "Embargo de haberes 20% - empleador declarado en autos",
        }
        for j, estado, capital, actualizada, i in juicios:
            if estado in estados_con_emb:
                tipo = tipos[i % len(tipos)]
                est_emb = "levantado" if estado == "cobrado" else "trabado"
                importe = (actualizada * Decimal("1.10")).quantize(Decimal("0.01"))
                db.add(EmbargoJudicial(
                    id_juicio=j.id, tipo=tipo,
                    bien_descripcion=DEMO_PREFIX + bienes[tipo],
                    importe=importe, estado=est_emb,
                    fecha=_dt(2026, min(3 + (i % 5), 12), 8 + (i % 18)),
                    activo=True, created_at=datetime.now(timezone.utc),
                ))
                n_emb += 1

        # Honorarios: calculados como % de la deuda actualizada. Pagados sólo
        # en juicios cobrados.
        for j, estado, capital, actualizada, i in juicios:
            if estado == "iniciado":
                continue  # aún sin regulación de honorarios
            porcentaje = Decimal("10.00") if estado in ("cobrado", "sentencia") else Decimal("8.00")
            importe = (actualizada * porcentaje / Decimal("100")).quantize(Decimal("0.01"))
            db.add(Honorario(
                id_juicio=j.id,
                profesional=DEMO_PREFIX + PROFESIONALES[i % len(PROFESIONALES)],
                porcentaje=porcentaje, importe=importe,
                pagado=(estado == "cobrado"),
                activo=True, created_at=datetime.now(timezone.utc),
            ))
            n_hon += 1

        db.commit()
        print(
            f"seed_demo apremios: +{n_juicios} juicios, +{n_actos} actos_procesales, "
            f"+{n_mand} mandamientos, +{n_emb} embargos, +{n_hon} honorarios"
        )
    except Exception as e:
        db.rollback()
        print(f"seed_demo apremios: ERROR, rollback -> {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
