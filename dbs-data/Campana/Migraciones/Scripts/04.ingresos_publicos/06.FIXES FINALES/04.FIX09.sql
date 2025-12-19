-- Ver los items que no tienen rubro

SELECT *
FROM declaracion_jurada_item
WHERE id_rubro IS NULL;

-- Actualizar los items que no tienen rubro
UPDATE declaracion_jurada_item
SET id_rubro = 999999
WHERE id_rubro IS NULL;

-- Ver los items que se actualizaron
SELECT *
FROM declaracion_jurada_item
WHERE id_rubro = 999999;