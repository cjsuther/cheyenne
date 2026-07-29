"""
Seed de datos DEMO para el módulo Crédito Público.
Puebla credito_emprestitos con ~5 empréstitos, su plan de credito_cuotas
(amortización francés/alemán, coherente: suma de cuotas ~ capital + intereses)
y 2-3 credito_desembolsos por empréstito (desembolsos <= monto original).

Idempotente: si ya existen empréstitos con código "DEMO-*", omite.

    docker compose exec credito_publico python seed_demo.py
"""
import sys
import os
from datetime import date, datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.credito import Emprestito, CuotaEmprestito, Desembolso

Q = Decimal("0.01")
CERO = Decimal("0.00")


def _dec(v):
    return Decimal(str(v or 0)).quantize(Q)


def _add_meses(d: date, meses: int) -> date:
    m = d.month - 1 + meses
    y = d.year + m // 12
    mm = m % 12 + 1
    return date(y, mm, min(d.day, 28))


# Definición de los empréstitos DEMO (datos argentinos realistas).
# monto en pesos (ARS) o USD según moneda.
EMPRESTITOS = [
    dict(codigo="DEMO-EMP-2025-001", denominacion="Préstamo BICE - Obras de Pavimentación Urbana",
         acreedor="Banco de Inversión y Comercio Exterior (BICE)", moneda="ARS", tipo="prestamo",
         monto=Decimal("120000000.00"), tasa=Decimal("38.5000"), plazo=48, sistema="frances",
         fecha_toma=date(2025, 3, 15),
         desembolsos=[(date(2025, 3, 20), Decimal("70000000.00"), "real",  "Primer tramo obra pavimento"),
                      (date(2025, 6, 10), Decimal("40000000.00"), "real",  "Segundo tramo obra pavimento"),
                      (date(2025, 9, 5),  Decimal("10000000.00"), "estimado", "Tramo final estimado")]),

    dict(codigo="DEMO-EMP-2025-002", denominacion="Fondo Fiduciario Federal de Infraestructura Regional",
         acreedor="Ministerio de Economía de la Nación - FFFIR", moneda="ARS", tipo="prestamo",
         monto=Decimal("85000000.00"), tasa=Decimal("29.0000"), plazo=60, sistema="aleman",
         fecha_toma=date(2025, 5, 2),
         desembolsos=[(date(2025, 5, 8),  Decimal("50000000.00"), "real", "Desembolso inicial red cloacal"),
                      (date(2025, 8, 15), Decimal("35000000.00"), "real", "Segundo desembolso red cloacal")]),

    dict(codigo="DEMO-EMP-2025-003", denominacion="Emisión Bono Municipal Serie I - Alumbrado LED",
         acreedor="Mercado Argentino de Valores (colocación privada)", moneda="ARS", tipo="bono",
         monto=Decimal("45000000.00"), tasa=Decimal("42.0000"), plazo=36, sistema="frances",
         fecha_toma=date(2025, 7, 1),
         desembolsos=[(date(2025, 7, 3),  Decimal("45000000.00"), "real", "Colocación total del bono")]),

    dict(codigo="DEMO-EMP-2026-004", denominacion="Adelanto Transitorio Cuenta Única del Tesoro Provincial",
         acreedor="Banco de la Provincia (Tesorería Provincial)", moneda="ARS", tipo="adelanto",
         monto=Decimal("30000000.00"), tasa=Decimal("55.0000"), plazo=12, sistema="frances",
         fecha_toma=date(2026, 2, 10),
         desembolsos=[(date(2026, 2, 10), Decimal("30000000.00"), "real", "Adelanto único acreditado")]),

    dict(codigo="DEMO-EMP-2026-005", denominacion="Crédito CAF - Programa de Agua Potable y Saneamiento",
         acreedor="CAF - Banco de Desarrollo de América Latina", moneda="USD", tipo="prestamo",
         monto=Decimal("2500000.00"), tasa=Decimal("6.5000"), plazo=84, sistema="aleman",
         fecha_toma=date(2026, 4, 1),
         desembolsos=[(date(2026, 4, 5),  Decimal("1000000.00"), "real",     "Primer desembolso planta potabilizadora"),
                      (date(2026, 7, 20), Decimal("800000.00"),  "real",     "Segundo desembolso red distribución"),
                      (date(2026, 11, 1), Decimal("700000.00"),  "estimado", "Tercer desembolso estimado")]),
]


