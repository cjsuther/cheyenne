USE LARAMIE_CAMPANA
GO

CREATE TABLE rubro_liquidacion(
	"id" bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL,
	numera bit NOT NULL,
	numero int NOT NULL,
	reliquida bit NOT NULL
)
GO

ALTER TABLE rubro_liquidacion ADD CONSTRAINT UQ_rubro_liquidacion_codigo UNIQUE (codigo)
GO
