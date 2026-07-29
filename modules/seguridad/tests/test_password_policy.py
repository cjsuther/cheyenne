"""Tests de la politica de contrasenas: validacion de complejidad/longitud,
no-reuso contra historial, poda del historial y expiracion."""
import pytest
from fastapi import HTTPException

from services.password_service import PasswordService
from conftest import crear_usuario


# ── validate_policy ──────────────────────────────────────────────────────────

def test_valida_password_correcta_no_lanza(db):
    svc = PasswordService(db)
    # 8+ chars, mayus, minus, digito
    svc.validate_policy("SecretPass1")


def test_rechaza_password_corta(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("Ab1")  # 3 chars < min 8
    assert exc.value.status_code == 400
    assert "8 caracteres" in exc.value.detail


def test_rechaza_sin_mayuscula(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("secretpass1")
    assert "mayuscula" in exc.value.detail


def test_rechaza_sin_minuscula(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("SECRETPASS1")
    assert "minuscula" in exc.value.detail


def test_rechaza_sin_digito(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("SecretPassword")
    assert "digito" in exc.value.detail


def test_none_es_rechazada(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException):
        svc.validate_policy(None)


def test_acumula_todos_los_errores_en_un_mensaje(db):
    svc = PasswordService(db)
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("abc")  # corta, sin mayus, sin digito
    detalle = exc.value.detail
    assert "8 caracteres" in detalle
    assert "mayuscula" in detalle
    assert "digito" in detalle


def test_longitud_minima_configurable(db):
    svc = PasswordService(db)
    svc.settings.password_min_length = 12
    with pytest.raises(HTTPException) as exc:
        svc.validate_policy("Secret1x")  # 8 chars, ahora insuficiente
    assert "12 caracteres" in exc.value.detail
    # exactamente 12 pasa
    svc.validate_policy("SecretPass12")


# ── check_not_reused / record ────────────────────────────────────────────────

def test_no_reuso_bloquea_password_en_historial(db):
    u = crear_usuario(db, codigo="pwd1")
    svc = PasswordService(db)
    svc.settings.password_historial_size = 5
    # registrar una password previa
    svc.apply_new_password(u.id, "SecretPass1")
    db.commit()
    # reintentar la misma debe fallar
    with pytest.raises(HTTPException) as exc:
        svc.check_not_reused(u.id, "SecretPass1")
    assert exc.value.status_code == 400
    assert "reutilizar" in exc.value.detail


def test_password_distinta_no_esta_en_historial(db):
    u = crear_usuario(db, codigo="pwd2")
    svc = PasswordService(db)
    svc.apply_new_password(u.id, "SecretPass1")
    db.commit()
    # una password distinta pasa sin excepcion
    svc.check_not_reused(u.id, "OtraClave2")


def test_historial_de_otro_usuario_no_interfiere(db):
    a = crear_usuario(db, codigo="pwdA")
    b = crear_usuario(db, codigo="pwdB")
    svc = PasswordService(db)
    svc.apply_new_password(a.id, "SecretPass1")
    db.commit()
    # b puede usar la misma password que a
    svc.check_not_reused(b.id, "SecretPass1")


def test_historial_respeta_ventana_y_permite_reuso_fuera_de_ella(db):
    """Con historial_size=2, la 3ra password mas vieja sale de la ventana
    y vuelve a estar permitida."""
    u = crear_usuario(db, codigo="pwd3")
    svc = PasswordService(db)
    svc.settings.password_historial_size = 2
    svc.apply_new_password(u.id, "PrimeraP1")  # mas vieja
    svc.apply_new_password(u.id, "SegundaP2")
    svc.apply_new_password(u.id, "TerceraP3")  # mas nueva
    db.commit()
    # "PrimeraP1" ya no esta en las 2 mas recientes -> permitida
    svc.check_not_reused(u.id, "PrimeraP1")
    # "SegundaP2" y "TerceraP3" siguen bloqueadas
    with pytest.raises(HTTPException):
        svc.check_not_reused(u.id, "SegundaP2")
    with pytest.raises(HTTPException):
        svc.check_not_reused(u.id, "TerceraP3")


def test_record_poda_historial_a_tamano_configurado(db):
    """La poda deja solo las N mas recientes. Usamos timestamps explicitos y
    crecientes para que el orden por created_at sea determinista."""
    from datetime import datetime, timezone, timedelta
    from models import PasswordHistorial
    u = crear_usuario(db, codigo="pwd4")
    svc = PasswordService(db)
    svc.settings.password_historial_size = 3

    base = datetime(2026, 1, 1, tzinfo=timezone.utc)
    # 4 hashes viejos con timestamps crecientes
    for i in range(4):
        db.add(PasswordHistorial(
            id_usuario=u.id, hash=f"hash{i}", created_at=base + timedelta(minutes=i),
        ))
    db.commit()

    # record() poda las que exceden la ventana (offset > historial_size) sobre
    # el estado ya persistido y agrega la nueva. Con 4 previas y size=3 se poda
    # la mas vieja (hash0); queda hash1..hash3 + hash_nuevo.
    svc.record(u.id, "hash_nuevo")
    db.commit()

    rows = (
        db.query(PasswordHistorial)
        .filter(PasswordHistorial.id_usuario == u.id)
        .order_by(PasswordHistorial.created_at.desc())
        .all()
    )
    hashes = {r.hash for r in rows}
    # la nueva quedo registrada y la mas vieja se podo
    assert "hash_nuevo" in hashes
    assert "hash0" not in hashes
    # no crece indefinidamente: la poda mantiene el set acotado
    assert len(rows) <= 4


def test_apply_new_password_actualiza_timestamp(db):
    u = crear_usuario(db, codigo="pwd5")
    assert u.password_actualizado_en is None
    svc = PasswordService(db)
    svc.apply_new_password(u.id, "SecretPass1")
    db.commit()
    db.refresh(u)
    assert u.password_actualizado_en is not None


def test_apply_new_password_valida_politica_antes_de_registrar(db):
    from models import PasswordHistorial
    u = crear_usuario(db, codigo="pwd6")
    svc = PasswordService(db)
    with pytest.raises(HTTPException):
        svc.apply_new_password(u.id, "corta")  # invalida
    # nada quedo en el historial
    cnt = db.query(PasswordHistorial).filter(PasswordHistorial.id_usuario == u.id).count()
    assert cnt == 0
