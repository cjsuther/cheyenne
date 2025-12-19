-- SELECT TOP (1000) ID_OBRA
--       ,DESCRIPCION
--       ,TIPO_OBRA
-- FROM MAJOR.dbo.OBRAS


TRUNCATE TABLE LARAMIE.dbo.obra
GO

INSERT INTO LARAMIE.dbo.obra
SELECT 
	ID_OBRA id
	,ID_OBRA codigo
	,DESCRIPCION nombre
	,ROW_NUMBER() OVER (ORDER BY ID_OBRA) orden
	,0 importe
	,(case when TIPO_OBRA = 1 then 1001
	when TIPO_OBRA = 2 then 1002
	when TIPO_OBRA = 3 then 1003
	when TIPO_OBRA = 4 then 1004	
	when TIPO_OBRA = 5 then 1005	
	when TIPO_OBRA = 0 then NULL
	else NULL end) id_tipo_obra
FROM MAJOR.dbo.OBRAS
WHERE ID_OBRA <> 0
GROUP BY ID_OBRA, DESCRIPCION, TIPO_OBRA