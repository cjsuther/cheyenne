-- Migración 011 — Permisos del super-módulo Presupuesto
-- ----------------------------------------------------------------------------
-- Matriz de permisos del diseño (sección 7.3). Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/011_permisos_presupuesto.sql
-- ----------------------------------------------------------------------------

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('presupuesto_read',                  'Presupuesto · Consulta',                    'Ver el módulo, partidas, saldos y tablero',                    'presupuesto', 0),
 ('presupuesto_write',                 'Presupuesto · Carga',                       'Nomencladores, partidas en formulación, borradores, recursos', 'presupuesto', 0),
 ('presupuesto_delete',                'Presupuesto · Baja',                        'Bajas lógicas de nomencladores y partidas en formulación',     'presupuesto', 0),
 ('presupuesto_modificacion_aprobar',  'Presupuesto · Aprobar modificaciones',      'Aprobar/anular modificaciones presupuestarias',                'presupuesto', 0),
 ('presupuesto_aprobar_ejercicio',     'Presupuesto · Administrar ejercicio',       'Aprobar, poner en vigencia, cerrar y prorrogar ejercicios',    'presupuesto', 0),
 ('presupuesto_afectar',               'Presupuesto · Registrar afectaciones',      'Registrar/liberar preventivo, compromiso, devengado, pagado',  'presupuesto', 0),
 ('presupuesto_admin',                 'Presupuesto · Administración',              'Configuración del módulo y reaperturas',                       'presupuesto', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'presupuesto_%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
