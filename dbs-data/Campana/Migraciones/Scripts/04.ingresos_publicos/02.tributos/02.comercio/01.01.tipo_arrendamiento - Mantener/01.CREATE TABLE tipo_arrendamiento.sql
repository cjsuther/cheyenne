USE LARAMIE
GO

CREATE TABLE tipo_arrendamiento
(
    id bigint NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(250) NOT NULL,
    orden integer NOT NULL,
    id_tasa_inicial_renovacion bigint,
    id_sub_tasa_inicial_renovacion bigint,
    id_tasa_transferencia bigint,
    id_sub_tasa_transferencia bigint,
    id_tasa_mensual bigint,
    id_sub_tasa_mensual bigint,
    id_tasa_expensas bigint,
    id_sub_tasa_expensas bigint,
    id_sub_tasa_varios bigint,
    es_embarcacion bit NOT NULL
)
GO
