USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_anuncio
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    porcentaje numeric(18,2) NOT NULL,
    importe numeric(18,2) NOT NULL
)
GO

ALTER TABLE tipo_anuncio ADD CONSTRAINT UQ_tipo_anuncio_codigo UNIQUE (codigo)
GO
