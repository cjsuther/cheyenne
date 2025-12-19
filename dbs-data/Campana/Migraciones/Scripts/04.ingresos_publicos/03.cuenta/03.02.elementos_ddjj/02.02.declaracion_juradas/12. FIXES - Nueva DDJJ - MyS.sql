--- 1. INSERT CLASE

INSERT INTO clase_declaracion_jurada (id, codigo, nombre, orden, aplica_rubro, regimen_general, obligatorio,
                                      observacion, aplica_rubro_principal, aplica_generico)
VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM clase_declaracion_jurada), 'MARCAS_SEÑALES', 'Marcas y señales', 9, true, false, true, '', false, true);


--- 2. INSERT tipo_declaracion_jurada
INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_EQUINO_BOVINO_PROPIO_FERIA', 'Cantidad de cabezas de ganado equino o bovino - Propio - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_EQUINO_BOVINO_PROPIO_OTRAS', 'Cantidad de cabezas de ganado equino o bovino - Propio - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_EQUINO_BOVINO_OTROS_FERIA', 'Cantidad de cabezas de ganado equino o bovino - Otros productores - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_EQUINO_BOVINO_OTROS_OTRAS', 'Cantidad de cabezas de ganado equino o bovino - Otros productores - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_OVINO_PROPIO_FERIA', 'Cantidad de cabezas de ganado ovino - Propio - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_OVINO_PROPIO_OTRAS', 'Cantidad de cabezas de ganado ovino - Propio - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_OVINO_OTROS_FERIA', 'Cantidad de cabezas de ganado ovino - Otros productores - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_OVINO_OTROS_OTRAS', 'Cantidad de cabezas de ganado ovino - Otros productores - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_PORCINO_PROPIO_FERIA', 'Cantidad de cabezas de ganado porcino - Propio - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_PORCINO_PROPIO_OTRAS', 'Cantidad de cabezas de ganado porcino - Propio - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_PORCINO_OTROS_FERIA', 'Cantidad de cabezas de ganado porcino - Otros productores - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'GANADO_PORCINO_OTROS_OTRAS', 'Cantidad de cabezas de ganado porcino - Otros productores - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'CUERO_GANADO_MAYOR_FERIA', 'Cantidad de guías de cuero de ganado mayor - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'CUERO_GANADO_MAYOR_OTRAS', 'Cantidad de guías de cuero de ganado mayor - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'CUERO_GANADO_MENOR_FERIA', 'Cantidad de guías de cuero de ganado menor - A feria', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

INSERT INTO tipo_declaracion_jurada (id, codigo, nombre, orden, id_clase_declaracion_jurada, id_unidad_medida)
SELECT (SELECT COALESCE(MAX(id), 0) + 1 FROM tipo_declaracion_jurada), 'CUERO_GANADO_MENOR_OTRAS', 'Cantidad de guías de cuero de ganado menor - A otras guías', (SELECT COALESCE(MAX(orden), 0) + 1 FROM tipo_declaracion_jurada), cdj.id, 480
FROM clase_declaracion_jurada cdj WHERE cdj.codigo = 'MARCAS_SEÑALES';

--- 3. INSERT modelo_declaracion_jurada

INSERT INTO modelo_declaracion_jurada
SELECT 
    COALESCE(MAX(id), 0) + 1 AS id, 
    LPAD((COALESCE(MAX(id), 0) + 1)::TEXT, 4, '0') AS codigo, 
    'Marcas y señales' AS nombre, 
    COALESCE(MAX(orden), 0) + 1 AS orden, 
    11 AS id_tipo_tributo, 
    390 AS id_periodicidad_declaracion_jurada,
    TRUE AS activo, 
    'Marcas y señales' AS observacion
FROM modelo_declaracion_jurada;


--- 4. INSERT modelo_clase_declaracion_jurada

INSERT INTO modelo_clase_declaracion_jurada
SELECT 
    (SELECT id FROM modelo_declaracion_jurada WHERE codigo = '0009') AS id_modelo_declaracion_jurada, 
    id 
FROM clase_declaracion_jurada 
WHERE codigo = '0009';