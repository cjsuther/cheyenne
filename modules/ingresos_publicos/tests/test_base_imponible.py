"""Tests de la base imponible de inmuebles (valuación / superficie / frente).

Valida: (1) que los modelos crean tablas y persisten en SQLite, y (2) que esos datos
alimentan correctamente al intérprete de fórmulas (#I_VALUACION / #I_SUPERFICIE) —
la cadena Cheyenne → motor de cálculo end-to-end.
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
from models.inmueble_valuacion import InmuebleValuacion  # noqa: E402
from models.inmueble_superficie import InmuebleSuperficie  # noqa: E402
from models.inmueble_frente import InmuebleFrente  # noqa: E402

# intérprete (módulo puro de emisiones), cargado por path
_INT_PATH = os.path.join(MODULES, "emisiones", "services", "calculo", "interprete.py")
_spec = importlib.util.spec_from_file_location("interprete_calc", _INT_PATH)
_interp = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = _interp
_spec.loader.exec_module(_interp)
Contexto = _interp.Contexto
evaluar = _interp.evaluar


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    s = Session()
    yield s
    s.close()


def _sembrar(db):
    # ids explícitos: SQLite no autoincrementa PK BigInteger (en Postgres sí, vía secuencia)
    # Inmueble 1: valuación tierra 100.000 + edificado 250.000
    db.add_all([
        InmuebleValuacion(id=1, id_inmueble=1, id_tipo_valuacion=1, ejercicio=2026,
                          valor=Decimal("100000"), fecha_vigencia=date(2026, 1, 1)),
        InmuebleValuacion(id=2, id_inmueble=1, id_tipo_valuacion=2, ejercicio=2026,
                          valor=Decimal("250000"), fecha_vigencia=date(2026, 1, 1)),
    ])
    # superficies: una vigente (2026-01) y una futura (2027-01, no vigente al período 2026/06)
    db.add_all([
        InmuebleSuperficie(id=1, id_inmueble=1, id_tipo_superficie=1, clase=1,
                           superficie=Decimal("80"), fecha_vigencia=date(2026, 1, 1)),
        InmuebleSuperficie(id=2, id_inmueble=1, id_tipo_superficie=1, clase=1,
                           superficie=Decimal("999"), fecha_vigencia=date(2027, 1, 1)),
    ])
    db.add(InmuebleFrente(id=1, id_inmueble=1, metros=Decimal("12.50"), ochava=False))
    db.commit()


# --------------------------------------------------------------- persistencia (modelos)
def test_persistencia_y_consulta(db):
    _sembrar(db)
    assert db.query(InmuebleValuacion).filter_by(id_inmueble=1).count() == 2
    assert db.query(InmuebleSuperficie).filter_by(id_inmueble=1).count() == 2
    f = db.query(InmuebleFrente).filter_by(id_inmueble=1).first()
    assert f.metros == Decimal("12.50")


def test_soft_delete(db):
    _sembrar(db)
    v = db.query(InmuebleValuacion).first()
    v.activo = False
    db.commit()
    activos = db.query(InmuebleValuacion).filter_by(id_inmueble=1, activo=True).count()
    assert activos == 1


# ------------------------------------------------- integración con el motor de cálculo
def _ctx_desde_db(db, id_inmueble, periodo, mes):
    vals = db.query(InmuebleValuacion).filter_by(id_inmueble=id_inmueble, activo=True).all()
    sups = db.query(InmuebleSuperficie).filter_by(id_inmueble=id_inmueble, activo=True).all()
    return Contexto(
        periodo=periodo, mes=mes,
        valuaciones=[{"tval_Codigo": v.id_tipo_valuacion, "valu_Valor": v.valor} for v in vals],
        superficies=[{
            "tips_Codigo": s.id_tipo_superficie, "tips_Clase": s.clase,
            "supe_Superficie": s.superficie,
            "supe_FechaVigencia": s.fecha_vigencia.year * 10000 + s.fecha_vigencia.month * 100 + s.fecha_vigencia.day,
        } for s in sups],
    )


def test_i_valuacion_alimentada_desde_db(db):
    _sembrar(db)
    ctx = _ctx_desde_db(db, 1, 2026, 6)
    assert evaluar("#I_VALUACION(0)", ctx) == Decimal("350000")  # todas
    assert evaluar("#I_VALUACION(1)", ctx) == Decimal("100000")  # solo tierra
    assert evaluar("#I_VALUACION(2)", ctx) == Decimal("250000")  # solo edificado


def test_i_superficie_respeta_vigencia(db):
    _sembrar(db)
    ctx = _ctx_desde_db(db, 1, 2026, 6)
    # solo la superficie vigente al 2026/06 (80); la de 2027 NO computa
    assert evaluar("#I_SUPERFICIE(1, 1)", ctx) == Decimal("80")


def test_formula_abl_simplificada(db):
    """Fórmula tipo ABL: valuación_total * alícuota + superficie * valor_m2."""
    _sembrar(db)
    ctx = _ctx_desde_db(db, 1, 2026, 6)
    ctx.variables["ALICUOTA"] = Decimal("0.012")
    ctx.variables["VALOR_M2"] = Decimal("15")
    f = "#REDONDEO(#I_VALUACION(0) * @ALICUOTA + #I_SUPERFICIE(1,1) * @VALOR_M2, 2)"
    # 350000*0.012 + 80*15 = 4200 + 1200 = 5400
    assert evaluar(f, ctx) == Decimal("5400.00")
