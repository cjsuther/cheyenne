USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE clase_elemento
GO

INSERT INTO clase_elemento
SELECT 
	(ROW_NUMBER() OVER (ORDER BY dc.codigo)) id
	,dc.codigo cod_tasa
    ,dc.codigo
    ,dc.nombre
    ,(ROW_NUMBER() OVER (ORDER BY dc.codigo)) orden
    ,11 id_tipo_tributo --comercio
    ,1 ejecucion_periodica
FROM
	MAJOR_CAMPANA.dbo.CLASE dc
GROUP BY dc.codigo, dc.nombre
ORDER BY id
GO
