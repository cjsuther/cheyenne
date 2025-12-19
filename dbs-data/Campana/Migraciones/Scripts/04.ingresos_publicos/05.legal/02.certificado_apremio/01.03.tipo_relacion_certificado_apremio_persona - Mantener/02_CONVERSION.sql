USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_relacion_certificado_apremio_persona
GO

INSERT INTO tipo_relacion_certificado_apremio_persona
SELECT
	cast(COD_TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA as bigint) id,
	COD_TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA codigo,
	DESCRIPCION,
	tco.ID id_tipo_controlador
FROM MAJOR_CAMPANA.dbo.TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA
	left join LARAMIE_CAMPANA.dbo.tipo_controlador tco on tco.codigo=COD_TIPO_CONTROLADOR
ORDER BY id
GO
