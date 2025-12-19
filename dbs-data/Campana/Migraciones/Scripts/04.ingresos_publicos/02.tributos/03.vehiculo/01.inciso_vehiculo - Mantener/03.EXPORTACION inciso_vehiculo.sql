USE LARAMIE_CAMPANA
GO

SELECT 
	id,
	codigo,
	nombre,
	orden,
	vehiculo_menor,
	codigo_sucerp
FROM inciso_vehiculo
ORDER BY id
GO
