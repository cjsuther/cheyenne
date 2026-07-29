-- Migración 022 — Permisos del módulo Crédito Público. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('credito_read',     'Crédito Público · Consulta',       'Ver empréstitos, cronograma y desembolsos', 'credito_publico', 0),
 ('credito_write',    'Crédito Público · Cargar',         'Alta de empréstitos, plan y desembolsos',   'credito_publico', 0),
 ('credito_servicio', 'Crédito Público · Servicio',       'Pagar cuotas del servicio de deuda',        'credito_publico', 0),
 ('credito_admin',    'Crédito Público · Administración', 'Administración del módulo',                 'credito_publico', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'credito_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
