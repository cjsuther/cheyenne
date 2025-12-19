--finalmente se utilizaría el rubro generico por compatibilidad con major, y aplica rubros en todas las clases para poder incluir el 999999
UPDATE clase_declaracion_jurada SET aplica_rubro=true;

UPDATE clase_declaracion_jurada
SET aplica_generico = true
WHERE codigo NOT IN ('TISH', 'TISH_EMPLEADOS');
