USE LARAMIE_CAMPANA
GO

CREATE TABLE vinculo_cuenta
(
    id bigint NOT NULL,
    id_tipo_tributo bigint NOT NULL,
    id_tributo bigint NOT NULL,
    id_tipo_vinculo bigint NOT NULL,
    id_persona bigint NOT NULL,
    id_tipo_instrumento bigint NULL,
    fecha_instrumento_desde datetime NULL,
    fecha_instrumento_hasta datetime NULL,
    porcentaje_condominio numeric(18,2) NOT NULL,
	es_contribuyente bit NOT NULL,
	es_contribuyente_principal bit NOT NULL
)
GO
