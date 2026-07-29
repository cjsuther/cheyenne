"""Tests del calculo de permisos efectivos por usuario:
efectivos = permisos por perfil + grants individuales - denies individuales."""
import pytest
from fastapi import HTTPException

from services.permiso_efectivo_service import PermisoEfectivoService
from models import UsuarioPermiso
from conftest import crear_usuario, crear_permiso, crear_perfil


def _codigos(permisos):
    return sorted(p.codigo for p in permisos)


def test_solo_permisos_de_perfil(db):
    p1 = crear_permiso(db, "seg_read")
    p2 = crear_permiso(db, "seg_write")
    perfil = crear_perfil(db, "adm", permisos=[p1, p2])
    u = crear_usuario(db, codigo="pe1")
    u.perfiles.append(perfil)
    db.commit()

    svc = PermisoEfectivoService(db)
    assert _codigos(svc.permisos_efectivos(u)) == ["seg_read", "seg_write"]


def test_grant_suma_permiso_fuera_del_perfil(db):
    p1 = crear_permiso(db, "seg_read")
    extra = crear_permiso(db, "seg_extra")
    perfil = crear_perfil(db, "adm", permisos=[p1])
    u = crear_usuario(db, codigo="pe2")
    u.perfiles.append(perfil)
    db.commit()
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=extra.id, tipo="grant"))
    db.commit()

    svc = PermisoEfectivoService(db)
    assert _codigos(svc.permisos_efectivos(u)) == ["seg_extra", "seg_read"]


def test_deny_resta_permiso_del_perfil(db):
    p1 = crear_permiso(db, "seg_read")
    p2 = crear_permiso(db, "seg_write")
    perfil = crear_perfil(db, "adm", permisos=[p1, p2])
    u = crear_usuario(db, codigo="pe3")
    u.perfiles.append(perfil)
    db.commit()
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p2.id, tipo="deny"))
    db.commit()

    svc = PermisoEfectivoService(db)
    assert _codigos(svc.permisos_efectivos(u)) == ["seg_read"]


def test_deny_de_permiso_no_otorgado_es_inocuo(db):
    """Un deny sobre un permiso que el usuario no tiene (ni perfil ni grant)
    no agrega nada ni rompe: sigue sin el permiso."""
    p1 = crear_permiso(db, "seg_read")
    u = crear_usuario(db, codigo="pe4")
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p1.id, tipo="deny"))
    db.commit()

    svc = PermisoEfectivoService(db)
    assert svc.permisos_efectivos(u) == []


def test_permisos_de_multiples_perfiles_se_unen_sin_duplicar(db):
    p1 = crear_permiso(db, "seg_read")
    p2 = crear_permiso(db, "seg_write")
    perfil_a = crear_perfil(db, "a", permisos=[p1, p2])
    perfil_b = crear_perfil(db, "b", permisos=[p2])  # p2 compartido
    u = crear_usuario(db, codigo="pe5")
    u.perfiles.extend([perfil_a, perfil_b])
    db.commit()

    svc = PermisoEfectivoService(db)
    efectivos = svc.permisos_efectivos(u)
    assert _codigos(efectivos) == ["seg_read", "seg_write"]
    assert len(efectivos) == 2  # sin duplicados


def test_grant_de_permiso_ya_en_perfil_no_duplica(db):
    p1 = crear_permiso(db, "seg_read")
    perfil = crear_perfil(db, "adm", permisos=[p1])
    u = crear_usuario(db, codigo="pe6")
    u.perfiles.append(perfil)
    db.commit()
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p1.id, tipo="grant"))
    db.commit()

    svc = PermisoEfectivoService(db)
    efectivos = svc.permisos_efectivos(u)
    assert len(efectivos) == 1


def test_usuario_sin_perfiles_ni_grants_sin_permisos(db):
    u = crear_usuario(db, codigo="pe7")
    svc = PermisoEfectivoService(db)
    assert svc.permisos_efectivos(u) == []


