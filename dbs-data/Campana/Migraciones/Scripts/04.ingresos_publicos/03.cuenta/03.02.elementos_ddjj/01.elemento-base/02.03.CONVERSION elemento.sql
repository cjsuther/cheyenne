USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE elemento
GO

INSERT INTO elemento
SELECT
	(ROW_NUMBER() OVER (ORDER BY dc.id_tipo_tributo, dc.NUMERO_CUENTA, dc.PERIODO, dc.MES, dc.NUMERO, dc.COD_RUBRO, dc.COD_TASA, dc.COD_SUBTASA)) id
	,dc.id_tipo_tributo
	,cue.ID id_cuenta
	,rub.ID id_rubro
		,dc.COD_TASA cod_tasa
		,dc.COD_SUBTASA cod_subtasa
	,dc.NUMERO numero
	,dc.MES mes
	,dc.PERIODO periodo
	,isnull(odj.ID,1) id_origen_declaracion_jurada
    ,CE.id id_clase_elemento 
    ,TE.id id_tipo_elemento
    ,cast(dc.VALOR as numeric(18,2)) cantidad
	,MAJOR_CAMPANA.dbo.GET_FECHA(dc.FECHA_ALTA) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(dc.FECHA_BAJA) fecha_baja
	,RESOLUCION
    ,1 activo
FROM
(
	SELECT tri.ID id_tipo_tributo, NUMERO_CUENTA,cast(COD_CLASE as varchar(50)) COD_TASA,cast(COD_TIPO as varchar(50)) COD_SUBTASA,COD_RUBRO,PERIODO,MES,NUMERO,ddjj.VALOR,FECHA_ALTA,FECHA_BAJA,COD_ORIGEN_DECLARACION_JURADA,RESOLUCION
		FROM MAJOR_CAMPANA.dbo.DECLARACION_JURADA ddjj
			left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=COD_TIPO_TRIBUTO
) AS dc
	INNER JOIN LARAMIE_CAMPANA.dbo.clase_elemento AS CE ON CE.COD_TASA=dc.COD_TASA
	INNER JOIN LARAMIE_CAMPANA.dbo.tipo_elemento AS TE ON TE.COD_TASA=dc.COD_TASA and TE.COD_SUBTASA=dc.COD_SUBTASA

	left join LARAMIE_CAMPANA.dbo.origen_declaracion_jurada AS odj on odj.codigo=dc.COD_ORIGEN_DECLARACION_JURADA
	left join LARAMIE_CAMPANA.dbo.cuenta AS cue on cue.numero_cuenta=dc.NUMERO_CUENTA and cue.id_tipo_tributo=dc.id_tipo_tributo
	left join LARAMIE_CAMPANA.dbo.rubro AS rub on rub.codigo=dc.COD_RUBRO
WHERE cue.ID is not null
ORDER BY id
GO
