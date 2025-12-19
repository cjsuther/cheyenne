USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.objeto_certificado
GO

Insert Into dbo.objeto_certificado
Select
	Convert(varchar, cod_objeto_certificado) codigo,
	nombre nombre,
	ROW_NUMBER() OVER (ORDER BY cod_objeto_certificado) orden,
	Case When actualiza_propietario = 'S' then 1
		else 0
	end actualiza_propietario
From MAJOR.dbo.ObjetoCertificado
GO
