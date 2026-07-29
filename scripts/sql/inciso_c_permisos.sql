-- Inciso C — permisos nuevos (emisiones_compensar, ingresos_prescribir, ingresos_transferir).
-- Las tablas nuevas (mapeo_tributo, prescripciones, transferencias_dominio, reglas_alerta,
-- alertas_disparadas) se crean solas via Base.metadata.create_all() al levantar cada módulo.
-- Idempotente. Esquema real: seguridad_permisos(codigo,nombre,descripcion,sistema,id_modulo)
-- y puente seguridad_perfil_permiso(perfil_id,permiso_id); perfil 'superadmin'.

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
  ('emisiones_compensar', 'Emisiones · Compensar saldo a favor', 'Aplicar el saldo a favor (crédito) del contribuyente contra un concepto de deuda', 'emisiones', 0),
  ('ingresos_prescribir', 'Ingresos · Prescribir', 'Marcar deuda/período como prescripta por antigüedad con acto administrativo', 'ingresos_publicos', 0),
  ('ingresos_transferir', 'Ingresos · Transferir dominio', 'Transferir la titularidad de una cuenta/objeto a otro contribuyente', 'ingresos_publicos', 0)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo IN ('emisiones_compensar', 'ingresos_prescribir', 'ingresos_transferir')
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
