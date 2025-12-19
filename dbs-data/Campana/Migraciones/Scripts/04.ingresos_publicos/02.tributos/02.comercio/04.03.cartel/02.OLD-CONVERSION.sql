USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE cartel
GO

INSERT INTO cartel
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA_COMERCIO,A.NUMERO)) id
	,com.ID id_comercio
    ,NUMERO
    ,anu.ID id_tipo_anuncio
    ,tca.ID id_tipo_cartel
	,tpr.ID id_tipo_propiedad
    ,odj.ID id_origen_declaracion_jurada
    ,ubi.ID id_categoria_ubicacion 
    ,ANUNCIO
    ,MARQUESINA
    ,CANTIDAD_PUBLICIDADES
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_INICIO) fecha_inicio
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_RESOLUCION) fecha_resolucion
	,NUMERO_DDJJ
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DDJJ) fecha_ddjj
	,ANIO_DDJJ
	,MES_DDJJ
	,A.CATASTRAL_CIR
	,A.CATASTRAL_SEC
	,A.CATASTRAL_COD
	,A.CATASTRAL_CHACRA
	,A.CATASTRAL_LCHACRA
	,A.CATASTRAL_QUINTA
	,A.CATASTRAL_LQUINTA
	,A.CATASTRAL_FRAC
	,A.CATASTRAL_LFRAC
	,A.CATASTRAL_MANZ
	,A.CATASTRAL_LMANZ
	,A.CATASTRAL_PARC
	,A.CATASTRAL_LPARC
	,A.CATASTRAL_SUBPARC
	,A.CATASTRAL_UFUNC
	,A.CATASTRAL_UCOMP
    ,inm.ID id_cuenta_inmueble 
    ,tas.ID id_tasa 
    ,stas.ID id_sub_tasa 
    ,ALTO
    ,ANCHO
    ,baja.ID id_motivo_baja_comercio 
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
    ,bloq.ID id_bloqueo_emision 
    ,1590 id_tipo_producto_publicitado --1590: General
	,SUPERFICIE
	,MAJOR_CAMPANA.dbo.GET_DOMICILIO(A.CALLE,A.ALTURA,A.PISO,A.DEPTO,A.CP,
		case when L.IdLocalidad is null then 0 else L.IdLocalidad end,
		case when R.IdProvincia is null then 0 else R.IdProvincia end,
		case when R.IdProvincia is null then 0 else 1 end
	) direccion
FROM MAJOR_CAMPANA.dbo.CARTEL A
	left join LARAMIE_CAMPANA.dbo.comercio com on com.numero_cuenta=A.NUMERO_CUENTA_COMERCIO
	left join LARAMIE_CAMPANA.dbo.inmueble inm on inm.numero_cuenta=A.NUMERO_CUENTA_INMUEBLE
	left join LARAMIE_CAMPANA.dbo.tipo_anuncio anu on anu.codigo=A.COD_TIPO_ANUNCIO
	left join LARAMIE_CAMPANA.dbo.origen_declaracion_jurada odj on odj.codigo=A.COD_TIPO_DDJJ
	left join LARAMIE_CAMPANA.dbo.categoria_ubicacion ubi on ubi.codigo=A.COD_CATEGORIA_UBICACION
	left join LARAMIE_CAMPANA.dbo.tasa tas on tas.codigo=A.COD_TASA
	left join LARAMIE_CAMPANA.dbo.sub_tasa stas on stas.codigo=A.COD_SUB_TASA and stas.id_tasa=tas.id
	left join LARAMIE_CAMPANA.dbo.motivo_baja_rubro_comercio baja on baja.codigo=A.COD_MOTIVO_BAJA_COMERCIO
	left join MAJOR_CAMPANA.dbo.LISTA tca on tca.NOMBRE='TipoCartel' and tca.CODIGO=A.COD_TIPO_CARTEL
	left join MAJOR_CAMPANA.dbo.LISTA tpr on tpr.NOMBRE='TipoPropiedad' and tpr.CODIGO=CAST(A.COD_TIPO_PROPIEDAD as varchar(20))
	left join MAJOR_CAMPANA.dbo.LISTA bloq on bloq.NOMBRE='BloqueoEmision' and bloq.CODIGO=A.COD_BLOQUEO_EMISION

	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R ON R.IdProvincia=1 --(se asume que la PROVINCIA es Buenos Aires)
	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado L ON TRIM(L.Descripcion)=TRIM(A.LOCALIDAD) and L.IdProvincia=R.IdProvincia and A.LOCALIDAD<>''
ORDER BY id
GO
