"""
Seed de datos DEMO para el módulo Cementerio (ejercicio 2026).
Idempotente: se puede correr varias veces sin duplicar.
    docker compose exec cementerio python seed_demo.py
"""
import sys
import os
import random
from datetime import date, datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.cementerio import (
    Sepultura, Concesion, Difunto, Inhumacion, Traslado, TasaCementerio,
)

MARKER = "DEMO"


def _now():
    return datetime.now(timezone.utc)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    random.seed(2026)

    resumen = {
        "sepulturas": 0, "concesiones": 0, "difuntos": 0,
        "inhumaciones": 0, "traslados": 0, "tasas": 0,
    }

    try:
        # ---------- IDEMPOTENCIA ----------
        ya = db.query(Sepultura).filter(
            Sepultura.observaciones.like(f"%{MARKER}%")
        ).count()
        if ya > 0:
            print("seed_demo cementerio: ya sembrado, omito")
            db.close()
            return

        # ---------- SEPULTURAS (~30) ----------
        # Secciones A/B nichos, C/D bóvedas, E/F parcelas y tierra.
        sepulturas = []
        try:
            plan = [
                ("nicho", "A", ["1", "2", "3", "4", "5"]),
                ("nicho", "B", ["1", "2", "3", "4", "5"]),
                ("boveda", "C", ["1", "2", "3", "4"]),
                ("boveda", "D", ["1", "2", "3", "4"]),
                ("parcela", "E", ["1", "2", "3", "4"]),
                ("parcela", "F", ["1", "2", "3", "4"]),
                ("tierra", "G", ["1", "2", "3", "4"]),
            ]
            numero_global = 0
            for tipo, seccion, filas in plan:
                for fila in filas:
                    for pos in range(1, 2):  # un número por (seccion, fila)
                        numero_global += 1
                        sp = Sepultura(
                            tipo=tipo,
                            seccion=seccion,
                            fila=fila,
                            numero=str(numero_global),
                            estado="libre",   # se ajusta al inhumar
                            observaciones=f"{MARKER} sepultura {tipo} {seccion}-{fila}",
                            created_at=_now(),
                            activo=True,
                        )
                        db.add(sp)
                        sepulturas.append(sp)
            db.flush()
            resumen["sepulturas"] = len(sepulturas)
        except Exception as e:
            db.rollback()
            print(f"seed_demo cementerio: ERROR sepulturas: {e}")
            sepulturas = []

        # ---------- CONCESIONES (~15) a titulares (contribuyentes) ----------
        # id_contribuyente es referencia externa (nullable); usamos ids plausibles.
        concesiones = []
        titulares = [
            ("Gómez, Ramón Alberto", "12.345.678"),
            ("Fernández, María Cristina", "14.782.331"),
            ("López, Juan Carlos", "10.223.945"),
            ("Rodríguez, Ana Lucía", "22.110.876"),
            ("Martínez, Héctor Daniel", "8.998.221"),
            ("Sosa, Norma Beatriz", "16.554.019"),
            ("Díaz, Roberto Ángel", "11.874.663"),
            ("Torres, Silvia Mabel", "18.902.447"),
            ("Ramírez, Carlos Alberto", "13.667.882"),
            ("Flores, Marta Susana", "9.556.310"),
            ("Benítez, Jorge Luis", "20.334.771"),
            ("Acosta, Elena Rosa", "15.221.008"),
            ("Herrera, Miguel Ángel", "7.889.554"),
            ("Vega, Patricia Noemí", "24.667.113"),
            ("Ojeda, Raúl Eduardo", "17.443.290"),
        ]
        try:
            if not sepulturas:
                raise RuntimeError("no hay sepulturas para asociar concesiones")
            # concesiones ocupan las primeras sepulturas (las que tendrán difuntos)
            for i, (nombre, doc) in enumerate(titulares):
                sp = sepulturas[i % len(sepulturas)]
                anios = random.choice([5, 10, 20, 30])
                desde = date(2026, random.randint(1, 6), random.randint(1, 28))
                hasta = date(desde.year + anios, desde.month, desde.day)
                c = Concesion(
                    id_sepultura=sp.id,
                    id_contribuyente=1000 + i,  # ref externa plausible
                    titular_nombre=nombre,
                    titular_documento=doc,
                    fecha_desde=desde,
                    fecha_hasta=hasta,
                    anios=anios,
                    estado="vigente",
                    acto=f"Decreto {MARKER} {300 + i}/2026",
                    observaciones=f"{MARKER} concesión {anios} años",
                    created_at=_now(),
                    activo=True,
                )
                db.add(c)
                concesiones.append(c)
            db.flush()
            resumen["concesiones"] = len(concesiones)
        except Exception as e:
            db.rollback()
            print(f"seed_demo cementerio: ERROR concesiones: {e}")
            # re-crear sepulturas perdidas por rollback si aplica
            concesiones = []

        # ---------- DIFUNTOS + INHUMACIONES (~20) ----------
        # Fallecimientos históricos variados; inhumación ocupa la sepultura.
        difuntos = []
        inhumaciones = []
        nombres_dif = [
            "Gómez, Pedro Antonio", "Fernández, Rosa María", "López, Domingo",
            "Rodríguez, Clara Inés", "Martínez, José Luis", "Sosa, Ernesto",
            "Díaz, Amelia Teresa", "Torres, Ricardo Omar", "Ramírez, Dora",
            "Flores, Antonio Benito", "Benítez, Ramona", "Acosta, Vicente",
            "Herrera, Ángela María", "Vega, Aníbal", "Ojeda, Catalina",
            "Gutiérrez, Feliciano", "Molina, Irma", "Cabrera, Osvaldo",
            "Romero, Blanca Nieves", "Aguirre, Tomás",
        ]
        try:
            if not sepulturas:
                raise RuntimeError("no hay sepulturas para inhumar")
            for i, nombre in enumerate(nombres_dif):
                sp = sepulturas[i % len(sepulturas)]
                anio_fall = random.randint(1998, 2025)
                f_fall = date(anio_fall, random.randint(1, 12), random.randint(1, 28))
                # inhumación 1-4 días después del fallecimiento (mismo mes aprox)
                dia_inh = min(f_fall.day + random.randint(1, 3), 28)
                f_inh = date(anio_fall, f_fall.month, dia_inh)
                doc = f"{random.randint(5, 25)}.{random.randint(100, 999)}.{random.randint(100, 999)}"
                d = Difunto(
                    nombre=nombre,
                    documento=doc,
                    fecha_fallecimiento=f_fall,
                    fecha_inhumacion=f_inh,
                    id_sepultura=sp.id,
                    observaciones=f"{MARKER} difunto",
                    created_at=_now(),
                    activo=True,
                )
                db.add(d)
                db.flush()
                difuntos.append(d)

                inh = Inhumacion(
                    id_difunto=d.id,
                    id_sepultura=sp.id,
                    fecha=f_inh,
                    tipo="inhumacion",
                    observaciones=f"{MARKER} inhumación",
                    registrado_por="Administración Cementerio",
                    created_at=_now(),
                    activo=True,
                )
                db.add(inh)
                inhumaciones.append(inh)

                # marcar sepultura ocupada
                sp.estado = "ocupada"
            db.flush()
            resumen["difuntos"] = len(difuntos)
            resumen["inhumaciones"] = len(inhumaciones)
        except Exception as e:
            db.rollback()
            print(f"seed_demo cementerio: ERROR difuntos/inhumaciones: {e}")
            difuntos = []
            inhumaciones = []

        # ---------- TRASLADOS (algunos) ----------
        traslados = []
        try:
            if difuntos and len(sepulturas) > len(difuntos):
                # trasladar 4 difuntos a sepulturas libres (reducciones/traslados)
                libres = [s for s in sepulturas if s.estado != "ocupada"]
                for k in range(min(4, len(difuntos), len(libres))):
                    d = difuntos[k]
                    origen = d.id_sepultura
                    destino = libres[k]
                    f_tras = date(2026, random.randint(1, 6), random.randint(1, 28))
                    tr = Traslado(
                        id_difunto=d.id,
                        id_sepultura_origen=origen,
                        id_sepultura_destino=destino.id,
                        fecha=f_tras,
                        motivo=random.choice([
                            "Reducción a nicho familiar",
                            "Traslado por vencimiento de concesión",
                            "Solicitud de la familia",
                            "Reordenamiento de sección",
                        ]),
                        registrado_por="Administración Cementerio",
                        created_at=_now(),
                        activo=True,
                    )
                    db.add(tr)
                    traslados.append(tr)
                    # actualizar ubicación actual y estados
                    destino.estado = "ocupada"
                    d.id_sepultura = destino.id
                db.flush()
            resumen["traslados"] = len(traslados)
        except Exception as e:
            db.rollback()
            print(f"seed_demo cementerio: ERROR traslados: {e}")
            traslados = []

        # ---------- TASAS DE CEMENTERIO 2026 ----------
        tasas = []
        try:
            if not concesiones:
                raise RuntimeError("no hay concesiones para tasar")
            for c in concesiones:
                base = Decimal(random.choice(["8500.00", "12000.00", "18500.00", "24000.00"]))
                # tasa anual 2026
                t_anual = TasaCementerio(
                    id_concesion=c.id,
                    periodo="2026",
                    concepto="Tasa anual de mantenimiento",
                    importe=base,
                    estado=random.choice(["pendiente", "pagada", "pagada"]),
                    vencimiento=date(2026, 3, 31),
                    created_at=_now(),
                    activo=True,
                )
                db.add(t_anual)
                tasas.append(t_anual)
                # una cuota semestral extra para algunas
                if random.random() < 0.5:
                    t_sem = TasaCementerio(
                        id_concesion=c.id,
                        periodo="2026-07",
                        concepto="Cuota semestral - servicios",
                        importe=(base / Decimal("2")).quantize(Decimal("0.01")),
                        estado="pendiente",
                        vencimiento=date(2026, 7, 31),
                        created_at=_now(),
                        activo=True,
                    )
                    db.add(t_sem)
                    tasas.append(t_sem)
            db.flush()
            resumen["tasas"] = len(tasas)
        except Exception as e:
            db.rollback()
            print(f"seed_demo cementerio: ERROR tasas: {e}")
            tasas = []

        db.commit()
        print(
            "seed_demo cementerio: "
            f"+{resumen['sepulturas']} sepulturas, "
            f"+{resumen['concesiones']} concesiones, "
            f"+{resumen['difuntos']} difuntos, "
            f"+{resumen['inhumaciones']} inhumaciones, "
            f"+{resumen['traslados']} traslados, "
            f"+{resumen['tasas']} tasas"
        )
    except Exception as e:
        db.rollback()
        print(f"seed_demo cementerio: ERROR general, rollback: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
