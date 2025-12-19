USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE dbo.variable
GO

INSERT INTO variable
SELECT 
	(ROW_NUMBER() OVER (ORDER BY id_tipo_tributo,codigo)) id,
	codigo,
	descripcion,
	id_tipo_tributo,
	'string' tipo_dato,
	0 constante,
	1 predefinido,
	1 opcional,
	1 activo,
	0 global,
	'' lista
FROM
(
	SELECT DISTINCT
		A.NOMBRE codigo,
		A.NOMBRE descripcion,
		tri.ID id_tipo_tributo
	FROM MAJOR_CAMPANA.dbo.VARIABLES_CUENTA A
		left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
) T
ORDER BY id_tipo_tributo,codigo
GO
