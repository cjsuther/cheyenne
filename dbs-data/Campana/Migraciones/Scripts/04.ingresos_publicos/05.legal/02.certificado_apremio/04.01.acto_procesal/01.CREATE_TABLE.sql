USE LARAMIE_CAMPANA
GO

CREATE TABLE acto_procesal
(
	id bigint NOT NULL,
    id_apremio bigint NOT NULL,
    id_tipo_acto_procesal bigint NOT NULL,
    fecha_desde datetime NULL,
    fecha_hasta datetime NULL,
    observacion varchar(1000) NOT NULL
)
GO
