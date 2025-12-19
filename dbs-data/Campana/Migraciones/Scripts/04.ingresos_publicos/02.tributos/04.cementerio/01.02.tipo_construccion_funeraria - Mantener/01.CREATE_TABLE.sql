USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_construccion_funeraria(
	id bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL,
	con_vencimiento bit NOT NULL,
	plazo_max_concesion int NOT NULL,
	termino_concesion1 int NOT NULL,
	termino_concesion2 int NOT NULL,
	plazo_max_renovacion int NOT NULL,
	termino_renovacion1 int NOT NULL,
	termino_renovacion2 int NOT NULL,
	tiene_ubicacion bit NOT NULL,
	tiene_superficie bit NOT NULL
)
GO

ALTER TABLE tipo_construccion_funeraria ADD CONSTRAINT UQ_tipo_construccion_funeraria_codigo UNIQUE (codigo)
GO
