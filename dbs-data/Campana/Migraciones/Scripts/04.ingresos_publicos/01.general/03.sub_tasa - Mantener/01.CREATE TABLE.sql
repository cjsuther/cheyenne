USE LARAMIE_CAMPANA
GO

CREATE TABLE sub_tasa
(
    id bigint NOT NULL,
    id_tasa bigint NOT NULL,
    codigo varchar(20) NOT NULL,
    descripcion varchar(250) NOT NULL,
    impuesto_nacional numeric(18,2) NOT NULL,
    impuesto_provincial numeric(18,2) NOT NULL,
    ctas_ctes numeric(18,2) NOT NULL,
    timbrados_extras numeric(18,2) NOT NULL,
    descripcion_reducida varchar(250) NOT NULL,
    fecha_desde date,
    fecha_hasta date,
    rubro_generico bit NOT NULL,
    liquidable_cta_cte bit NOT NULL,
    liquidable_ddjj bit NOT NULL,
    actualizacion bit NOT NULL,
    accesorios bit NOT NULL,
    internet_ddjj bit NOT NULL,
    imput_x_porc bit NOT NULL,
)
GO

ALTER TABLE sub_tasa ADD CONSTRAINT UQ_sub_tasa_codigo UNIQUE (codigo,id_tasa)
GO