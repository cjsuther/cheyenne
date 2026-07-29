"""Tests del bloqueo por intentos fallidos en AuthService.authenticate:
contador de intentos, seteo de bloqueado_hasta al alcanzar el maximo,
rechazo con 423 mientras dura el bloqueo, y reseteo al loguear con exito."""
from datetime import datetime, timezone, timedelta

import pytest
from fastapi import HTTPException

from services.auth_service import AuthService
from conftest import crear_usuario

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.security import get_password_hash


PASSWORD = "SecretPass1"
# hash una sola vez (bcrypt es lento) y reutilizar
_HASH = get_password_hash(PASSWORD)


def _con_acceso(db, codigo, password_hash=None, estado=10, **kw):
    from models import Acceso
    u = crear_usuario(db, codigo=codigo, estado=estado, **kw)
    acc = Acceso(id_usuario=u.id, identificador=codigo, password=password_hash or _HASH)
    db.add(acc)
    db.commit()
    db.refresh(u)
    return u


def test_login_correcto_no_incrementa_intentos(db):
    u = _con_acceso(db, "lk1")
    svc = AuthService(db)
    out = svc.authenticate("lk1", PASSWORD)
    assert "access_token" in out
    db.refresh(u)
    assert u.intentos_fallidos == 0
    assert u.bloqueado_hasta is None


def test_password_incorrecta_incrementa_contador(db):
    u = _con_acceso(db, "lk2")
    svc = AuthService(db)
    with pytest.raises(HTTPException) as exc:
        svc.authenticate("lk2", "malapass")
    assert exc.value.status_code == 401
    db.refresh(u)
    assert u.intentos_fallidos == 1
    assert u.bloqueado_hasta is None


def test_bloquea_al_alcanzar_maximo(db):
    u = _con_acceso(db, "lk3")
    svc = AuthService(db)
    svc.settings.max_intentos_fallidos = 3
    svc.settings.bloqueo_minutos = 15
    for _ in range(3):
        with pytest.raises(HTTPException):
            svc.authenticate("lk3", "malapass")
    db.refresh(u)
    assert u.intentos_fallidos == 3
    assert u.bloqueado_hasta is not None
    # bloqueo ~15 min en el futuro
    bloqueo = u.bloqueado_hasta.replace(tzinfo=timezone.utc) if u.bloqueado_hasta.tzinfo is None else u.bloqueado_hasta
    delta = bloqueo - datetime.now(timezone.utc)
    assert timedelta(minutes=14) < delta <= timedelta(minutes=15)


def test_usuario_bloqueado_rechaza_incluso_con_password_correcta(db):
    u = _con_acceso(db, "lk4")
    u.bloqueado_hasta = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()
    svc = AuthService(db)
    with pytest.raises(HTTPException) as exc:
        svc.authenticate("lk4", PASSWORD)  # password correcta pero bloqueado
    assert exc.value.status_code == 423
    assert "bloqueado" in exc.value.detail.lower()


def test_bloqueo_expirado_permite_login(db):
    u = _con_acceso(db, "lk5")
    # bloqueo ya vencido
    u.bloqueado_hasta = datetime.now(timezone.utc) - timedelta(minutes=1)
    u.intentos_fallidos = 5
    db.commit()
    svc = AuthService(db)
    out = svc.authenticate("lk5", PASSWORD)
    assert "access_token" in out
    db.refresh(u)
    # reseteado tras login exitoso
    assert u.intentos_fallidos == 0
    assert u.bloqueado_hasta is None


def test_login_exitoso_resetea_contador_previo(db):
    u = _con_acceso(db, "lk6")
    u.intentos_fallidos = 2
    db.commit()
    svc = AuthService(db)
    svc.authenticate("lk6", PASSWORD)
    db.refresh(u)
    assert u.intentos_fallidos == 0


def test_usuario_inexistente_da_401(db):
    svc = AuthService(db)
    with pytest.raises(HTTPException) as exc:
        svc.authenticate("noexiste", PASSWORD)
    assert exc.value.status_code == 401


def test_usuario_inactivo_da_401(db):
    _con_acceso(db, "lk7", estado=20)  # estado != 10
    svc = AuthService(db)
    with pytest.raises(HTTPException) as exc:
        svc.authenticate("lk7", PASSWORD)
    assert exc.value.status_code == 401


def test_intentos_acumulan_a_traves_de_varios_fallos(db):
    u = _con_acceso(db, "lk8")
    svc = AuthService(db)
    svc.settings.max_intentos_fallidos = 10  # alto para que no bloquee todavia
    for esperado in (1, 2, 3):
        with pytest.raises(HTTPException):
            svc.authenticate("lk8", "malapass")
        db.refresh(u)
        assert u.intentos_fallidos == esperado
    assert u.bloqueado_hasta is None
