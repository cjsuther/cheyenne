-- Antes de importar, debe truncarse la tabla rubro y rubro_comercio

USE LARAMIE_CAMPANA
GO

SELECT
	id,
	codigo,
	nombre,
	orden,
	agrupamiento,
	fecha_baja,
	facturable,
	generico,
	categoria,
	importe_minimo,
	alicuota,
	regimen_general,
	id_tipo_minimo_aplicable
FROM rubro
ORDER BY id
GO
