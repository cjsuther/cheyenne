USE LARAMIE_CAMPANA
GO

SELECT
	id,
	codigo,
	nombre,
	orden,
	id_provincia
FROM
	dbo.localidad
ORDER BY
	id
GO
