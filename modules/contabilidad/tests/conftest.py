import importlib.util
import os
import sys
import types

import pytest

# modules/contabilidad/  (para importar config, models, routers por path)
MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# modules/  (para importar el paquete shared)
MODULES = os.path.abspath(os.path.join(MOD, ".."))
sys.path.insert(0, MOD)
sys.path.insert(0, MODULES)

from shared.database import Base  # noqa: E402
import models  # noqa: E402,F401  registra TODAS las tablas del modulo en Base.metadata

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.dialects import sqlite as _sqlite_dialect  # noqa: E402
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

# _common primero (transacciones importa desde el paquete relativo `._common`)
# Registramos un paquete `routers` liviano para permitir el import relativo.
_pkg = types.ModuleType("routers")
_pkg.__path__ = [os.path.join(MOD, "routers")]
sys.modules["routers"] = _pkg

_common = _load_by_path("routers._common", os.path.join("routers", "_common.py"))
_pkg._common = _common
transacciones = _load_by_path("routers.transacciones", os.path.join("routers", "transacciones.py"))

imputar = transacciones.imputar
_crear_asiento = _common._crear_asiento


@pytest.fixture()
def db():
    s = TestingSession()
    try:
        yield s
    finally:
        s.rollback()
        s.close()
