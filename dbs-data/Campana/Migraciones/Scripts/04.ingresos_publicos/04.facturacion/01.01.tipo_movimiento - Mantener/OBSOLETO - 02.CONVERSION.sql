USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_movimiento
GO

INSERT INTO tipo_movimiento
SELECT
	 cast(A.COD_TIPO_MOVIMIENTO as bigint) id
	,COD_TIPO_MOVIMIENTO codigo
	,DESCRIPCION nombre
	,(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_MOVIMIENTO)) orden
	,(case when ACTUALIZA_EMITIDO='S' then 1 else 0 end) act_emitido
	,(case when AUTOMATICO='S' then 1 else 0 end) automatico
	,(case when AUTONUMERABLE='S' then 1 else 0 end) autonumerado
	,NUMERO
	,DEBE_HABER imputacion
	,TIPO
FROM MAJOR_CAMPANA.dbo.TIPO_MOVIMIENTO A
WHERE COD_TIPO_MOVIMIENTO > 0
ORDER BY id
GO
