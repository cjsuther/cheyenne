USE LARAMIE_CAMPANA
GO

CREATE TABLE rubro (
	"id" bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL,
	agrupamiento varchar(250) NOT NULL,
	fecha_baja DATETIME NULL,
	facturable bit NOT NULL,
	generico bit NOT NULL,
	categoria varchar(250) NOT NULL,
	importe_minimo numeric(18,2) NOT NULL,
	alicuota numeric(18,2) NOT NULL,
	regimen_general bit NOT NULL,
	id_tipo_minimo_aplicable bigint NOT NULL
)
GO

ALTER TABLE rubro ADD CONSTRAINT UQ_rubro_codigo UNIQUE (codigo)
GO
