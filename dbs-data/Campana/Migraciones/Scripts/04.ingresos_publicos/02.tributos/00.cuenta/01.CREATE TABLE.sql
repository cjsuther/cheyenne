USE LARAMIE_CAMPANA
GO

CREATE TABLE cuenta
(
    id bigint NOT NULL,
    numero_cuenta varchar(50) NOT NULL,
    numero_web varchar(50) NOT NULL,
    id_estado_cuenta bigint NOT NULL,
    id_tipo_tributo bigint NOT NULL,
    id_tributo bigint,
    fecha_alta date NOT NULL,
    fecha_baja date,
    id_contribuyente_principal bigint,
    id_direccion_principal bigint,
    id_direccion_entrega bigint
)
GO
