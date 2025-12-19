USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE contacto
GO

INSERT INTO contacto
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_PERSONA,A.ID_PERSONA,A.COD_TIPO_CONTACTO,A.DESCRIPCION)) id,
	'PersonaFisica' entidad,
	per.ID id_entidad,
	tco.ID id_tipo_contacto,
	A.DESCRIPCION detalle
FROM
	MAJOR_CAMPANA.dbo.PERSONA_CONTACTOS A
	left join LARAMIE_CAMPANA.dbo.persona_unificado per on per.tipo_persona=A.COD_TIPO_PERSONA and per.numero_documento=A.ID_PERSONA
	left join MAJOR_CAMPANA.dbo.LISTA tco on tco.NOMBRE='TipoContacto' and tco.CODIGO=A.COD_TIPO_CONTACTO
ORDER BY id
GO
