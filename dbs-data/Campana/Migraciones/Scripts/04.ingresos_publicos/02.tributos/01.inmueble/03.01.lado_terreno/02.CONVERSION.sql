USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE lado_terreno
GO

INSERT INTO lado_terreno
SELECT
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA, A.NUMERO_LADO)) id
	,inm.ID id_inmueble
	,tla.ID id_tipo_lado
	,NUMERO_LADO numero
	,METROS
	,REDUCCION
	,MAJOR_CAMPANA.dbo.GET_DOMICILIO(I.CALLE_INMUEBLE,I.ALTURA_INMUEBLE,I.PISO_INMUEBLE,I.DEPTO_INMUEBLE,I.CP_INMUEBLE,
		case when L.IdLocalidad is null then 0 else L.IdLocalidad end,
		case when R.IdProvincia is null then 0 else R.IdProvincia end,
		case when R.IdProvincia is null then 0 else 1 end
	) direccion
FROM MAJOR_CAMPANA.dbo.LADO_TERRENO A INNER JOIN MAJOR_CAMPANA.dbo.INMUEBLE I ON I.NUMERO_CUENTA=A.NUMERO_CUENTA
	left join LARAMIE_CAMPANA.dbo.inmueble inm on inm.numero_cuenta=A.NUMERO_CUENTA
	left join MAJOR_CAMPANA.dbo.LISTA tla on tla.NOMBRE='TipoLado' and tla.CODIGO=A.COD_TIPO_LADO

	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R ON R.IdProvincia=1 --(se asume que la PROVINCIA es Buenos Aires)
	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado L ON TRIM(L.Descripcion)=TRIM(I.LOCALIDAD_INMUEBLE) and L.IdProvincia=R.IdProvincia and I.LOCALIDAD_INMUEBLE<>''
ORDER BY id
GO
