USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.escribano
GO

INSERT INTO dbo.escribano
SELECT
	Convert(bigint, ID_ESCRIBANO) id,
	isnull(codigo,'') codigo,
	nombre nombre,
	ROW_NUMBER() OVER (ORDER BY ID_ESCRIBANO) orden,
	isnull(matricula,'') matricula
FROM MAJOR.dbo.Escribano
WHERE ID_ESCRIBANO <> 0 and not nombre is null
GO
