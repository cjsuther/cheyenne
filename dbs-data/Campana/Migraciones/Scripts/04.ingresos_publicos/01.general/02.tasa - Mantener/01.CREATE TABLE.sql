USE LARAMIE_CAMPANA
GO

CREATE TABLE tasa
(
    id bigint NOT NULL,
    codigo varchar(20) NOT NULL,
    id_tipo_tributo bigint NULL,
    id_categoria_tasa bigint NOT NULL,
    descripcion varchar(250) NOT NULL,
    porcentaje_descuento numeric(18,2) NOT NULL,
)
GO

ALTER TABLE tasa ADD CONSTRAINT UQ_tasa_codigo UNIQUE (codigo)
GO
