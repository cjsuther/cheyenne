"""Tests de persistencia de cuotas del plan (modelo + mapeo resultado->cuotas)."""
import importlib.util
import os
import sys
from datetime import date
from decimal import Decimal

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

MODULES = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
for p in (MODULES, IP_DIR):
    if p not in sys.path:
        sys.path.insert(0, p)

from shared.database import Base  # noqa: E402
from models.plan_pago import PlanPago  # noqa: E402
from models.plan_pago_cuota import PlanPagoCuota  # noqa: E402

_spec = importlib.util.spec_from_file_location(
    "plan_calculo", os.path.join(IP_DIR, "services", "plan_calculo.py"))
_pc = importlib.util.module_from_spec(_spec)
sys.modules["plan_calculo"] = _pc
_spec.loader.exec_module(_pc)
calcular_plan = _pc.calcular_plan
resultado_a_cuotas = _pc.resultado_a_cuotas


def D(x):
    return Decimal(str(x))


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    s = sessionmaker(bind=engine)()
    yield s
    s.close()


def test_resultado_a_cuotas_vencimientos():
    r = calcular_plan(monto_total=D(1000), cantidad_cuotas=3, tasa_interes_pct=D(5))
    filas = resultado_a_cuotas(7, r, primer_vencimiento=date(2026, 7, 10), periodicidad_meses=1)
    assert [f["fecha_vencimiento"] for f in filas] == [
        date(2026, 7, 10), date(2026, 8, 10), date(2026, 9, 10)]
    assert filas[0]["id_plan_pago"] == 7
    assert filas[0]["importe"] == D("367.21")


def test_persistencia_cuotas_de_plan(db):
    db.add(PlanPago(id=1, id_cuenta=10, cantidad_cuotas=3, importe_total=D(1000),
                    importe_anticipo=D(0)))
    db.commit()

    r = calcular_plan(monto_total=D(1000), cantidad_cuotas=3, tasa_interes_pct=D(5))
    for i, kw in enumerate(resultado_a_cuotas(1, r, primer_vencimiento=date(2026, 7, 10)), start=1):
        db.add(PlanPagoCuota(id=i, **kw))   # id explícito: SQLite no autoincrementa PK BigInteger
    db.commit()

    cuotas = db.query(PlanPagoCuota).filter_by(id_plan_pago=1).order_by(PlanPagoCuota.numero_cuota).all()
    assert len(cuotas) == 3
    assert sum(c.capital for c in cuotas) == D("1000.00")          # capital amortiza todo
    assert cuotas[0].importe == D("367.21")
    assert cuotas[2].fecha_vencimiento == date(2026, 9, 10)
