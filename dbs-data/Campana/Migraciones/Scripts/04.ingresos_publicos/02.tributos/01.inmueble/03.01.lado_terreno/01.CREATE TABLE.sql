USE LARAMIE_CAMPANA
GO

CREATE TABLE lado_terreno
(
    id bigint NOT NULL,
    id_inmueble bigint NOT NULL,
    id_tipo_lado bigint NOT NULL,
	numero bigint NOT NULL,
    metros numeric(18,2) NOT NULL,
    reduccion numeric(18,2) NOT NULL,
	direccion varchar(250) NOT NULL
)
GO

ALTER TABLE lado_terreno ADD CONSTRAINT UQ_lado_terreno_codigo UNIQUE (id_inmueble,numero)
GO
