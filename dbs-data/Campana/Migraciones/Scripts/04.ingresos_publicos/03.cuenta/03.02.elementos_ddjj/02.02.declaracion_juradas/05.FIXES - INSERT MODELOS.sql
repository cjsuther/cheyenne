TRUNCATE TABLE modelo_declaracion_jurada cascade;

INSERT INTO modelo_declaracion_jurada
SELECT 1 id, '0001' Codigo, 'GENERAL' nombre, 1 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, true activo, '' observacion
union
SELECT 2 id, '0002' Codigo, 'LEGADO' nombre, 2 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, false activo, 'Contiene todas las clases de migración' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 1 id_modelo_declaracion_jurada, id_clase_declaracion_jurada FROM tipo_declaracion_jurada --GENERAL: tiene todo
union
SELECT distinct 2 id_modelo_declaracion_jurada, id id_clase_declaracion_jurada FROM clase_declaracion_jurada; --LEGADO: tiene todo

-- TISH

INSERT INTO modelo_declaracion_jurada
SELECT 3 id, '0003' Codigo, 'TISH' nombre, 3 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, true activo, 'Tasa de inspección de seguridad e higiene' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 3 id_modelo_declaracion_jurada, id FROM clase_declaracion_jurada 
    WHERE codigo='TISH' or codigo='TISH_EMPLEADOS';


-- Mantenimiento vial

INSERT INTO modelo_declaracion_jurada
SELECT 4 id, '0004' Codigo, 'Mantenimiento vial' nombre, 4 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, true activo, 'Mantenimiento vial' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 4 id_modelo_declaracion_jurada, id FROM clase_declaracion_jurada 
    WHERE codigo='MANT_VIAL';


-- Envases no retornables

INSERT INTO modelo_declaracion_jurada
SELECT 5 id, '0005' Codigo, 'Comercialización de envases no retornables' nombre, 5 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, true activo, 'Envases no retornables' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 5 id_modelo_declaracion_jurada, id FROM clase_declaracion_jurada 
    WHERE codigo='ENVASES_NR';


-- Explotación de canteras

INSERT INTO modelo_declaracion_jurada
SELECT 6 id, '0006' Codigo, 'Explotación de canteras' nombre, 6 orden, 11 id_tipo_tributo, 391 id_periodicidad_declaracion_jurada, true activo, 'Explotación de canteras' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 6 id_modelo_declaracion_jurada, id FROM clase_declaracion_jurada 
    WHERE codigo='EXPLOTACION_CANTERAS';

-- TAP

INSERT INTO modelo_declaracion_jurada
SELECT 7 id, '0007' Codigo, 'Tasa de alumbrado público' nombre, 7 orden, 11 id_tipo_tributo, 390 id_periodicidad_declaracion_jurada, true activo, 'Tasa de alumbrado público' observacion;

INSERT INTO modelo_clase_declaracion_jurada
SELECT distinct 7 id_modelo_declaracion_jurada, id FROM clase_declaracion_jurada 
    WHERE codigo='TAP';


