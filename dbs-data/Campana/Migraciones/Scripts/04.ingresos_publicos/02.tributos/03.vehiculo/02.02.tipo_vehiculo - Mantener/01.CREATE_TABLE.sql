USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_vehiculo
(
    "id" bigint NOT NULL,
    codigo NVARCHAR(50),
    nombre NVARCHAR(250),
    orden integer NOT NULL,
    id_inciso_vehiculo bigint NOT NULL
)
GO

ALTER TABLE tipo_vehiculo ADD CONSTRAINT UQ_tipo_vehiculo_codigo UNIQUE (codigo)
GO
