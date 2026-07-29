"""
Seed de datos DEMO para el módulo WAV (autogestión / débito automático).

Puebla cuentas de autogestión, adhesiones a débito automático (CBU/tarjeta) y
lotes de débito con sus ítems (algunos debitados, otros rechazados), para que
las pantallas de débito automático se vean llenas. Ejercicio de la demo: 2026.

Ejecutar:
    docker compose exec wav python seed_demo.py

Idempotente: si detecta lotes/ítems DEMO ya sembrados, no hace nada.
WAV no lee la base de otros módulos: id_contribuyente se guarda como referencia
numérica (best-effort). Si ya existen cuentas, las reutiliza como ancla.
"""
import sys
import os
from datetime import datetime, timezone, timedelta
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.cuenta import Cuenta
from models.adhesion_debito import AdhesionDebito
from models.lote_debito import LoteDebito
from models.debito_item import DebitoItem


# Marcador para idempotencia: los ítems DEMO llevan este prefijo en 'titular'
DEMO_MARK = "[DEMO]"

# Titulares argentinos realistas con su medio y datos enmascarados
TITULARES = [
    ("García, María Fernanda", "cbu", "0170099220000012345678", "20-24567890-3"),
    ("Rodríguez, Juan Carlos", "cbu", "0110599530000045678901", "20-18234567-1"),
    ("Fernández, Ana Laura", "tarjeta", "450799******3421", "27-30123456-4"),
    ("López, Diego Alberto", "cbu", "0140099803200011223344", "20-27890123-9"),
    ("Martínez, Silvia Beatriz", "cbu", "0070099930000098765432", "27-16543210-2"),
    ("González, Roberto Ariel", "tarjeta", "553012******8890", "20-22345678-6"),
    ("Sánchez, Claudia Marisa", "cbu", "0290099910000055667788", "27-25678901-5"),
    ("Romero, Pablo Nicolás", "cbu", "0170099220000099887766", "20-31234567-8"),
    ("Díaz, Verónica Elizabeth", "tarjeta", "377812******4455", "27-19876543-0"),
    ("Torres, Marcelo Fabián", "cbu", "0110599530000033445566", "20-26789012-7"),
    ("Ruiz, Gabriela Soledad", "cbu", "0140099803200077889900", "27-28901234-3"),
    ("Flores, Sergio Daniel", "tarjeta", "450799******1198", "20-15678901-4"),
    ("Acosta, Natalia Andrea", "cbu", "0070099930000012344321", "27-32456789-1"),
    ("Benítez, Hernán Gustavo", "cbu", "0290099910000078900987", "20-21098765-6"),
    ("Medina, Lorena Vanesa", "tarjeta", "553012******2277", "27-24678901-8"),
    ("Suárez, Alejandro José", "cbu", "0170099220000045612378", "20-29012345-2"),
    ("Ramírez, Carla Daniela", "cbu", "0110599530000088776655", "27-27345678-9"),
    ("Herrera, Facundo Emanuel", "tarjeta", "450799******6633", "20-33456789-0"),
    ("Aguirre, Paula Cecilia", "cbu", "0140099803200099001122", "27-23456789-4"),
    ("Molina, Cristian Adrián", "cbu", "0070099930000067788990", "20-20123456-5"),
]

