USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE rubro
GO

INSERT INTO rubro
SELECT
	 COD_RUBRO id
	,COD_RUBRO codigo
	,A.NOMBRE
	,(ROW_NUMBER() OVER (ORDER BY COD_RUBRO)) orden
	,isnull(A.AGRUPAMIENTO,'') agrupamiento
	,MAJOR_CAMPANA.dbo.GET_FECHA(FECHA_BAJA) fecha_baja
	,case when FACTURABLE='S' then 1 else 0 end facturable
	,case when GENERICO='S' then 1 else 0 end generico
	,isnull(CATEGORIA,'') categoria
	,IMPORTE_MINIMO
	,isnull(rubro_alicuota.alicuota,0) alicuota
	,case when REGIMEN_GENERAL='S' then 1 else 0 end regimen_general
	,isnull(tma.ID,160) id_tipo_minimo_aplicable --default: General
FROM MAJOR_CAMPANA.dbo.RUBRO A
	left join LARAMIE_CAMPANA.dbo.rubro_alicuota on rubro_alicuota.codigo = A.COD_RUBRO
	left join MAJOR_CAMPANA.dbo.LISTA tma on tma.NOMBRE='TipoMinimoAplicable' and tma.CODIGO=A.COD_TIPO_MINIMO_APLICABLE
WHERE COD_RUBRO>0
ORDER BY id
GO
