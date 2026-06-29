"""Contrato de padrón para comercio (DD.JJ.) y vehículo (valuación DNRPA):
build_padron -> datos_calculo -> liquidador de emisiones.
"""
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
from models.cuenta import Cuenta  # noqa: E402
from models.comercio import Comercio  # noqa: E402
from models.comercio_rubro import ComercioRubro  # noqa: E402
from models.comercio_ddjj import ComercioDDJJ  # noqa: E402
from models.vehiculo import Vehiculo  # noqa: E402
from models.vehiculo_valuacion import VehiculoValuacion  # noqa: E402

_ps_spec = importlib.util.spec_from_file_location(
    "padron_service", os.path.join(IP_DIR, "services", "padron_service.py"))
_ps = importlib.util.module_from_spec(_ps_spec)
sys.modules["padron_service"] = _ps
_ps_spec.loader.exec_module(_ps)
PadronService = _ps.PadronService

_CALC = os.path.join(MODULES, "emisiones", "services")
if _CALC not in sys.path:
    sys.path.insert(0, _CALC)
from calculo.orquestador import liquidar_padron  # noqa: E402


def D(x):
    return Decimal(str(x))


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    s = sessionmaker(bind=engine)()
    yield s
    s.close()


def _entrada(items):
    return [{"id_contribuyente": it["id_contribuyente"], "id_objeto_imponible": it["id_inmueble"],
             "datos": it["datos_calculo"]} for it in items]


# ----------------------------------------------------------------------------- COMERCIO
def test_padron_comercio_y_liquidacion(db):
    db.add(Cuenta(id=10, id_contribuyente=88, id_tipo_tributo=2, numero_cuenta="COM-1"))
    db.add(Comercio(id=1, id_cuenta=10, cuit="20-30-5", gran_contribuyente=False))
    db.add(ComercioRubro(id=1, id_comercio=1, id_rubro=620010, principal=True))
    db.add_all([
        ComercioDDJJ(id=1, id_comercio=1, periodo=2025, mes=12, ingresos_declarados=D(500000)),
        ComercioDDJJ(id=2, id_comercio=1, periodo=2026, mes=5, ingresos_declarados=D(1000000),
                     fecha_presentacion=date(2026, 6, 10)),
    ])
    db.commit()

    items = PadronService(db).build_padron_comercios()
    assert len(items) == 1
    vars_ = items[0]["datos_calculo"]["variables"]
    assert vars_["C_INGRESOS"] == 1000000.0   # toma la última DD.JJ. (2026/05)
    assert vars_["C_RUBROS"] == "620010"

    # tasa de Seguridad e Higiene: ingresos * alícuota
    formula = {"ttas_Tasa": 2, "fort_orden": 1,
               "fort_aCancelar1": "#REDONDEO(@C_INGRESOS * 0.012, 2)"}
    out = liquidar_padron([formula], _entrada(items), 2026, 6)
    assert out[0]["lineas"][0]["a_cancelar"] == D("12000.00")   # 1.000.000 * 1,2%


# ----------------------------------------------------------------------------- VEHÍCULO
def test_padron_vehiculo_y_liquidacion(db):
    db.add(Cuenta(id=20, id_contribuyente=99, id_tipo_tributo=5, numero_cuenta="VEH-1"))
    db.add(Vehiculo(id=1, id_cuenta=20, dominio="AB123CD", codigo_modelo="FORD-FOCUS", anio=2020))
    db.add(VehiculoValuacion(id=1, codigo_modelo="FORD-FOCUS", anio=2020, ejercicio=2026,
                             valor=D(2000000)))
    db.commit()

    items = PadronService(db).build_padron_vehiculos()
    assert len(items) == 1
    assert items[0]["datos_calculo"]["variables"]["V_VALUACION"] == 2000000.0

    # patente: valuación * alícuota
    formula = {"ttas_Tasa": 5, "fort_orden": 1,
               "fort_aCancelar1": "#REDONDEO(@V_VALUACION * 0.015, 2)"}
    out = liquidar_padron([formula], _entrada(items), 2026, 6)
    assert out[0]["lineas"][0]["a_cancelar"] == D("30000.00")   # 2.000.000 * 1,5%


def test_vehiculo_sin_valuacion_marca_cero(db):
    db.add(Cuenta(id=21, id_contribuyente=1, id_tipo_tributo=5, numero_cuenta="VEH-2"))
    db.add(Vehiculo(id=2, id_cuenta=21, dominio="XX000XX", codigo_modelo="SIN-CAT", anio=1990))
    db.commit()
    items = PadronService(db).build_padron_vehiculos()
    assert items[0]["datos_calculo"]["variables"]["V_VALUACION"] == 0.0
    assert items[0]["datos_calculo"]["variables"]["V_TIENE_VALUACION"] == 0
