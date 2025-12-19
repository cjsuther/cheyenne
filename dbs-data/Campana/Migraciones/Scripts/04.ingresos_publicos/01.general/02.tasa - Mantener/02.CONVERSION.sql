USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tasa
GO

INSERT INTO tasa
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TASA)) id
	,A.COD_TASA codigo
	,tri.ID id_tipo_tributo
	,isnull(cat.ID,1) id_categoria_tasa --1: TASA (cuidado que es id)
	,A.DESCRIPCION
	,A.PORC_DESCUENTO porcentaje_descuento
FROM MAJOR_CAMPANA.dbo.TASA A
	left join LARAMIE_CAMPANA.dbo.categoria_tasa cat on cat.codigo=A.COD_CATEGORIA_TASA
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
WHERE A.COD_TASA > 0
GO
