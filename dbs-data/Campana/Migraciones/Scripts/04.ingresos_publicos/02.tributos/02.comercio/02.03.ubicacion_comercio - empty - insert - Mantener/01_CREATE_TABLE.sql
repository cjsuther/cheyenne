USE LARAMIE_CAMPANA
GO

CREATE TABLE ubicacion_comercio(
	"id" bigint primary key NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL,
	coeficiente real NOT NULL
);
GO
