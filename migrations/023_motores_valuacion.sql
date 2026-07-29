-- Migración 023 — Motores de valuación: permiso + columna importe_liquidado en DDJJ. Idempotente.
INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('ingresos_valuar', 'Ingresos · Valuar', 'Correr los motores de valuación (inmuebles) y liquidar DDJJ de comercio', 'ingresos_publicos', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo = 'ingresos_valuar'
WHERE pf.codigo = 'superadmin' ON CONFLICT DO NOTHING;

ALTER TABLE ingresos_publicos_comercio_ddjj ADD COLUMN IF NOT EXISTS importe_liquidado NUMERIC(18,2);
