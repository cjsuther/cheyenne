-- Migración 018 — Motor de imputación del contable: permiso para definir reglas. Idempotente.
-- (Las tablas contabilidad_transacciones/reglas_imputacion/regla_lineas/mapeo_cuentas
--  las crea create_all al arrancar el servicio.)
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('contabilidad_reglas', 'Contabilidad · Reglas de imputación', 'Definir reglas y mapeo de cuentas para convertir transacciones en asientos', 'contabilidad', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'contabilidad_reglas'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
