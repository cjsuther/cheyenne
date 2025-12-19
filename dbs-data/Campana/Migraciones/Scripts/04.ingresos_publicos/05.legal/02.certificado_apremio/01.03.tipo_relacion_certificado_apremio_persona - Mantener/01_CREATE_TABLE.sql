USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_relacion_certificado_apremio_persona
(
    id bigint NOT NULL,
    codigo character varying(20) NOT NULL,
    descripcion character varying(250) NOT NULL,
    id_tipo_controlador bigint
)
GO

ALTER TABLE tipo_relacion_certificado_apremio_persona ADD CONSTRAINT UQ_tipo_relacion_certificado_apremio_persona_codigo UNIQUE (codigo)
GO
