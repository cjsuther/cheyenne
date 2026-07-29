import sys
import os

# database.py del modulo crea un engine al importarse via shared.create_db_engine
# (pasa pool_size/max_overflow invalidos para sqlite y ademas el dialecto Postgres
# importa psycopg2 con avidez). Para importar los servicios sin Postgres ni psycopg2:
# apuntamos DATABASE_URL a sqlite y parcheamos shared.create_db_engine a un engine
# sqlite simple ANTES de importar el modulo.
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, MOD)                                  # database, config, models, services
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
import models  # noqa: F401  registra TODAS las tablas del modulo en Base.metadata

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
def _reset_settings():
    """get_settings() esta cacheado con lru_cache: es un singleton compartido.
    Los tests mutan atributos de politica (historial_size, min_length, etc.);
    restauramos los defaults antes de cada test para evitar contaminacion."""
    from config import get_settings
    s = get_settings()
    defaults = dict(
        max_intentos_fallidos=5,
        bloqueo_minutos=15,
        password_min_length=8,
        password_dias_expiracion=90,
        password_historial_size=5,
    )
    for k, v in defaults.items():
        setattr(s, k, v)
    yield
    for k, v in defaults.items():
        setattr(s, k, v)


@pytest.fixture(autouse=True)
def _clean_tables():
    """Vacia las tablas que tocamos antes de cada test para aislamiento."""
    from models import (
        Usuario, Perfil, Permiso, Acceso, PasswordHistorial, UsuarioPermiso,
    )
    from models.usuario import usuario_perfil
    from models.perfil import perfil_permiso
    s = TestingSession()
    # asociaciones primero (m2m)
    s.execute(usuario_perfil.delete())
    s.execute(perfil_permiso.delete())
    for m in (UsuarioPermiso, PasswordHistorial, Acceso, Usuario, Permiso, Perfil):
        s.query(m).delete()
    s.commit()
    s.close()
    yield


# ── Helpers de fabricacion ───────────────────────────────────────────────────

def crear_usuario(db, codigo="u1", estado=10, superuser=0, **kw):
    from models import Usuario
    u = Usuario(
        codigo=codigo,
        nombre_apellido=kw.pop("nombre_apellido", "Test User"),
        email=kw.pop("email", f"{codigo}@example.com"),
        id_estado_usuario=estado,
        superuser=superuser,
        intentos_fallidos=kw.pop("intentos_fallidos", 0),
        **kw,
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


def crear_permiso(db, codigo, sistema="seguridad", nombre=None):
    from models import Permiso
    p = Permiso(codigo=codigo, nombre=nombre or codigo, sistema=sistema)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def crear_perfil(db, codigo="perfil1", nombre="Perfil", permisos=None):
    from models import Perfil
    perfil = Perfil(codigo=codigo, nombre=nombre)
    if permisos:
        perfil.permisos.extend(permisos)
    db.add(perfil)
    db.commit()
    db.refresh(perfil)
    return perfil
