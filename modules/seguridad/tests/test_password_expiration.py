"""Tests de expiracion de contrasena (dias_para_expirar / debe_cambiar)."""
from datetime import datetime, timezone, timedelta

from services.password_service import PasswordService
from conftest import crear_usuario


def test_debe_cambiar_si_nunca_se_registro(db):
    u = crear_usuario(db, codigo="exp1")
    assert u.password_actualizado_en is None
    svc = PasswordService(db)
    assert svc.debe_cambiar(u) is True


def test_dias_para_expirar_none_si_nunca_se_registro(db):
    u = crear_usuario(db, codigo="exp2")
    svc = PasswordService(db)
    assert svc.dias_para_expirar(u) is None


def test_password_reciente_no_debe_cambiarse(db):
    u = crear_usuario(db, codigo="exp3")
    svc = PasswordService(db)
    svc.settings.password_dias_expiracion = 90
    u.password_actualizado_en = datetime.now(timezone.utc)
    assert svc.debe_cambiar(u) is False
    dias = svc.dias_para_expirar(u)
    assert dias is not None and dias >= 89


def test_password_vencida_debe_cambiarse(db):
    u = crear_usuario(db, codigo="exp4")
    svc = PasswordService(db)
    svc.settings.password_dias_expiracion = 90
    # actualizada hace 91 dias -> vencida
    u.password_actualizado_en = datetime.now(timezone.utc) - timedelta(days=91)
    assert svc.debe_cambiar(u) is True
    assert svc.dias_para_expirar(u) < 0


def test_dias_para_expirar_soporta_naive_datetime(db):
    """password_actualizado_en puede venir naive (SQLite); no debe romper."""
    u = crear_usuario(db, codigo="exp5")
    svc = PasswordService(db)
    svc.settings.password_dias_expiracion = 30
    u.password_actualizado_en = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=10)
    dias = svc.dias_para_expirar(u)
    assert 19 <= dias <= 20
    assert svc.debe_cambiar(u) is False