# Tributos típicos municipales -> id_tipo_tributo ancla
TIPO_TRIBUTO_INMOBILIARIA = 1   # Tasa por Servicios Generales / Inmobiliaria
TIPO_TRIBUTO_AUTOMOTOR = 2      # Patente Automotor
ESTADO_CUENTA_ACTIVA = 10


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    resumen = {"cuentas": 0, "adhesiones": 0, "lotes": 0, "items": 0}

    try:
        # ── Idempotencia ────────────────────────────────────────────────
        ya = (
            db.query(LoteDebito)
            .filter(LoteDebito.periodo.like("2026-%"))
            .filter(LoteDebito.medio.in_(("cbu", "tarjeta")))
            .join(DebitoItem, DebitoItem.id_lote == LoteDebito.id)
            .filter(DebitoItem.titular.like(f"{DEMO_MARK}%"))
            .first()
        )
        if ya:
            print("seed_demo wav: ya sembrado, omito")
            db.close()
            return

        # ── Cuentas ancla ───────────────────────────────────────────────
        # Reutilizamos cuentas existentes; si faltan, creamos las de DEMO.
        cuentas = db.query(Cuenta).filter(Cuenta.activo == True).all()  # noqa: E712
        existentes = len(cuentas)

        # base de id_contribuyente para las cuentas DEMO (referencia numérica)
        base_contrib = 1000
        nuevas_cuentas = []
        objetivo = 20
        # cuánto falta para llegar a ~20 cuentas
        faltan = max(0, objetivo - existentes)
        for i in range(faltan):
            tipo = TIPO_TRIBUTO_INMOBILIARIA if i % 3 != 0 else TIPO_TRIBUTO_AUTOMOTOR
            # numero_cuenta con el mismo formato que el service
            n = existentes + i + 1
            c = Cuenta(
                id_contribuyente=base_contrib + i,
                id_tipo_tributo=tipo,
                numero_cuenta=f"WAV-{tipo:03d}-{n:06d}",
                id_estado_cuenta=ESTADO_CUENTA_ACTIVA,
                activo=True,
            )
            db.add(c)
            nuevas_cuentas.append(c)
        db.flush()
        resumen["cuentas"] = len(nuevas_cuentas)

        cuentas = db.query(Cuenta).filter(Cuenta.activo == True).all()  # noqa: E712
        # nos quedamos con hasta 20 cuentas para adherir al débito
        cuentas = cuentas[:20]

        # ── Adhesiones a débito automático ──────────────────────────────
        adhesiones = []
        for idx, c in enumerate(cuentas):
            titular, medio, datos, _cuit = TITULARES[idx % len(TITULARES)]
            # ¿ya tiene adhesión activa? evitar duplicar
            ya_adh = (
                db.query(AdhesionDebito)
                .filter(AdhesionDebito.id_cuenta == c.id, AdhesionDebito.activo == True)  # noqa: E712
                .first()
            )
            if ya_adh:
                adhesiones.append(ya_adh)
                continue
            adh = AdhesionDebito(
                id_cuenta=c.id,
                medio=medio,
                datos=datos,
                titular=titular,
                activo=True,
                created_at=datetime(2026, 1, 15, tzinfo=timezone.utc),
            )
            db.add(adh)
            adhesiones.append(adh)
            resumen["adhesiones"] += 1
        db.flush()

        # ── Lotes de débito + ítems ─────────────────────────────────────
        # 4 lotes: dos períodos x dos medios. Algunos debitados, otros rechazados.
        periodos = ["2026-05", "2026-06"]
        motivos_rechazo = [
            "Saldo insuficiente",
            "CBU inexistente o cerrado",
            "Tarjeta vencida",
            "Débito rechazado por el banco",
        ]

        # importes tipo por medio/tributo (ARS realistas)
        def importe_para(c):
            if c.id_tipo_tributo == TIPO_TRIBUTO_AUTOMOTOR:
                return Decimal("18450.75")
            return Decimal("9875.40")

        lote_idx = 0
        for periodo in periodos:
            for medio in ("cbu", "tarjeta"):
                # adhesiones de este medio
                adh_medio = [a for a in adhesiones if a.medio == medio]
                if not adh_medio:
                    continue
                # mapa id_cuenta -> cuenta
                cuenta_by_id = {c.id: c for c in cuentas}

                items_data = []
                total = Decimal("0")
                for j, a in enumerate(adh_medio):
                    c = cuenta_by_id.get(a.id_cuenta)
                    if c is None:
                        continue
                    imp = importe_para(c)
                    # ~1 de cada 4 rechazado (según período para variar)
                    rechazado = ((j + lote_idx) % 4 == 0)
                    items_data.append((a, c, imp, rechazado))
                    if not rechazado:
                        total += imp

                if not items_data:
                    continue

                estado_lote = "procesado" if periodo == "2026-05" else "enviado"
                fecha_lote = datetime(2026, int(periodo.split("-")[1]), 5, tzinfo=timezone.utc)
                lote = LoteDebito(
                    periodo=periodo,
                    medio=medio,
                    estado=estado_lote,
                    total=total,
                    cantidad=len(items_data),
                    fecha=fecha_lote,
                    activo=True,
                    created_at=fecha_lote,
                )
                db.add(lote)
                db.flush()
                resumen["lotes"] += 1

                for k, (a, c, imp, rechazado) in enumerate(items_data):
                    if periodo == "2026-05":
                        estado_item = "rechazado" if rechazado else "debitado"
                    else:
                        # lote enviado aún no procesado: pendientes salvo algún rechazo temprano
                        estado_item = "rechazado" if rechazado else "pendiente"
                    motivo = motivos_rechazo[k % len(motivos_rechazo)] if rechazado else None
                    item = DebitoItem(
                        id_lote=lote.id,
                        id_adhesion=a.id,
                        id_cuenta=c.id,
                        medio=medio,
                        datos=a.datos,
                        titular=f"{DEMO_MARK} {a.titular}",
                        importe=imp,
                        estado=estado_item,
                        motivo_rechazo=motivo,
                        created_at=fecha_lote,
                    )
                    db.add(item)
                    resumen["items"] += 1
                lote_idx += 1

        db.commit()
    except Exception as e:  # pragma: no cover
        db.rollback()
        print(f"seed_demo wav: ERROR, se hizo rollback: {e}")
        db.close()
        raise

    print(
        "seed_demo wav: "
        f"+{resumen['cuentas']} cuentas, "
        f"+{resumen['adhesiones']} adhesiones, "
        f"+{resumen['lotes']} lotes_debito, "
        f"+{resumen['items']} debito_items"
    )
    db.close()


if __name__ == "__main__":
    seed()
