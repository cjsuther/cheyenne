"""
Ejecutar una vez después de las migrations:
    python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.security import get_password_hash
from database import SessionLocal, engine
from shared.database import Base
from models.usuario import Usuario, usuario_perfil
from models.perfil import Perfil, perfil_permiso
from models.permiso import Permiso
from models.acceso import Acceso
from models.lista import Lista
from models.sesion import Sesion
from models.verificacion import Verificacion

MODULOS = [
    "administracion", "auditoria", "comunicacion", "contaduria",
    "importacion", "ingresos_publicos", "interface", "tesoreria", "wav",
]
ACCIONES = ["read", "write", "delete", "admin"]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Verificar si ya existe data
    if db.query(Usuario).first():
        print("Ya existen datos. Seed omitido.")
        db.close()
        return

    # Crear permisos por módulo
    permisos_map = {}
    for modulo in MODULOS:
        for accion in ACCIONES:
            codigo = f"{modulo}_{accion}"
            permiso = Permiso(
                codigo=codigo,
                nombre=f"{accion.capitalize()} en {modulo}",
                descripcion=f"Permiso de {accion} en módulo {modulo}",
                sistema="cheyenne",
                id_modulo=MODULOS.index(modulo) + 1,
            )
            db.add(permiso)
            db.flush()
            permisos_map[codigo] = permiso

    # Crear perfil superadmin
    perfil_admin = Perfil(
        codigo="superadmin",
        nombre="Super Administrador",
    )
    db.add(perfil_admin)
    db.flush()

    # Asignar todos los permisos al superadmin
    for permiso in permisos_map.values():
        perfil_admin.permisos.append(permiso)

    # Crear perfiles por módulo
    for modulo in MODULOS:
        for nivel in ["viewer", "editor", "admin"]:
            perfil = Perfil(
                codigo=f"{modulo}_{nivel}",
                nombre=f"{nivel.capitalize()} de {modulo}",
            )
            db.add(perfil)
            db.flush()

            acciones_por_nivel = {
                "viewer": ["read"],
                "editor": ["read", "write"],
                "admin": ["read", "write", "delete", "admin"],
            }
            for accion in acciones_por_nivel[nivel]:
                codigo = f"{modulo}_{accion}"
                if codigo in permisos_map:
                    perfil.permisos.append(permisos_map[codigo])

    # Crear usuario admin
    admin = Usuario(
        id_tipo_usuario=20,
        id_estado_usuario=10,
        codigo="admin",
        nombre_apellido="Administrador Sistema",
        email="admin@cheyenne.gob.ar",
        superuser=1,
    )
    db.add(admin)
    db.flush()

    admin.perfiles.append(perfil_admin)

    # Crear acceso para admin
    acceso = Acceso(
        id_usuario=admin.id,
        id_tipo_acceso=10,
        identificador="admin",
        password=get_password_hash("Admin@2024!"),
    )
    db.add(acceso)

    # Crear listas de referencia
    listas = [
        # Tipos de usuario
        Lista(id=10, codigo="USR_INTERNO", tipo="tipo_usuario", nombre="Usuario Interno", orden=1),
        Lista(id=20, codigo="USR_REGISTRADO", tipo="tipo_usuario", nombre="Usuario Registrado", orden=2),
        Lista(id=30, codigo="USR_EXTERNO", tipo="tipo_usuario", nombre="Usuario Externo", orden=3),
        # Estados de usuario
        Lista(id=10, codigo="USR_ACTIVO", tipo="estado_usuario", nombre="Activo", orden=1),
        Lista(id=20, codigo="USR_INACTIVO", tipo="estado_usuario", nombre="Inactivo", orden=2),
        Lista(id=30, codigo="USR_BLOQUEADO", tipo="estado_usuario", nombre="Bloqueado", orden=3),
        # Tipos de acceso
        Lista(id=10, codigo="ACC_PASSWORD", tipo="tipo_acceso", nombre="Password", orden=1),
        Lista(id=20, codigo="ACC_OAUTH", tipo="tipo_acceso", nombre="OAuth", orden=2),
        # Estados de verificacion
        Lista(id=51, codigo="VER_PENDIENTE", tipo="estado_verificacion", nombre="Pendiente", orden=1),
        Lista(id=52, codigo="VER_USADO", tipo="estado_verificacion", nombre="Usado", orden=2),
        Lista(id=53, codigo="VER_EXPIRADO", tipo="estado_verificacion", nombre="Expirado", orden=3),
    ]

    # Las listas tienen IDs que pueden colisionar por tipo, usemos IDs únicos
    for i, lista in enumerate(listas):
        lista.id = (i + 1) * 10
        db.add(lista)

    db.commit()
    db.close()

    print("Seed completado. Usuario admin creado.")
    print("   Username: admin")
    print("   Password: Admin@2024! (cambiar en produccion!)")


if __name__ == "__main__":
    seed()
