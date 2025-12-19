USE LARAMIE_CAMPANA
GO

CREATE TABLE localidad(
	"id" bigint NOT NULL,
	codigo varchar(50) NOT NULL,
	nombre varchar(250) NOT NULL,
	orden int NOT NULL,
	id_provincia bigint NOT NULL
)
GO
