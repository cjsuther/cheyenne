USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_recargo_descuento
GO

INSERT INTO tipo_recargo_descuento
SELECT
	cast(COD_TIPO_RECARGO_DESCUENTO as bigint) id
	,COD_TIPO_RECARGO_DESCUENTO codigo
	,A.NOMBRE
	,ROW_NUMBER() OVER (ORDER BY COD_TIPO_RECARGO_DESCUENTO) orden 
	,tri.ID id_tipo_tributo
	,TIPO
	,PORCENTAJE
	,IMPORTE
	,(case when EMITE_SOLICITUD='S' then 1 else 0 end) emite_solicitud
	,(case when REQUIERE_OTROGAMIENTO='S' then 1 else 0 end) requiere_otrogamiento
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
	,PROCEDIMIENTO
FROM MAJOR_CAMPANA.dbo.TIPO_RECARGO_DESCUENTO A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
WHERE COD_TIPO_RECARGO_DESCUENTO>0
ORDER BY id
GO
