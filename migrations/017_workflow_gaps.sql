-- Migración 017 — Workflow gaps: permisos + columnas nuevas de 14 módulos. Idempotente.

-- ═══════════ contabilidad ═══════════
-- Permisos del módulo Contabilidad. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('contabilidad_read',    'Contabilidad · Consulta',       'Ver plan de cuentas, ejercicios, asientos y libros', 'contabilidad', 0),
 ('contabilidad_write',   'Contabilidad · Configurar',     'Plan de cuentas y ejercicios',                        'contabilidad', 0),
 ('contabilidad_asentar', 'Contabilidad · Asentar',        'Crear, confirmar, anular y asientos automáticos',     'contabilidad', 0),
 ('contabilidad_cerrar',  'Contabilidad · Cierre/Apertura','Cierre y apertura de ejercicios',                     'contabilidad', 0),
 ('contabilidad_admin',   'Contabilidad · Administración', 'Administración del módulo',                           'contabilidad', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'contabilidad_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- ═══════════ administracion ═══════════
-- Permisos de configuracion de administracion (idempotente)
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
  ('administracion_config_read',   'Administracion Config - Leer',     'Ver numeradores, parametros, feriados y funcionarios', true, 0),
  ('administracion_config_write',  'Administracion Config - Escribir', 'Crear/editar numeradores, parametros, feriados y funcionarios; tomar siguiente numero', true, 0),
  ('administracion_config_delete', 'Administracion Config - Eliminar', 'Dar de baja numeradores, parametros, feriados y funcionarios', true, 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN (
  'administracion_config_read', 'administracion_config_write', 'administracion_config_delete'
)
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- Nota: las tablas (administracion_numeradores, administracion_parametros,
-- administracion_feriados, administracion_funcionarios) las crea automaticamente
-- Base.metadata.create_all() al arrancar el servicio. No se requieren ALTER TABLE.

-- ═══════════ seguridad ═══════════
-- ============================================================
-- Seguridad: hardening (bloqueo, política contraseña, sesiones, permisos por usuario)
-- Idempotente.
-- ============================================================

-- Columnas nuevas en seguridad_usuarios
ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS intentos_fallidos INTEGER NOT NULL DEFAULT 0;
ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS bloqueado_hasta TIMESTAMPTZ NULL;
ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS password_actualizado_en TIMESTAMPTZ NULL;

-- Tablas nuevas (también las crea Base.metadata.create_all al arrancar; acá por si se corre migración pura)
CREATE TABLE IF NOT EXISTS seguridad_password_historial (
    id BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL REFERENCES seguridad_usuarios(id),
    hash VARCHAR(250) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_seg_pwd_hist_usuario ON seguridad_password_historial(id_usuario);

CREATE TABLE IF NOT EXISTS seguridad_tokens_revocados (
    id BIGSERIAL PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    id_usuario BIGINT NULL,
    expira_en TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_seg_tokrev_usuario ON seguridad_tokens_revocados(id_usuario);

CREATE TABLE IF NOT EXISTS seguridad_usuario_permiso (
    id BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL REFERENCES seguridad_usuarios(id),
    id_permiso BIGINT NOT NULL REFERENCES seguridad_permisos(id),
    tipo VARCHAR(10) NOT NULL DEFAULT 'grant',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_seguridad_usuario_permiso UNIQUE (id_usuario, id_permiso)
);
CREATE INDEX IF NOT EXISTS ix_seg_usrperm_usuario ON seguridad_usuario_permiso(id_usuario);
CREATE INDEX IF NOT EXISTS ix_seg_usrperm_permiso ON seguridad_usuario_permiso(id_permiso);

-- Permisos nuevos
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo)
VALUES ('seguridad_desbloquear', 'Desbloquear usuarios', 'Quitar bloqueo por intentos fallidos', 'seguridad', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo)
VALUES ('seguridad_permisos_usuario', 'Permisos por usuario', 'Asignar grant/deny de permisos a un usuario', 'seguridad', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos nuevos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('seguridad_desbloquear', 'seguridad_permisos_usuario')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══════════ auditoria ═══════════
-- Auditoría: columnas de hash encadenado en eventos + permisos. Idempotente.
ALTER TABLE auditoria_eventos ADD COLUMN IF NOT EXISTS hash VARCHAR(64);
ALTER TABLE auditoria_eventos ADD COLUMN IF NOT EXISTS hash_anterior VARCHAR(64);
CREATE INDEX IF NOT EXISTS ix_auditoria_eventos_hash ON auditoria_eventos (hash);

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('auditoria_read', 'Auditoría · Leer', 'Ver rastro de accesos, búsqueda avanzada, export y verificación de integridad', 'auditoria', 0),
 ('auditoria_admin', 'Auditoría · Administrar', 'Purgar/archivar eventos por retención', 'auditoria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('auditoria_read', 'auditoria_admin')
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- ═══════════ comunicacion ═══════════
-- ── Permisos del módulo comunicacion (idempotente) ──────────────────
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
  ('comunicacion_read',   'Comunicación: lectura',       'Ver mensajes, plantillas e intentos de envío', 'comunicacion', 0),
  ('comunicacion_write',  'Comunicación: escritura',     'Crear/editar mensajes y plantillas',           'comunicacion', 0),
  ('comunicacion_enviar', 'Comunicación: enviar',        'Despachar mensajes por email (SMTP)',          'comunicacion', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('comunicacion_read', 'comunicacion_write', 'comunicacion_enviar')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- Nota: las tablas comunicacion_intentos_envio y comunicacion_plantillas
-- las crea Base.metadata.create_all(bind=engine) en el startup del servicio,
-- por lo que no se requieren CREATE TABLE aquí.

-- ═══════════ importacion ═══════════
-- ═══ Módulo importacion: columnas nuevas + permisos ═══

-- Columnas nuevas en importacion_lotes (para ingesta real sin path)
ALTER TABLE importacion_lotes ADD COLUMN IF NOT EXISTS tipo_importacion VARCHAR(50) NOT NULL DEFAULT 'generico';
ALTER TABLE importacion_lotes ADD COLUMN IF NOT EXISTS mapeo TEXT;
ALTER TABLE importacion_lotes ALTER COLUMN path_archivo DROP NOT NULL;
ALTER TABLE importacion_lotes ALTER COLUMN id_tipo_importacion SET DEFAULT 0;

-- Columnas nuevas en importacion_exportacion_lotes (exportación real)
ALTER TABLE importacion_exportacion_lotes ADD COLUMN IF NOT EXISTS tipo_exportacion VARCHAR(50) NOT NULL DEFAULT 'generico';
ALTER TABLE importacion_exportacion_lotes ADD COLUMN IF NOT EXISTS formato VARCHAR(10) NOT NULL DEFAULT 'csv';
ALTER TABLE importacion_exportacion_lotes ADD COLUMN IF NOT EXISTS origen_lote_id BIGINT;
ALTER TABLE importacion_exportacion_lotes ALTER COLUMN id_tipo_exportacion SET DEFAULT 0;

-- Permisos del módulo
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
  ('importacion_read',     'Importación: leer',     'Ver lotes, detalles y previsualizar archivos',        false, 0),
  ('importacion_write',    'Importación: escribir', 'Subir archivos y crear lotes de importación/exportación', false, 0),
  ('importacion_procesar', 'Importación: procesar', 'Procesar/validar lotes fila por fila',                false, 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('importacion_read', 'importacion_write', 'importacion_procesar')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══════════ interface ═══════════
-- Permisos del módulo interface
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
  ('interface_read',  'Interface: lectura', 'Ver boletas, notificaciones de pago y consultas AFIP', true, 0),
  ('interface_write', 'Interface: escritura', 'Generar boletas y registrar consultas', true, 0),
  ('interface_pagos', 'Interface: pagos', 'Gestionar notificaciones de pago de pasarelas', true, 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'interface_%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- Columnas nuevas en la tabla de notificaciones de pago (idempotencia + impacto de deuda)
ALTER TABLE interface_pago_notificaciones ADD COLUMN IF NOT EXISTS comprobante_ref VARCHAR(250);
ALTER TABLE interface_pago_notificaciones ADD COLUMN IF NOT EXISTS impacto_ok BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE interface_pago_notificaciones ADD COLUMN IF NOT EXISTS impacto_detalle TEXT;
-- Unicidad de la transacción externa para idempotencia del webhook
CREATE UNIQUE INDEX IF NOT EXISTS ux_interface_pago_notif_transaccion
  ON interface_pago_notificaciones (id_transaccion_externa);

-- ═══════════ compras ═══════════
-- Permisos nuevos del módulo Compras (circuito licitatorio, facturas, depósitos). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('compras_licitar',  'Compras · Licitaciones',       'Pedidos de cotización, cotizaciones, apertura y adjudicación', 'compras', 0),
 ('compras_facturar', 'Compras · Facturas',           'Registrar y conformar facturas de proveedor',                 'compras', 0),
 ('compras_deposito', 'Compras · Depósitos y stock',  'Depósitos, transferencias, ajustes y salidas de stock',       'compras', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('compras_licitar','compras_facturar','compras_deposito')
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- Columnas nuevas en tablas preexistentes (las tablas nuevas las crea Base.metadata.create_all al arrancar).
-- compras_proveedores: registro/preinscripción
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS estado VARCHAR(15) NOT NULL DEFAULT 'activo';
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS email VARCHAR(150);
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS telefono VARCHAR(60);
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS domicilio VARCHAR(250);
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS documentacion TEXT;
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS fecha_inscripcion TIMESTAMPTZ;
ALTER TABLE compras_proveedores ADD COLUMN IF NOT EXISTS aprobado_por VARCHAR(150);

-- compras_recepciones: depósito destino de la mercadería
ALTER TABLE compras_recepciones ADD COLUMN IF NOT EXISTS id_deposito BIGINT;

-- ═══════════ contaduria ═══════════
-- Migración 017 — Contaduría: permisos de retenciones/rendición/delete. Idempotente.
-- No hay ALTER de tablas existentes: las tablas nuevas (contaduria_tipos_retencion,
-- contaduria_retenciones_aplicadas, contaduria_movimientos_extracontables) las crea
-- Base.metadata.create_all al arrancar el servicio.

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('contaduria_retenciones', 'Contaduría · Retenciones', 'Definir tipos y aplicar/exportar retenciones', 'contaduria', 0),
 ('contaduria_rendicion',   'Contaduría · Rendición',   'Generar la rendición de cuentas (ejecución del gasto)', 'contaduria', 0),
 ('contaduria_delete',      'Contaduría · Eliminar',    'Dar de baja movimientos extracontables', 'contaduria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('contaduria_retenciones','contaduria_rendicion','contaduria_delete')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══════════ tesoreria ═══════════
-- Permisos nuevos de Tesorería (retenciones, programación de caja, embargos, poderes). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('tesoreria_depositar_retenciones', 'Tesorería · Depositar retenciones', 'Marcar retenciones practicadas como depositadas', 'tesoreria', 0),
 ('tesoreria_programar_caja',        'Tesorería · Programar caja',        'Cargar/editar la programación de caja (F47/F48)', 'tesoreria', 0),
 ('tesoreria_embargos',             'Tesorería · Embargos judiciales',    'Administrar embargos judiciales de beneficiarios', 'tesoreria', 0),
 ('tesoreria_poderes',              'Tesorería · Poderes/apoderados',     'Administrar poderes y apoderados para cobro por terceros', 'tesoreria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN (
  'tesoreria_depositar_retenciones','tesoreria_programar_caja','tesoreria_embargos','tesoreria_poderes')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- Las tablas nuevas (tesoreria_retenciones, tesoreria_programacion_caja, tesoreria_embargos,
-- tesoreria_poderes) las crea Base.metadata.create_all al arrancar. No se agregan columnas a tablas existentes.

-- ═══════════ presupuesto ═══════════
-- Sin cambios de esquema ni permisos nuevos.
-- Ambos endpoints reutilizan el permiso presupuesto_read, ya definido en
-- migrations/011_permisos_presupuesto.sql (y ya asignado al perfil superadmin).
-- No se agregan columnas a tablas existentes.

-- ═══════════ ingresos_publicos ═══════════
-- Permisos de Ingresos Públicos (features Alta+Media). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('ingresos_exenciones', 'Ingresos · Exenciones', 'Alta/baja y consulta de exenciones tributarias', 'ingresos_publicos', 0),
 ('ingresos_planes', 'Ingresos · Planes/Moratoria', 'Gestionar regímenes de moratoria y generar planes de pago', 'ingresos_publicos', 0),
 ('ingresos_certificados', 'Ingresos · Certificados', 'Emitir certificados (incluye libre deuda real)', 'ingresos_publicos', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('ingresos_exenciones','ingresos_planes','ingresos_certificados')
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

-- Nota: las 3 tablas nuevas (ingresos_publicos_exenciones, ingresos_publicos_regimenes_moratoria,
-- ingresos_publicos_titulares_cuenta) las crea Base.metadata.create_all al arrancar el módulo,
-- por lo que no requieren CREATE TABLE aquí. No se agregaron columnas a tablas existentes.

-- ═══════════ emisiones ═══════════
-- ============================================================================
-- Emisiones — Libro Mayor inmutable, Curva de coeficientes y Vencimientos múltiples
-- Idempotente. Las tablas también las crea Base.metadata.create_all al arrancar;
-- estos CREATE ... IF NOT EXISTS quedan para entornos con migraciones explícitas.
-- ============================================================================

-- 1) Libro mayor inmutable (Debe/Haber). El saldo se DERIVA de los movimientos.
CREATE TABLE IF NOT EXISTS emisiones_movimientos_ctacte (
    id                   BIGSERIAL PRIMARY KEY,
    id_cuenta_corriente  BIGINT,
    id_contribuyente     BIGINT NOT NULL,
    id_emision           BIGINT,
    tipo_tributo         VARCHAR(50),
    periodo              VARCHAR(20),
    cuota                INTEGER,
    numero_comprobante   VARCHAR(50),
    fecha                TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo                 VARCHAR(10) NOT NULL,   -- debito | credito
    concepto             VARCHAR(20) NOT NULL,   -- emision | pago | interes | quita | ajuste
    importe              NUMERIC(18,2) NOT NULL DEFAULT 0,
    descripcion          VARCHAR(300),
    comprobante          VARCHAR(50),
    saldo_posterior      NUMERIC(18,2),
    origen               VARCHAR(60),
    origen_modulo        VARCHAR(50),
    origen_ref           VARCHAR(120),
    detalle              JSON,
    created_at           TIMESTAMPTZ DEFAULT now(),
    activo               BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS ix_emi_mov_ctacte_contrib   ON emisiones_movimientos_ctacte (id_contribuyente);
CREATE INDEX IF NOT EXISTS ix_emi_mov_ctacte_cc        ON emisiones_movimientos_ctacte (id_cuenta_corriente);
CREATE INDEX IF NOT EXISTS ix_emi_mov_ctacte_emision   ON emisiones_movimientos_ctacte (id_emision);
CREATE INDEX IF NOT EXISTS ix_emi_mov_ctacte_comprob   ON emisiones_movimientos_ctacte (numero_comprobante);
-- idempotencia de integraciones (tesoreria/wav): una sola imputación por referencia
CREATE UNIQUE INDEX IF NOT EXISTS ux_emi_mov_ctacte_origen
    ON emisiones_movimientos_ctacte (origen_modulo, origen_ref)
    WHERE origen_modulo IS NOT NULL AND origen_ref IS NOT NULL AND tipo = 'credito' AND concepto = 'pago';

-- 2) Curva temporal de coeficientes de recargo por mora
CREATE TABLE IF NOT EXISTS emisiones_coeficientes (
    id            BIGSERIAL PRIMARY KEY,
    tipo_tributo  VARCHAR(50),                 -- NULL = aplica a todos los tributos
    fecha_desde   TIMESTAMPTZ NOT NULL,
    fecha_hasta   TIMESTAMPTZ,
    tipo          VARCHAR(10) NOT NULL DEFAULT 'mensual',  -- mensual | diario
    valor         NUMERIC(12,6) NOT NULL DEFAULT 0,
    descripcion   VARCHAR(200),
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now(),
    activo        BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS ix_emi_coef_desde ON emisiones_coeficientes (fecha_desde);

-- 3) Múltiples vencimientos por comprobante (hasta 4)
CREATE TABLE IF NOT EXISTS emisiones_vencimientos_comprobante (
    id                 BIGSERIAL PRIMARY KEY,
    id_comprobante     BIGINT NOT NULL,
    id_emision         BIGINT,
    numero             INTEGER NOT NULL DEFAULT 1,   -- 1..4
    fecha_vencimiento  TIMESTAMPTZ,
    importe            NUMERIC(18,2) NOT NULL DEFAULT 0,
    tipo               VARCHAR(12) NOT NULL DEFAULT 'aPagar',  -- aCancelar | aPagar
    created_at         TIMESTAMPTZ DEFAULT now(),
    activo             BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS ix_emi_venc_comprobante ON emisiones_vencimientos_comprobante (id_comprobante);

-- ============================================================================
-- Permisos: se reutilizan los de emisiones; se agrega uno específico para el
-- ABM de coeficientes / definición de vencimientos.
-- ============================================================================
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('emisiones_coeficientes', 'Emisiones · ABM de coeficientes de recargo', 'Cargar/editar la curva de coeficientes y vencimientos', 'emisiones', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar el permiso nuevo al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'emisiones_coeficientes'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;

-- ═══════════ wav ═══════════
-- Migración WAV — autogestión: permisos del módulo + tabla de adhesión a débito. Idempotente.
-- La tabla wav_adhesiones_debito también la crea Base.metadata.create_all al arrancar; este DDL es por si se aplica el SQL antes.
CREATE TABLE IF NOT EXISTS wav_adhesiones_debito (
    id          BIGSERIAL PRIMARY KEY,
    id_cuenta   BIGINT NOT NULL,
    medio       VARCHAR(20) NOT NULL,
    datos       VARCHAR(250),
    titular     VARCHAR(150),
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Permisos estándar del módulo wav (reutilizados por las features de autogestión).
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('wav_read',   'WAV · Consulta',        'Consultar cuentas, deuda, DDJJ y recibos de autogestión', 'wav', 0),
 ('wav_write',  'WAV · Operar',          'Presentar DDJJ, pagar deuda y adherir débito automático', 'wav', 0),
 ('wav_delete', 'WAV · Baja',            'Bajas de adhesiones/registros de autogestión',            'wav', 0),
 ('wav_admin',  'WAV · Administración',  'Administración del módulo de autogestión',                'wav', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'wav_%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
