-- Permisos del módulo Firma Digital. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('firma_read',   'Firma · Consulta',       'Ver documentos, bandeja y verificar firmas', 'firma', 0),
 ('firma_write',  'Firma · Registrar',      'Registrar documentos para firmar',           'firma', 0),
 ('firma_firmar', 'Firma · Firmar',         'Firmar documentos de la bandeja propia',     'firma', 0),
 ('firma_admin',  'Firma · Administración', 'Anular documentos y administrar el módulo',  'firma', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'firma_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
