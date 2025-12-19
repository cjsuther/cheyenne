USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_recargo_descuento
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    tipo integer NOT NULL,
    id_tipo_tributo bigint NULL,
    porcentaje numeric(18,2) NOT NULL,
    importe numeric(18,2) NOT NULL,
    emite_solicitud bit NOT NULL,
    requiere_otrogamiento bit NOT NULL,
    fecha_desde date NULL,
    fecha_hasta date NULL,
    procedimiento varchar(250) NOT NULL
)
GO

ALTER TABLE tipo_recargo_descuento ADD CONSTRAINT UQ_tipo_recargo_descuento_codigo UNIQUE (codigo)
GO
