TRUNCATE TABLE LARAMIE.dbo.lado_terreno_obra
GO

INSERT INTO LARAMIE.dbo.lado_terreno_obra
SELECT 
	 0 id_lado_terreno
	,ID_LADO_TERRENO cod_lado_terreno
	,ID_OBRA id_obra
	,IMPORTE importe
	,REDUCCION_METROS reduccion_metros
	,REDUCCION_SUPERFICIE reduccion_superficie
	,(case when FECHA IS NULL then GETDATE() else FECHA end) fecha
FROM MAJOR.dbo.LADO_TERRENO_OBRA
GO

UPDATE LARAMIE.dbo.lado_terreno_obra
SET id_lado_terreno=l.id
FROM
LARAMIE.dbo.lado_terreno_obra lo INNER JOIN LARAMIE.dbo.lado_terreno l on lo.cod_lado_terreno=l.cod_lado_terreno
GO

DELETE LARAMIE.dbo.lado_terreno_obra WHERE id_lado_terreno=0
GO