def test_combinado_perfil_grant_y_deny(db):
    p_read = crear_permiso(db, "seg_read")
    p_write = crear_permiso(db, "seg_write")
    p_admin = crear_permiso(db, "seg_admin")
    perfil = crear_perfil(db, "adm", permisos=[p_read, p_write])
    u = crear_usuario(db, codigo="pe8")
    u.perfiles.append(perfil)
    db.commit()
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p_admin.id, tipo="grant"))
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p_write.id, tipo="deny"))
    db.commit()

    svc = PermisoEfectivoService(db)
    # perfil={read,write} + grant{admin} - deny{write} = {read, admin}
    assert _codigos(svc.permisos_efectivos(u)) == ["seg_admin", "seg_read"]


# ── list_overrides / set_override / clear_override ───────────────────────────

def test_list_overrides_marca_por_perfil_y_override(db):
    p1 = crear_permiso(db, "seg_read")
    p2 = crear_permiso(db, "seg_write")
    perfil = crear_perfil(db, "adm", permisos=[p1])
    u = crear_usuario(db, codigo="pe9")
    u.perfiles.append(perfil)
    db.commit()
    db.add(UsuarioPermiso(id_usuario=u.id, id_permiso=p2.id, tipo="grant"))
    db.commit()

    svc = PermisoEfectivoService(db)
    rows = {r["codigo"]: r for r in svc.list_overrides(u.id)}
    assert rows["seg_read"]["por_perfil"] is True
    assert rows["seg_read"]["override"] is None
    assert rows["seg_write"]["por_perfil"] is False
    assert rows["seg_write"]["override"] == "grant"


def test_set_override_crea_y_actualiza(db):
    p1 = crear_permiso(db, "seg_read")
    u = crear_usuario(db, codigo="pe10")
    svc = PermisoEfectivoService(db)
    row = svc.set_override(u.id, p1.id, "grant")
    assert row.tipo == "grant"
    # actualizar el mismo par cambia el tipo, no duplica
    row2 = svc.set_override(u.id, p1.id, "deny")
    assert row2.tipo == "deny"
    cnt = db.query(UsuarioPermiso).filter(
        UsuarioPermiso.id_usuario == u.id, UsuarioPermiso.id_permiso == p1.id
    ).count()
    assert cnt == 1


def test_set_override_tipo_invalido(db):
    p1 = crear_permiso(db, "seg_read")
    u = crear_usuario(db, codigo="pe11")
    svc = PermisoEfectivoService(db)
    with pytest.raises(HTTPException) as exc:
        svc.set_override(u.id, p1.id, "otro")
    assert exc.value.status_code == 400


def test_set_override_usuario_inexistente(db):
    p1 = crear_permiso(db, "seg_read")
    svc = PermisoEfectivoService(db)
    with pytest.raises(HTTPException) as exc:
        svc.set_override(999999, p1.id, "grant")
    assert exc.value.status_code == 404


def test_set_override_permiso_inexistente(db):
    u = crear_usuario(db, codigo="pe12")
    svc = PermisoEfectivoService(db)
    with pytest.raises(HTTPException) as exc:
        svc.set_override(u.id, 999999, "grant")
    assert exc.value.status_code == 404


def test_clear_override_elimina(db):
    p1 = crear_permiso(db, "seg_read")
    u = crear_usuario(db, codigo="pe13")
    svc = PermisoEfectivoService(db)
    svc.set_override(u.id, p1.id, "grant")
    svc.clear_override(u.id, p1.id)
    cnt = db.query(UsuarioPermiso).filter(UsuarioPermiso.id_usuario == u.id).count()
    assert cnt == 0


def test_clear_override_inexistente_da_404(db):
    p1 = crear_permiso(db, "seg_read")
    u = crear_usuario(db, codigo="pe14")
    svc = PermisoEfectivoService(db)
    with pytest.raises(HTTPException) as exc:
        svc.clear_override(u.id, p1.id)
    assert exc.value.status_code == 404
