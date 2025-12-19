USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE sub_tasa
GO

INSERT INTO sub_tasa
SELECT 
	(ROW_NUMBER() OVER (ORDER BY A.COD_TASA,A.COD_SUB_TASA)) id
	,tas.ID id_tasa
	,A.COD_SUB_TASA codigo
	,A.DESCRIPCION
	,IMPUESTO_NACIONAL
	,IMPUESTO_PROVINCIAL
	,CTAS_CTES
	,ISNULL(TIMBRADOS_EXTRAS,0) timbrados_extras
	,ISNULL(DESCRIPCION_REDUCIDA,'') descripcion_reducida
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
	,(case when RUBRO_GENERICO='S' then 1 else 0 end) rubro_generico
	,(case when LIQUIDABLE_CTA_CTE='S' then 1 else 0 end) liquidable_cta_cte
	,(case when LIQUIDABLE_DDJJ='S' then 1 else 0 end) liquidable_ddjj
	,(case when ACTUALIZACION='S' then 1 else 0 end) actualizacion
	,(case when ACCESORIOS='S' then 1 else 0 end) accesorios
	,(case when INTERNET_DDJJ='S' then 1 else 0 end) internet_ddjj
	,(case when IMPUT_X_PORC='S' then 1 else 0 end) imput_x_porc
FROM MAJOR_CAMPANA.dbo.SUB_TASA A
left join LARAMIE_CAMPANA.dbo.tasa tas on tas.codigo=A.COD_TASA
WHERE A.COD_TASA > 0
ORDER BY A.COD_TASA,A.COD_SUB_TASA
GO
