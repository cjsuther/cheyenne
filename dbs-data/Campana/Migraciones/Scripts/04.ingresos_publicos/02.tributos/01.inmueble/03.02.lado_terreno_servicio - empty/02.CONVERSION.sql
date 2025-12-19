USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE lado_terreno_servicio
GO

INSERT INTO lado_terreno_servicio
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA, A.NUMERO_LADO, A.COD_TASA, A.COD_SUB_TASA)) id
	,lad.ID id_lado_terreno
	,tas.ID id_tasa
	,stas.ID id_sub_tasa
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_DESDE, inm.fecha_carga_inicio) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
FROM MAJOR_CAMPANA.dbo.LADO_TERRENO_SERVICIO A
	left join LARAMIE_CAMPANA.dbo.inmueble inm on inm.numero_cuenta=A.NUMERO_CUENTA
	left join LARAMIE_CAMPANA.dbo.lado_terreno lad on lad.id_inmueble=inm.id and lad.numero=A.NUMERO_LADO
	left join LARAMIE_CAMPANA.dbo.tasa tas on tas.codigo=A.COD_TASA
	left join LARAMIE_CAMPANA.dbo.sub_tasa stas on stas.codigo=A.COD_SUB_TASA and stas.id_tasa=tas.id
ORDER BY id
GO
