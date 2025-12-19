USE LARAMIE
GO

TRUNCATE TABLE registro_civil
GO

INSERT INTO registro_civil
SELECT
	ROW_NUMBER() OVER(ORDER BY R.nombre) id,
	cast(ROW_NUMBER() OVER(ORDER BY R.nombre) as nvarchar(20)) codigo,
	R.nombre,
	ROW_NUMBER() OVER(ORDER BY R.nombre) orden
FROM (select distinct registro_civil nombre FROM [MAJOR].[dbo].[INHUMADOS] where not registro_civil is null) as R
GO


