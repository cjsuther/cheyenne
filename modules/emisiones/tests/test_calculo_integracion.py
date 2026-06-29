"""Integración: FormulaTasa (BD) -> conversor -> orquestador -> liquidaciones.

Siembra fórmulas y un padrón en SQLite y corre la cadena completa que ejecuta el
`calculo_service` (sin importar el servicio, que arrastra FastAPI). Demuestra que una
emisión, con fórmulas y base imponible cargadas, **produce liquidaciones reales**.
"""
import os
import sys
from decimal import Decimal

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

MODULES = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
for p in (MODULES, EMISIONES_DIR, os.path.join(EMISIONES_DIR, "services")):
    if p not in sys.path:
        sys.path.insert(0, p)

from shared.database import Base  # noqa: E402
from models.formula_tasa import FormulaTasa, FormulaTasaAcumulador  # noqa: E402
from models.padron import ContribuyentePadron  # noqa: E402
from calculo.repo import formula_a_dict  # noqa: E402
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
    db.add(FormulaTasa(
        id=1, tipo_tributo="inmuebles", ttas_tasa=1, ttas_subtasa=0, fort_numero=1, fort_orden=1,
        fort_condicion='@I_CUOTA_ANUAL="N"',
        fort_a_cancelar_1="#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01, 2)",
        fort_a_pagar_1="#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01 * 0.90, 2)",
    ))
    db.add_all([
        FormulaTasaAcumulador(id=1, ttas_tasa=1, ttas_subtasa=0, fort_numero=1,
                              ftac_numero=1, ftac_importe='#SI(@I_ZONATARI="1", 2, 1)'),
        FormulaTasaAcumulador(id=2, ttas_tasa=1, ttas_subtasa=0, fort_numero=1,
                              ftac_numero=5, ftac_importe="#I_VALUACION(0)"),
    ])
    db.add(ContribuyentePadron(
        id=1, id_padron=1, id_contribuyente=77, id_objeto_imponible=88,
        datos_calculo={
            "variables": {"I_ZONATARI": "1", "I_CUOTA_ANUAL": "N"},
            "valuaciones": [
                {"tval_Codigo": 1, "valu_Valor": 100000},
                {"tval_Codigo": 2, "valu_Valor": 250000},
            ],
        },
    ))
    db.commit()


def _formulas_desde_db(db, tipo_tributo):
    rows = db.query(FormulaTasa).filter_by(tipo_tributo=tipo_tributo, activo=True).all()
    out = []
    for f in rows:
        acums = db.query(FormulaTasaAcumulador).filter_by(
            ttas_tasa=f.ttas_tasa, ttas_subtasa=f.ttas_subtasa, fort_numero=f.fort_numero, activo=True
        ).all()
        out.append(formula_a_dict(f, acums))
    return out


def test_formula_tasa_persiste(db):
    _sembrar(db)
    assert db.query(FormulaTasa).count() == 1
    assert db.query(FormulaTasaAcumulador).count() == 2
    assert db.query(ContribuyentePadron).first().datos_calculo["variables"]["I_ZONATARI"] == "1"


def test_cadena_completa_produce_liquidaciones(db):
    _sembrar(db)
    formulas = _formulas_desde_db(db, "inmuebles")
    assert len(formulas) == 1 and len(formulas[0]["acumuladores"]) == 2

    contribs = db.query(ContribuyentePadron).filter_by(id_padron=1, activo=True).all()
    entrada = [
        {"id_contribuyente": c.id_contribuyente, "id_objeto_imponible": c.id_objeto_imponible,
         "datos": c.datos_calculo or {}}
        for c in contribs
    ]
    resultado = liquidar_padron(formulas, entrada, 2026, 6)

    assert len(resultado) == 1
    r = resultado[0]
    assert r["id_contribuyente"] == 77
    assert r["lineas"][0]["a_cancelar"] == D("8400.00")   # 350000 * 0.012 * 2
    assert r["lineas"][0]["a_pagar"] == D("7560.00")      # con 10% descuento
    # ¡produce liquidaciones! (a diferencia del placeholder que daba 0)
    assert sum(len(x["lineas"]) for x in resultado) == 1
