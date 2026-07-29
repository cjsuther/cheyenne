"""Fixtures de test para el módulo presupuesto.

Todo corre sobre SQLite en memoria: sin Postgres, sin red, determinístico.
Se registran TODAS las tablas del módulo en Base.metadata importando `models`.
"""
import os
import sys

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Rutas: MOD = modules/presupuesto ; MODULES = modules/ (donde vive el paquete `shared`)
MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODULES = os.path.abspath(os.path.join(MOD, ".."))
for p in (MOD, MODULES):
    if p not in sys.path:
        sys.path.insert(0, p)

from shared.database import Base  # noqa: E402
import models  # noqa: E402,F401  registra todas las tablas del módulo

# Los modelos usan BigInteger como PK autoincremental. SQLite sólo autoincrementa
# una columna declarada INTEGER PRIMARY KEY, no BIGINT -> el id quedaría NULL.
# Renderizamos BIGINT como INTEGER en el dialecto sqlite (sólo para tests).
from sqlalchemy import BigInteger  # noqa: E402
from sqlalchemy.ext.compiler import compiles  # noqa: E402


@compiles(BigInteger, "sqlite")
def _bigint_as_integer(element, compiler, **kw):  # noqa: ANN001
    return "INTEGER"


@pytest.fixture()
def db():
    # Engine nuevo por test -> aislamiento total, sin arrastrar estado entre casos.
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False)
    s = Session()
    try:
        yield s
    finally:
        s.rollback()
        s.close()
        engine.dispose()
