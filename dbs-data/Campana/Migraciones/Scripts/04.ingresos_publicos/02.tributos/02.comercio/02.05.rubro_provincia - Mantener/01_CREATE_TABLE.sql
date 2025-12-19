USE LARAMIE_CAMPANA
GO

CREATE TABLE rubro_provincia(
	"id" bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL
)
GO

ALTER TABLE rubro_provincia ADD CONSTRAINT UQ_rubro_provincia_codigo UNIQUE (codigo)
GO
