"""Harness de tests para el módulo contaduria.

- SQLite in-memory (BigInteger -> INTEGER para que el autoincrement de las PK funcione).
- Se importan los modelos ORM para registrar las tablas en Base.metadata.
- Los routers (gastos, retenciones) se cargan POR RUTA para evitar routers/__init__.py,
  que arrastra database.py (engine Postgres real, sin psycopg2 en el venv de tests).
- `database` se stubea: los routers solo usan `get_db` como dependencia FastAPI; en los
  tests llamamos las funciones de servicio pasando `db` a mano, sin pasar por HTTP/auth.
"""
import importlib.util
import os
import sys
import types

import pytest

# modules/contaduria/  (para importar config, models, routers por path)
MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# modules/  (para importar el paquete shared)
MODULES = os.path.abspath(os.path.join(MOD, ".."))
sys.path.insert(0, MOD)
sys.path.insert(0, MODULES)

from shared.database import Base  # noqa: E402
import models  # noqa: E402,F401  registra TODAS las tablas del modulo en Base.metadata

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.ext.compiler import compiles  # noqa: E402
from sqlalchemy import BigInteger  # noqa: E402


# SQLite solo autoincrementa columnas INTEGER PRIMARY KEY, no BIGINT. Los modelos
# usan BigInteger como PK; en SQLite lo compilamos a INTEGER para que el autoincrement
# funcione en los tests (en Postgres real sigue siendo BIGINT).
@compiles(BigInteger, "sqlite")
def _bigint_as_integer(element, compiler, **kw):  # noqa: ANN001
    return "INTEGER"


engine = create_engine(
    "sqlite+pysqlite:///:memory:",
    connect_args={"check_same_thread": False},
)
Base.metadata.create_all(engine)
TestingSession = sessionmaker(bind=engine)


# ── Stub del modulo `database` ──────────────────────────────────────────
# database.py crea un engine Postgres a nivel de import y falla sin psycopg2.
# Los routers solo importan `get_db` de ahi (una dependencia FastAPI que en los
# tests no se usa porque llamamos las funciones de servicio pasando `db` a mano).
_fake_db = types.ModuleType("database")
_fake_db.get_db = lambda: None
sys.modules["database"] = _fake_db


def _load_by_path(name, relpath):
    """Carga un .py del modulo por ruta, evitando routers/__init__.py (que
    arrastra TODOS los routers y por ende el engine Postgres real)."""
    path = os.path.join(MOD, relpath)
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec)
    sys.modules[name] = m
    spec.loader.exec_module(m)
    return m


# Registramos un paquete `routers` liviano para permitir imports relativos si los hubiera.
_pkg = types.ModuleType("routers")
_pkg.__path__ = [os.path.join(MOD, "routers")]
sys.modules["routers"] = _pkg

gastos = _load_by_path("routers.gastos", os.path.join("routers", "gastos.py"))
retenciones = _load_by_path("routers.retenciones", os.path.join("routers", "retenciones.py"))


@pytest.fixture()
def db():
    # Aislamiento total entre tests: recreamos el esquema en cada uno para que
    # los rows COMMITEADOS (gastos con numero único por año, retenciones, etc.)
    # de un test no colisionen ni contaminen al siguiente.
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    s = TestingSession()
    try:
        yield s
    finally:
        s.rollback()
        s.close()
