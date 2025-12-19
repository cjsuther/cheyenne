USE LARAMIE_CAMPANA
GO

SELECT
	id,
	codigo,
	tipo,
	nombre,
	orden
FROM lista_ingresos_publicos
ORDER BY id
GO
