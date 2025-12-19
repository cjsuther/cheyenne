INSERT INTO clase_declaracion_jurada (id, codigo, nombre, orden, aplica_rubro, regimen_general, obligatorio, observacion, aplica_rubro_principal, aplica_generico)
VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM clase_declaracion_jurada), 'ANTENAS', N'Antenas', 8, true, false, true, '', false, true);


INSERT INTO tipo_declaracion_jurada (
    id, 
    codigo, 
    nombre, 
    orden, 
    id_clase_declaracion_jurada, 
    id_unidad_medida
)
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada),
    'ANTENAS_H20',
    N'Antenas - Hasta 20 metros',
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada),
    cdj.id,
    480
FROM clase_declaracion_jurada cdj
WHERE cdj.codigo = 'ANTENAS';

INSERT INTO tipo_declaracion_jurada (
    id, 
    codigo, 
    nombre, 
    orden, 
    id_clase_declaracion_jurada, 
    id_unidad_medida
)
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada),
    'ANTENAS_H50',
    N'Antenas - Mas de 20 metros y hasta 50 metros',
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada),
    cdj.id,
    480
FROM clase_declaracion_jurada cdj
WHERE cdj.codigo = 'ANTENAS';

INSERT INTO tipo_declaracion_jurada (
    id, 
    codigo, 
    nombre, 
    orden, 
    id_clase_declaracion_jurada, 
    id_unidad_medida
)
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada),
    'ANTENAS_M50',
    N'Antenas - Mas de 50 metros',
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada),
    cdj.id,
    480
FROM clase_declaracion_jurada cdj
WHERE cdj.codigo = 'ANTENAS';

INSERT INTO tipo_declaracion_jurada (
    id, 
    codigo, 
    nombre, 
    orden, 
    id_clase_declaracion_jurada, 
    id_unidad_medida
)
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada),
    'ANTENAS_H20_A3000',
    N'Antenas - Hasta 20 metros y Alcance inferior 3.000 metros',
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada),
    cdj.id,
    480
FROM clase_declaracion_jurada cdj
WHERE cdj.codigo = 'ANTENAS';

INSERT INTO tipo_declaracion_jurada (
    id, 
    codigo, 
    nombre, 
    orden, 
    id_clase_declaracion_jurada, 
    id_unidad_medida
)
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada),
    'ANTENAS_WICAPS',
    N'Antenas - Wicaps',
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada),
    cdj.id,
    480
FROM clase_declaracion_jurada cdj
WHERE cdj.codigo = 'ANTENAS';

INSERT INTO modelo_declaracion_jurada
SELECT 
    (SELECT COALESCE(MAX(id), 0) + 1 FROM modelo_declaracion_jurada) id, 
    '0007' Codigo, 
    'Antenas' nombre, 
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM modelo_declaracion_jurada) orden, 
    11 id_tipo_tributo, 
    394 id_periodicidad_declaracion_jurada, -- Periodicidad "Anual"
    true activo, 
    'Antenas' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT 
    (SELECT id FROM modelo_declaracion_jurada WHERE codigo = 'ANTENAS') AS id_modelo_declaracion_jurada, 
    id 
FROM clase_declaracion_jurada 
WHERE codigo = 'ANTENAS';
