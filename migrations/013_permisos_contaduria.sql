-- Migración 013 — Permisos del módulo Contaduría (ciclo del gasto). Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('contaduria_read',        'Contaduría · Consulta',            'Ver expedientes de gasto',                       'contaduria', 0),
 ('contaduria_write',       'Contaduría · Crear gasto',         'Crear expediente y registrar el preventivo',     'contaduria', 0),
 ('contaduria_comprometer', 'Contaduría · Comprometer',         'Registrar el compromiso (orden de compra)',      'contaduria', 0),
 ('contaduria_devengar',    'Contaduría · Devengar',            'Registrar el devengado (factura conformada)',    'contaduria', 0),
 ('contaduria_pagar',       'Contaduría · Pagar',               'Registrar el pagado (orden de pago)',            'contaduria', 0),
 ('contaduria_anular',      'Contaduría · Anular',              'Anular expedientes liberando el crédito',        'contaduria', 0),
 ('contaduria_admin',       'Contaduría · Administración',      'Administración del módulo',                      'contaduria', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'contaduria_%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
