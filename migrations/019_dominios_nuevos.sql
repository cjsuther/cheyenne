-- Migración 019 — Dominios nuevos (cementerio, apremios, reportes) + extensiones. Idempotente.

-- ═══ cementerio ═══
-- Migración — Permisos del módulo Cementerio. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('cementerio_read',     'Cementerio · Consulta',        'Ver sepulturas, concesiones, difuntos, tasas y ocupación', 'cementerio', 0),
 ('cementerio_write',    'Cementerio · Cargar',          'Alta/edición de sepulturas, concesiones, difuntos e inhumaciones/traslados', 'cementerio', 0),
 ('cementerio_delete',   'Cementerio · Baja',            'Bajas de sepulturas, concesiones y difuntos', 'cementerio', 0),
 ('cementerio_liquidar', 'Cementerio · Liquidar tasas',  'Liquidar y cobrar tasas de mantenimiento', 'cementerio', 0),
 ('cementerio_admin',    'Cementerio · Administración',  'Administración del módulo', 'cementerio', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'cementerio_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- ═══ apremios ═══
-- Migración — Permisos del módulo Apremios. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('apremios_read',       'Apremios · Consulta',        'Ver juicios, actos, embargos, honorarios y mandamientos', 'apremios', 0),
 ('apremios_write',      'Apremios · Cargar',          'Iniciar y editar juicios de apremio',                     'apremios', 0),
 ('apremios_gestionar',  'Apremios · Gestión judicial','Avanzar estados y cargar actos/embargos/honorarios/mandamientos', 'apremios', 0),
 ('apremios_admin',      'Apremios · Administración',  'Bajas y administración del módulo',                       'apremios', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'apremios_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- No hay ALTERs: todas las tablas apremios_* son nuevas y las crea Base.metadata.create_all al startup.

-- ═══ reportes ═══
-- Migración — Permisos del módulo Reportes (consolidados). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('reportes_read',  'Reportes · Ver',    'Consultar reportes consolidados (recaudación, cierre de caja, ejecución, ciclo del gasto, tablero)', 'reportes', 0),
 ('reportes_admin', 'Reportes · Admin',  'Administración de reportes consolidados',                                                             'reportes', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'reportes_%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- Tabla de log de consultas (la crea también Base.metadata.create_all al arrancar; se deja idempotente por si se aplica por migración):
CREATE TABLE IF NOT EXISTS reportes_consultas (
    id             BIGSERIAL PRIMARY KEY,
    reporte        VARCHAR(100) NOT NULL,
    parametros     TEXT,
    usuario        VARCHAR(150),
    modulos_ok     VARCHAR(255),
    modulos_error  VARCHAR(255),
    created_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_reportes_consultas_reporte ON reportes_consultas (reporte);

-- ═══ seguridad ═══
-- 2FA (seguridad): columnas nuevas en usuarios + tabla de codigos de respaldo.
-- Idempotente. No requiere permisos nuevos (2FA es autoservicio del usuario).

ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(64);
ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS totp_habilitado BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS seguridad_codigos_respaldo (
    id BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL REFERENCES seguridad_usuarios(id),
    codigo_hash VARCHAR(128) NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_uso TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_seguridad_codigos_respaldo_id_usuario
    ON seguridad_codigos_respaldo (id_usuario);

-- ═══ auditoria ═══
-- Estadísticas/dashboards de Auditoría. Reutiliza el permiso auditoria_read.
-- Idempotente: asegura el permiso y su asignación al perfil superadmin.
-- No agrega columnas nuevas (solo lectura sobre auditoria_eventos).
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('auditoria_read', 'Auditoría · Leer', 'Ver rastro de accesos, estadísticas/dashboards, búsqueda avanzada, export y verificación de integridad', 'auditoria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'auditoria_read'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══ wav ═══
-- Migración WAV — Débito automático (lotes + items) + permiso wav_debito. Idempotente.

-- Tablas (también las crea Base.metadata.create_all al arrancar; este DDL es por si el SQL se aplica antes).
CREATE TABLE IF NOT EXISTS wav_lotes_debito (
    id          BIGSERIAL PRIMARY KEY,
    periodo     VARCHAR(20) NOT NULL,
    medio       VARCHAR(20) NOT NULL,
    estado      VARCHAR(20) NOT NULL DEFAULT 'generado',
    total       NUMERIC(18,2) NOT NULL DEFAULT 0,
    cantidad    INTEGER NOT NULL DEFAULT 0,
    fecha       TIMESTAMPTZ DEFAULT now(),
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wav_debito_items (
    id             BIGSERIAL PRIMARY KEY,
    id_lote        BIGINT NOT NULL REFERENCES wav_lotes_debito(id),
    id_adhesion    BIGINT,
    id_cuenta      BIGINT,
    medio          VARCHAR(20),
    datos          VARCHAR(250),
    titular        VARCHAR(150),
    importe        NUMERIC(18,2) NOT NULL DEFAULT 0,
    estado         VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    motivo_rechazo VARCHAR(250),
    created_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_wav_debito_items_id_lote ON wav_debito_items(id_lote);

-- Columnas defensivas por si las tablas ya existieran de una corrida previa.
ALTER TABLE wav_lotes_debito ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE wav_debito_items ADD COLUMN IF NOT EXISTS motivo_rechazo VARCHAR(250);

-- Permiso del sub-módulo débito automático.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('wav_debito', 'WAV · Débito automático', 'Generar lotes de débito, descargar archivo y procesar rechazos', 'wav', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'wav_debito'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══ ingresos_publicos ═══
-- Migración — Permisos de Tributos Marginales (ingresos_publicos). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('ingresos_marginales', 'Ingresos · Tributos Marginales', 'Fondeadero, servicios medidos, puestos de mercado y derechos de construcción', 'ingresos_publicos', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'ingresos_marginales'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- Nota: las 4 tablas nuevas (ingresos_publicos_fondeaderos, ingresos_publicos_servicios_medidos,
-- ingresos_publicos_lecturas_medidor, ingresos_publicos_puestos_mercado,
-- ingresos_publicos_derechos_construccion) las crea Base.metadata.create_all(bind=engine) al arrancar
-- el módulo (on_event startup). No se requieren ALTERs sobre tablas existentes.
