USE LARAMIE_CAMPANA
GO

CREATE TABLE rubro_bcra(
	"id" bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL
)
GO

ALTER TABLE rubro_bcra ADD CONSTRAINT UQ_rubro_bcra_codigo UNIQUE (codigo)
GO
