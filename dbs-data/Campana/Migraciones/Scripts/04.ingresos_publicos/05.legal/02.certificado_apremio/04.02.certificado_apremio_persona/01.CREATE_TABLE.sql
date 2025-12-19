USE LARAMIE_CAMPANA
GO

CREATE TABLE certificado_apremio_persona
(
	id bigint NOT NULL,
    id_certificado_apremio bigint NOT NULL,
    id_tipo_relacion_certificado_apremio_persona bigint NOT NULL,
    fecha_desde datetime NULL,
    fecha_hasta datetime NULL,
    id_persona bigint NOT NULL
)
GO
