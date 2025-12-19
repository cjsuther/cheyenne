USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE origen_declaracion_jurada
GO

INSERT INTO origen_declaracion_jurada
SELECT
	cast(CODIGO as bigint) id,
	CODIGO,
	VALOR nombre,
	(ROW_NUMBER() OVER (ORDER BY CODIGO)) orden,
	0 automatico
FROM MAJOR_CAMPANA.DBO.LISTA_DINAMICA
WHERE NOMBRE='OrigenDeclaracionJurada' AND CODIGO<>'0'
ORDER BY id
GO
