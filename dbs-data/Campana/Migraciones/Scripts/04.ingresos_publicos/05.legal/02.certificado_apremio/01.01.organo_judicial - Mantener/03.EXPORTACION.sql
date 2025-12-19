USE LARAMIE
GO

SELECT
	id,
	codigo_organo_judicial,
	departamento_judicial,
	fuero,
	secretaria
FROM organo_judicial
ORDER BY id
GO