def _plan_amortizacion(monto, tasa_anual, plazo, sistema, fecha_toma):
    """Replica la lógica del router: devuelve lista de dicts de cuota coherentes.
    En francés cuota constante; en alemán capital constante. Ajuste final cierra saldo."""
    P = _dec(monto)
    n = plazo
    i = (_dec(tasa_anual) / Decimal("100") / Decimal("12"))
    saldo = P
    cuota_fija = None
    if sistema == "frances" and i > 0:
        factor = (Decimal(1) - (Decimal(1) + i) ** (-n))
        cuota_fija = (P * i / factor).quantize(Q)
    cuotas = []
    for k in range(1, n + 1):
        if sistema == "aleman" or i == 0:
            capital = (P / Decimal(n)).quantize(Q)
            interes = (saldo * i).quantize(Q)
        else:
            interes = (saldo * i).quantize(Q)
            capital = (cuota_fija - interes).quantize(Q)
        if k == n:
            capital = saldo
        saldo = (saldo - capital).quantize(Q)
        cuotas.append(dict(numero=k, fecha_vencimiento=_add_meses(fecha_toma, k),
                           capital=capital, interes=interes,
                           total=(capital + interes).quantize(Q),
                           saldo_posterior=saldo))
    return cuotas


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # --- Idempotencia ---
        ya = db.query(Emprestito).filter(Emprestito.codigo.like("DEMO-%")).first()
        if ya:
            print("seed_demo credito_publico: ya sembrado, omito")
            return

        n_emp = n_cuo = n_des = 0
        now = datetime.now(timezone.utc)

        for spec in EMPRESTITOS:
            try:
                # 1) Empréstito
                cuotas_plan = _plan_amortizacion(spec["monto"], spec["tasa"], spec["plazo"],
                                                 spec["sistema"], spec["fecha_toma"])
                desem_reales = sum((_dec(imp) for (_f, imp, est, _d) in spec["desembolsos"]
                                    if est == "real"), CERO)
                # saldo_capital = capital efectivamente desembolsado (real), tope al monto original
                saldo_cap = min(desem_reales, _dec(spec["monto"]))

                emp = Emprestito(
                    codigo=spec["codigo"], denominacion=spec["denominacion"], acreedor=spec["acreedor"],
                    moneda=spec["moneda"], tipo=spec["tipo"], monto_original=_dec(spec["monto"]),
                    tasa_anual=_dec(spec["tasa"]), plazo_meses=spec["plazo"], sistema=spec["sistema"],
                    fecha_toma=spec["fecha_toma"], saldo_capital=saldo_cap, desembolsado=desem_reales,
                    estado="vigente", creado_por="seed_demo", created_at=now, activo=True,
                )
                db.add(emp)
                db.flush()  # obtener emp.id
                n_emp += 1

                # 2) Cuotas (cronograma completo)
                for c in cuotas_plan:
                    db.add(CuotaEmprestito(
                        id_emprestito=emp.id, numero=c["numero"],
                        fecha_vencimiento=c["fecha_vencimiento"], capital=c["capital"],
                        interes=c["interes"], total=c["total"], saldo_posterior=c["saldo_posterior"],
                        estado="pendiente",
                    ))
                    n_cuo += 1

                # 3) Desembolsos
                for (f, imp, est, det) in spec["desembolsos"]:
                    db.add(Desembolso(id_emprestito=emp.id, fecha=f, importe=_dec(imp),
                                      estado=est, detalle=det, created_at=now))
                    n_des += 1

                db.flush()
            except Exception as ex:
                db.rollback()
                print(f"seed_demo credito_publico: fallo en {spec['codigo']}: {ex}")

        db.commit()
        print(f"seed_demo credito_publico: +{n_emp} emprestitos, +{n_cuo} cuotas, +{n_des} desembolsos")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
