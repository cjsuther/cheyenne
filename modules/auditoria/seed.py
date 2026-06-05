"""
Seed de datos para el módulo Auditoría.
    docker compose exec auditoria python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.lista import Lista
from models.incidencia import Incidencia


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Lista).first():
        print("Ya existen datos en auditoria. Seed omitido.")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════════
    # LISTAS
    # ══════════════════════════════════════════════════════════════════
    listas = [
        # Tipos de incidencia
        Lista(codigo="INC_LOGIN", tipo="tipo_incidencia", nombre="Login", orden=1),
        Lista(codigo="INC_LOGOUT", tipo="tipo_incidencia", nombre="Logout", orden=2),
        Lista(codigo="INC_LOGIN_FALLIDO", tipo="tipo_incidencia", nombre="Login Fallido", orden=3),
        Lista(codigo="INC_ACCESO_DENEGADO", tipo="tipo_incidencia", nombre="Acceso Denegado", orden=4),
        Lista(codigo="INC_CRUD", tipo="tipo_incidencia", nombre="Operación CRUD", orden=5),
        Lista(codigo="INC_ERROR", tipo="tipo_incidencia", nombre="Error de Sistema", orden=6),
        Lista(codigo="INC_CONFIG", tipo="tipo_incidencia", nombre="Cambio de Configuración", orden=7),
        Lista(codigo="INC_EXPORT", tipo="tipo_incidencia", nombre="Exportación de Datos", orden=8),
        # Niveles de criticidad
        Lista(codigo="CRIT_INFO", tipo="nivel_criticidad", nombre="Información", orden=1),
        Lista(codigo="CRIT_BAJA", tipo="nivel_criticidad", nombre="Baja", orden=2),
        Lista(codigo="CRIT_MEDIA", tipo="nivel_criticidad", nombre="Media", orden=3),
        Lista(codigo="CRIT_ALTA", tipo="nivel_criticidad", nombre="Alta", orden=4),
        Lista(codigo="CRIT_CRITICA", tipo="nivel_criticidad", nombre="Crítica", orden=5),
        # Módulos del sistema
        Lista(codigo="MOD_SEGURIDAD", tipo="modulo", nombre="Seguridad", orden=1),
        Lista(codigo="MOD_ADMINISTRACION", tipo="modulo", nombre="Administración", orden=2),
        Lista(codigo="MOD_INGRESOS", tipo="modulo", nombre="Ingresos Públicos", orden=3),
        Lista(codigo="MOD_TESORERIA", tipo="modulo", nombre="Tesorería", orden=4),
        Lista(codigo="MOD_CONTADURIA", tipo="modulo", nombre="Contaduría", orden=5),
        Lista(codigo="MOD_COMUNICACION", tipo="modulo", nombre="Comunicación", orden=6),
        Lista(codigo="MOD_AUDITORIA", tipo="modulo", nombre="Auditoría", orden=7),
    ]
    for i, l in enumerate(listas):
        l.id = i + 1
        db.add(l)
    db.flush()

    tipo_inc = {l.codigo: l.id for l in listas if l.tipo == "tipo_incidencia"}
    nivel = {l.codigo: l.id for l in listas if l.tipo == "nivel_criticidad"}
    modulo = {l.codigo: l.id for l in listas if l.tipo == "modulo"}

    # ══════════════════════════════════════════════════════════════════
    # INCIDENCIAS
    # Registro de eventos del sistema consistentes con las operaciones
    # realizadas en los otros módulos
    # ══════════════════════════════════════════════════════════════════
    incidencias = [
        # Logins del admin
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_LOGIN"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_SEGURIDAD"], origen="POST /api/seguridad/auth/token", mensaje="Login exitoso: admin"),
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_LOGIN"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_SEGURIDAD"], origen="POST /api/seguridad/auth/token", mensaje="Login exitoso: admin"),

        # Operaciones CRUD en administración
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_ADMINISTRACION"], origen="POST /api/administracion/personas/fisicas", mensaje="Creación de persona física: Juan Carlos García López (DNI 30567890)"),
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_ADMINISTRACION"], origen="POST /api/administracion/personas/juridicas", mensaje="Creación de persona jurídica: Constructora del Sur S.A."),
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_ADMINISTRACION"], origen="POST /api/administracion/expedientes", mensaje="Creación de expediente ADM-2025-1-A: Habilitación comercial"),

        # Operaciones en ingresos públicos
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_INGRESOS"], origen="POST /api/ingresos-publicos/contribuyentes", mensaje="Alta de contribuyente: DNI 30567890 - García López"),
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_INGRESOS"], origen="POST /api/ingresos-publicos/cuentas", mensaje="Alta de cuenta ABL-001-2025 para contribuyente #1"),
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_INGRESOS"], origen="POST /api/ingresos-publicos/emisiones", mensaje="Emisión generada: ABL periodo 1/2025, 6 boletas"),
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_MEDIA"], id_usuario=1, id_modulo=modulo["MOD_INGRESOS"], origen="POST /api/ingresos-publicos/multas", mensaje="Multa MLT-2025-001 generada: $2500.00 por mora ABL"),

        # Operaciones en tesorería
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_TESORERIA"], origen="POST /api/tesoreria/recaudacion-lotes", mensaje="Lote de recaudación #1 creado: 4 casos, $27810.00"),
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CRUD"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_TESORERIA"], origen="POST /api/tesoreria/registro-contable-lotes", mensaje="Lote contable #1 confirmado: $27810.00 - Enero 2025"),

        # Intentos de acceso denegado
        Incidencia(token="tok_expired_001", id_tipo_incidencia=tipo_inc["INC_ACCESO_DENEGADO"], id_nivel_criticidad=nivel["CRIT_MEDIA"], id_usuario=None, id_modulo=modulo["MOD_SEGURIDAD"], origen="GET /api/seguridad/usuarios", mensaje="Token expirado - acceso denegado a lista de usuarios"),
        Incidencia(token=None, id_tipo_incidencia=tipo_inc["INC_LOGIN_FALLIDO"], id_nivel_criticidad=nivel["CRIT_MEDIA"], id_usuario=None, id_modulo=modulo["MOD_SEGURIDAD"], origen="POST /api/seguridad/auth/token", mensaje="Login fallido: usuario 'operador' - contraseña incorrecta"),
        Incidencia(token=None, id_tipo_incidencia=tipo_inc["INC_LOGIN_FALLIDO"], id_nivel_criticidad=nivel["CRIT_ALTA"], id_usuario=None, id_modulo=modulo["MOD_SEGURIDAD"], origen="POST /api/seguridad/auth/token", mensaje="Login fallido: usuario 'admin' - 3er intento consecutivo"),

        # Errores de sistema
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_ERROR"], id_nivel_criticidad=nivel["CRIT_ALTA"], id_usuario=1, id_modulo=modulo["MOD_TESORERIA"], origen="POST /api/tesoreria/recaudacion-lotes/99/recaudaciones", mensaje="Error al procesar recaudación: lote 99 no encontrado", error_data='{"status": 404, "detail": "Lote 99 no encontrado"}'),
        Incidencia(token="tok_admin_002", id_tipo_incidencia=tipo_inc["INC_ERROR"], id_nivel_criticidad=nivel["CRIT_CRITICA"], id_usuario=1, id_modulo=modulo["MOD_INGRESOS"], origen="POST /api/ingresos-publicos/emisiones", mensaje="Error de base de datos: timeout al generar emisiones masivas", error_data='{"error": "OperationalError", "detail": "connection timeout after 30s"}'),

        # Cambios de configuración
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_CONFIG"], id_nivel_criticidad=nivel["CRIT_MEDIA"], id_usuario=1, id_modulo=modulo["MOD_SEGURIDAD"], origen="PUT /api/seguridad/usuarios/1", mensaje="Actualización de perfil de usuario admin: email cambiado"),

        # Exportaciones
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_EXPORT"], id_nivel_criticidad=nivel["CRIT_BAJA"], id_usuario=1, id_modulo=modulo["MOD_TESORERIA"], origen="GET /api/tesoreria/recaudacion-lotes/1", mensaje="Exportación de lote de recaudación #1 - Enero 2025"),

        # Logout
        Incidencia(token="tok_admin_001", id_tipo_incidencia=tipo_inc["INC_LOGOUT"], id_nivel_criticidad=nivel["CRIT_INFO"], id_usuario=1, id_modulo=modulo["MOD_SEGURIDAD"], origen="POST /api/seguridad/auth/logout", mensaje="Logout: admin"),
    ]
    for inc in incidencias:
        db.add(inc)

    db.commit()
    db.close()

    print("Seed de Auditoría completado.")
    print(f"  - {len(listas)} listas de referencia")
    print(f"  - {len(incidencias)} incidencias de auditoría")


if __name__ == "__main__":
    seed()
