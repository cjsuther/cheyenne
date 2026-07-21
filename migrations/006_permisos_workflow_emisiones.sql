-- Migración 006 — Permisos de ejecución de los 16 pasos del workflow de Emisiones
-- ----------------------------------------------------------------------------
-- Crea un permiso por paso (asignable a perfiles/roles desde el módulo de Seguridad)
-- y los asigna al perfil superadmin. Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/006_permisos_workflow_emisiones.sql
-- ----------------------------------------------------------------------------

INSERT INTO seguridad_permisos (codigo, nombre, descripcion, sistema, id_modulo) VALUES
 ('emisiones_paso01_importar_calculo',          'Emisiones · Importar cálculo anterior',            'Ejecutar el paso 1',  'emisiones', 0),
 ('emisiones_paso02_editar_calculo',            'Emisiones · Editar cálculo anterior',              'Ejecutar el paso 2',  'emisiones', 0),
 ('emisiones_paso03_calculo_prueba',            'Emisiones · Generar cálculo de prueba',            'Ejecutar el paso 3',  'emisiones', 0),
 ('emisiones_paso04_aprob_calculo_prueba',      'Emisiones · Aprobación del cálculo de prueba',     'Ejecutar el paso 4',  'emisiones', 0),
 ('emisiones_paso05_calculo_general',           'Emisiones · Generar cálculo general',              'Ejecutar el paso 5',  'emisiones', 0),
 ('emisiones_paso06_aprob_calculo_general',     'Emisiones · Aprobación del cálculo general',       'Ejecutar el paso 6',  'emisiones', 0),
 ('emisiones_paso07_ordenamiento_prueba',       'Emisiones · Ordenamiento de prueba',               'Ejecutar el paso 7',  'emisiones', 0),
 ('emisiones_paso08_impresion_prueba',          'Emisiones · Impresión de recibos de prueba',       'Ejecutar el paso 8',  'emisiones', 0),
 ('emisiones_paso09_aprob_ordenamiento_prueba', 'Emisiones · Aprobación del ordenamiento de prueba','Ejecutar el paso 9',  'emisiones', 0),
 ('emisiones_paso10_aprob_impresion_prueba',    'Emisiones · Aprobación de la impresión de prueba', 'Ejecutar el paso 10', 'emisiones', 0),
 ('emisiones_paso11_aprob_codigo_barras',       'Emisiones · Aprobación del código de barras',      'Ejecutar el paso 11', 'emisiones', 0),
 ('emisiones_paso12_ordenamiento_general',      'Emisiones · Ordenamiento general',                 'Ejecutar el paso 12', 'emisiones', 0),
 ('emisiones_paso13_aprob_ordenamiento_general','Emisiones · Aprobación del ordenamiento general',  'Ejecutar el paso 13', 'emisiones', 0),
 ('emisiones_paso14_impresion_general',         'Emisiones · Impresión de recibos general',         'Ejecutar el paso 14', 'emisiones', 0),
 ('emisiones_paso15_aprob_impresion_general',   'Emisiones · Aprobación de la impresión general',   'Ejecutar el paso 15', 'emisiones', 0),
 ('emisiones_paso16_cuenta_corriente',          'Emisiones · Generación de la cuenta corriente',    'Ejecutar el paso 16', 'emisiones', 0)
ON CONFLICT (codigo) DO NOTHING;

-- Asignar los 16 permisos al perfil superadmin
INSERT INTO seguridad_perfil_permiso (perfil_id, permiso_id)
SELECT pf.id, pm.id
FROM seguridad_perfiles pf
JOIN seguridad_permisos pm ON pm.codigo LIKE 'emisiones_paso%'
WHERE pf.codigo = 'superadmin'
ON CONFLICT DO NOTHING;
