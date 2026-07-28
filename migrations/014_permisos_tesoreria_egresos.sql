-- Migración 014 — Permisos de egresos de Tesorería (pagar / anular pago). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('tesoreria_pagar',       'Tesorería · Pagar OP',        'Ejecutar el pago de una orden de pago (egreso)', 'tesoreria', 0),
 ('tesoreria_anular_pago', 'Tesorería · Anular pago/OP',  'Anular órdenes de pago y revertir egresos',      'tesoreria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('tesoreria_pagar','tesoreria_anular_pago')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
