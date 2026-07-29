import sys
import os

# database.py del modulo crea un engine al importarse via shared.create_db_engine
# (pasa pool_size/max_overflow invalidos para sqlite y ademas el dialecto Postgres
# importa psycopg2 con avidez). Para importar los routers sin Postgres ni psycopg2:
# apuntamos DATABASE_URL a sqlite y parcheamos shared.create_db_engine a un engine
# sqlite simple ANTES de importar el modulo.
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, MOD)                                  # database, config, models, routers
sys.path.insert(0, os.path.join(MOD, "..", ".."))        # modules/ -> shared
sys.path.insert(0, os.path.join(MOD, ".."))              # modules/ (alt)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import BigInteger
from sqlalchemy.ext.compiler import compiles

# SQLite solo autoincrementa columnas INTEGER PRIMARY KEY, no BIGINT. Los modelos
# usan BigInteger como PK autoincremental: bajo sqlite lo renderizamos como INTEGER.


@compiles(BigInteger, "sqlite")
def _bigint_as_integer(element, compiler, **kw):  # pragma: no cover
    return "INTEGER"


import shared.database as _shdb


def _sqlite_engine(database_url: str):
    return create_engine("sqlite+pysqlite:///:memory:",
                         connect_args={"check_same_thread": False})


_shdb.create_db_engine = _sqlite_engine

from shared.database import Base
import models  # noqa: F401  registers ALL module tables on Base.metadata

engine = create_engine(
    "sqlite+pysqlite:///:memory:", connect_args={"check_same_thread": False}
)
Base.metadata.create_all(engine)
TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

import pytest


@pytest.fixture()
def db():
    s = TestingSession()
    try:
        yield s
    finally:
        s.rollback()
        s.close()


@pytest.fixture(autouse=True)
def _clean_tables():
    """Vacia las tablas que tocamos antes de cada test para aislamiento."""
    from models.compras import (
        Proveedor, Articulo, Pedido, PedidoItem, OrdenCompra, OrdenCompraItem,
        Recepcion, RecepcionItem, Stock,
        Deposito, StockPorDeposito, MovimientoStock,
        FacturaProveedor, FacturaItem,
    )
    s = TestingSession()
    for m in (FacturaItem, FacturaProveedor, MovimientoStock, StockPorDeposito,
              Deposito, Stock, RecepcionItem, Recepcion, OrdenCompraItem, OrdenCompra,
              PedidoItem, Pedido, Articulo, Proveedor):
        s.query(m).delete()
    s.commit()
    s.close()
    yield


# ── Helpers compartidos por los tests del circuito ───────────────────────────

class FakeRequest:
    """Stand-in de starlette.Request: solo necesitamos .headers.get('authorization')
    y .query_params para los endpoints. En los tests unitarios no hay HTTP real."""

    def __init__(self, headers=None, query_params=None):
        self.headers = headers or {}
        self.query_params = query_params or {}


# Usuario superadmin: _requiere() cortocircuita en superuser y no exige permisos.
SUPER = {"superuser": True, "nombre_apellido": "Tester", "codigo": "tester", "permisos": []}


@pytest.fixture()
def cu():
    return dict(SUPER)
