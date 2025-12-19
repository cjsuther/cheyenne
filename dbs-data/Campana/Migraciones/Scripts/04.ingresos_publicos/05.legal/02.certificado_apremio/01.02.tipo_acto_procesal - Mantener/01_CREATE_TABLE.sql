USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_acto_procesal
(
	id bigint NOT NULL,
    id_tipo_acto_procesal bigint NULL,
    codigo_acto_procesal varchar(20) NOT NULL,
    descripcion varchar(250) NOT NULL,
    plazo_dias integer NOT NULL,
    porcentaje_honorarios numeric(18,2) NOT NULL,
    fecha_baja datetime NULL,
    nivel integer NOT NULL,
    orden integer NOT NULL
)
GO

ALTER TABLE tipo_acto_procesal ADD CONSTRAINT UQ_tipo_acto_procesal_codigo UNIQUE (codigo_acto_procesal)
GO
