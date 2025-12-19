USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE motivo_baja_rubro_comercio
GO

INSERT INTO motivo_baja_rubro_comercio
SELECT
	cast(CODIGO as bigint) id,
	CODIGO,
	VALOR nombre,
	(ROW_NUMBER() OVER (ORDER BY CODIGO)) orden,
	0 baja_con_deuda,
	0 baja_cancela_deuda
FROM MAJOR_CAMPANA.DBO.LISTA_ESTATICA
WHERE NOMBRE='MotivoBajaComercio' AND CODIGO<>'0'
ORDER BY id
GO
