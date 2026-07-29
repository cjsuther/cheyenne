-- Migración 021 — Permisos del módulo Patrimonio. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('patrimonio_read',      'Patrimonio · Consulta',       'Ver bienes, inventario y movimientos',        'patrimonio', 0),
 ('patrimonio_write',     'Patrimonio · Cargar',         'Altas, ediciones y pases de bienes',          'patrimonio', 0),
 ('patrimonio_amortizar', 'Patrimonio · Amortizar',      'Correr la amortización del período',          'patrimonio', 0),
 ('patrimonio_baja',      'Patrimonio · Baja',           'Dar de baja bienes',                          'patrimonio', 0),
 ('patrimonio_admin',     'Patrimonio · Administración', 'Administración del módulo',                   'patrimonio', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'patrimonio_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
