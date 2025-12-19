USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE dbo.localidad
GO

INSERT INTO dbo.localidad
SELECT
	ROW_NUMBER() OVER (ORDER BY cast(LC.IdLocalidad as int)) id,
	LC.IdLocalidad codigo,
	LC.Descripcion,
	ROW_NUMBER() OVER (ORDER BY cast(LC.IdLocalidad as int)) orden,
	PR.id id_provincia
FROM MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado LC
	INNER join LARAMIE_CAMPANA.dbo.provincia PR on PR.codigo=LC.IdProvincia
ORDER BY cast(LC.IdLocalidad as int)
GO
