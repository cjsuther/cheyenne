INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('rrhh_read',  'RRHH · Consulta', 'Ver legajos, cargos, antigüedad, familiares, maestros y planta', 'rrhh', 0),
 ('rrhh_write', 'RRHH · Cargar',   'Alta/edición/baja de legajos, cargos, familiares, maestros y planta', 'rrhh', 0)
ON CONFLICT (codigo) DO NOTHING;
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'rrhh_%'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;
