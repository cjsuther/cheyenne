USE LARAMIE_CAMPANA
GO

CREATE TABLE medio_pago
(
    id bigint NOT NULL,
    id_tipo_persona bigint NOT NULL,
    id_persona bigint NOT NULL,
    id_tipo_medio_pago bigint NOT NULL,
    titular varchar(250) NOT NULL,
    numero varchar(50) NOT NULL,
    alias varchar(50) NOT NULL,
    id_tipo_tarjeta bigint,
    id_marca_tarjeta bigint,
    fecha_vencimiento date,
    cvv varchar(250) NOT NULL,
    id_entidad_bancaria bigint
)
GO
