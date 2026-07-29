-- Migración 016 — Permiso de conciliación bancaria (Tesorería egresos F3). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('tesoreria_conciliar', 'Tesorería · Conciliar', 'Cargar extractos y conciliar movimientos bancarios', 'tesoreria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'tesoreria_conciliar'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
