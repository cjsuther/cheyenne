"""Test de CONTRATO entre módulos: `ingresos_publicos.build_padron` produce el `datos_calculo`
que el motor de cálculo de `emisiones` consume para liquidar. Valida la cadena cruzada sin HTTP.
"""
import importlib.util
import os
import sys
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
from models.inmueble import Inmueble  # noqa: E402
from models.inmueble_valuacion import InmuebleValuacion  # noqa: E402
from models.inmueble_superficie import InmuebleSuperficie  # noqa: E402
from models.inmueble_frente import InmuebleFrente  # noqa: E402

# PadronService cargado por path (services/__init__.py arrastra FastAPI)
_ps_spec = importlib.util.spec_from_file_location(
    "padron_service", os.path.join(IP_DIR, "services", "padron_service.py")
)
_ps = importlib.util.module_from_spec(_ps_spec)
sys.modules["padron_service"] = _ps
_ps_spec.loader.exec_module(_ps)
PadronService = _ps.PadronService

# motor de cálculo de emisiones (paquete puro `calculo`)
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


def _sembrar(db):
    db.add(Cuenta(id=1, id_contribuyente=77, id_tipo_tributo=1, numero_cuenta="INM-0001"))
    db.add(Inmueble(id=1, id_cuenta=1, circuito="A", sector="2", fraccion="0", parcela="5"))
    db.add_all([
        InmuebleValuacion(id=1, id_inmueble=1, id_tipo_valuacion=1, valor=D(100000),
                          fecha_vigencia=__import__("datetime").date(2026, 1, 1)),
        InmuebleValuacion(id=2, id_inmueble=1, id_tipo_valuacion=2, valor=D(250000),
                          fecha_vigencia=__import__("datetime").date(2026, 1, 1)),
    ])
    db.add(InmuebleSuperficie(id=1, id_inmueble=1, id_tipo_superficie=1, clase=1,
                              superficie=D(80),
                              fecha_vigencia=__import__("datetime").date(2026, 1, 1)))
    db.add(InmuebleFrente(id=1, id_inmueble=1, metros=D("12.50")))
    db.commit()


def test_build_padron_arma_datos_calculo(db):
    _sembrar(db)
    items = PadronService(db).build_padron_inmuebles()
    assert len(items) == 1
    it = items[0]
    assert it["id_contribuyente"] == 77
    assert it["numero_cuenta"] == "INM-0001"
    d = it["datos_calculo"]
    assert len(d["valuaciones"]) == 2
    assert d["variables"]["I_METROS_FRENTE"] == 12.5
    # la fecha de vigencia viaja como AAAAMMDD
    assert d["superficies"][0]["supe_FechaVigencia"] == 20260101


def test_contrato_padron_alimenta_liquidador(db):
    """El datos_calculo producido por ingresos_publicos liquida en el motor de emisiones."""
    _sembrar(db)
    items = PadronService(db).build_padron_inmuebles()
    entrada = [
        {"id_contribuyente": it["id_contribuyente"], "id_objeto_imponible": it["id_inmueble"],
         "datos": it["datos_calculo"]}
        for it in items
    ]
    # fórmula ABL que sólo usa valuación + superficie (lo que el padrón ya provee)
    formula = {
        "ttas_Tasa": 1, "ttas_SubTasa": 0, "fort_Numero": 1, "fort_orden": 1,
        "fort_aCancelar1": "#REDONDEO(#I_VALUACION(0) * 0.012 + #I_SUPERFICIE(1,1) * 15, 2)",
    }
    out = liquidar_padron([formula], entrada, 2026, 6)
    assert len(out) == 1
    # 350000*0.012 + 80*15 = 4200 + 1200 = 5400
    assert out[0]["lineas"][0]["a_cancelar"] == D("5400.00")
