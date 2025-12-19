USE LARAMIE_CAMPANA
GO

CREATE TABLE lista_administracion(
	"id" bigint primary key NOT NULL,
	codigo varchar(50) NOT NULL,
	tipo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL
);