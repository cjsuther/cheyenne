USE LARAMIE_CAMPANA
GO

SELECT
	id,
	codigo,
	nombre,
	orden,
	id_pais
FROM
	dbo.provincia
ORDER BY
	id
GO
