USE LARAMIE_CAMPANA
GO

CREATE TABLE recargo_descuento
(
    id bigint NOT NULL,
    id_cuenta bigint NOT NULL,
	id_tipo_recargo_descuento bigint NOT NULL,
    id_tasa bigint NOT NULL,
    id_sub_tasa bigint NOT NULL,
    id_rubro bigint NULL,
    fecha_desde date NOT NULL,
    fecha_hasta date NULL,
    fecha_otorgamiento date NULL,
    numero_solicitud varchar(50),
    porcentaje numeric(18,2) NOT NULL,
    importe numeric(18,2) NOT NULL,
    id_persona bigint NULL,
    numero_ddjj varchar(50) NOT NULL,
    letra_ddjj varchar(50) NOT NULL,
    ejercicio_ddjj varchar(50) NOT NULL,
    numero_decreto varchar(50) NOT NULL,
    letra_decreto varchar(50) NOT NULL,
    ejercicio_decreto varchar(50) NOT NULL,
    id_expediente bigint NULL,
    detalle_expediente varchar(250) NOT NULL
)
GO
