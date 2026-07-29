-- Migración 015 — Permisos del módulo Compras. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('compras_read',     'Compras · Consulta',           'Ver proveedores, artículos, pedidos, OC y stock', 'compras', 0),
 ('compras_write',    'Compras · Cargar',             'Maestros y pedidos de área',                      'compras', 0),
 ('compras_delete',   'Compras · Baja',               'Bajas de maestros/pedidos',                       'compras', 0),
 ('compras_ordenar',  'Compras · Órdenes de compra',  'Emitir y anular órdenes de compra',               'compras', 0),
 ('compras_recibir',  'Compras · Recibir',            'Registrar recepciones e ingresar al stock',       'compras', 0),
 ('compras_admin',    'Compras · Administración',     'Administración del módulo',                       'compras', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'compras_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
