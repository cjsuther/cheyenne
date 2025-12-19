INSERT INTO filtro (id, codigo, nombre, orden, id_tipo_tributo, ejecucion)
SELECT 1003, '1103', 'DDJJ - Envases NR', 1103, 11, 'filtro_comercio_ddjj_envases'
WHERE NOT EXISTS (
    SELECT 1 FROM filtro 
    WHERE codigo = '1103' OR ejecucion = 'filtro_comercio_ddjj_envases'
);

INSERT INTO filtro (id, codigo, nombre, orden, id_tipo_tributo, ejecucion)
SELECT 1004, '1104', 'DDJJ - TAP', 1104, 11, 'filtro_comercio_ddjj_tap'
WHERE NOT EXISTS (
    SELECT 1 FROM filtro 
    WHERE codigo = '1104' OR ejecucion = 'filtro_comercio_ddjj_tap'
);

INSERT INTO filtro (id, codigo, nombre, orden, id_tipo_tributo, ejecucion)
SELECT 1005, '1105', 'DDJJ - Explotación Canteras', 1105, 11, 'filtro_comercio_ddjj_explotacion_canteras'
WHERE NOT EXISTS (
    SELECT 1 FROM filtro 
    WHERE codigo = '1105' OR ejecucion = 'filtro_comercio_ddjj_explotacion_canteras'
);

INSERT INTO filtro (id, codigo, nombre, orden, id_tipo_tributo, ejecucion)
SELECT 1006, '1106', 'DDJJ - Mantenimiento Vial', 1106, 11, 'filtro_comercio_ddjj_mant_vial'
WHERE NOT EXISTS (
    SELECT 1 FROM filtro 
    WHERE codigo = '1106' OR ejecucion = 'filtro_comercio_ddjj_mant_vial'
);
