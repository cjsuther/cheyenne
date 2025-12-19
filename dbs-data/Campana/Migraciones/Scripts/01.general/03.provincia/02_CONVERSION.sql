USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE dbo.Provincia
GO

INSERT INTO dbo.Provincia
SELECT
	cast(PR.IdProvincia as bigint) id,
	PR.IdProvincia codigo,
	PR.Descripcion,
	ROW_NUMBER() OVER (ORDER BY cast(PR.IdProvincia as bigint)) orden,
	1 id_pais
FROM MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias PR
	--INNER join LARAMIE_CAMPANA.dbo.pais PA on PA.codigo=PR.COD_PAIS
ORDER BY cast(PR.IdProvincia as bigint)
GO
