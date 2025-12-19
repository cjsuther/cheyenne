USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_condicion_especial
GO

INSERT INTO tipo_condicion_especial
SELECT
	cast(COD_TIPO_CONDICION_ESPECIAL as bigint) id
	,COD_TIPO_CONDICION_ESPECIAL codigo
	,A.NOMBRE
	,ROW_NUMBER() OVER (ORDER BY COD_TIPO_CONDICION_ESPECIAL) orden 
	,tri.ID id_tipo_tributo
	,TIPO
	,COLOR
	,(case when inhibicion='S' then 1 else 0 end) inhibicion 
FROM MAJOR_CAMPANA.dbo.TIPO_CONDICION_ESPECIAL A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
WHERE COD_TIPO_CONDICION_ESPECIAL>0
ORDER BY id
GO
