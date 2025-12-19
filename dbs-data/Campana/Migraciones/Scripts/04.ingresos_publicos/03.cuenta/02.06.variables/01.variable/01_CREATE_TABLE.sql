USE LARAMIE_CAMPANA
GO

CREATE TABLE variable
(
	"id" bigint,
	codigo varchar(50),
	descripcion varchar(200),
	id_tipo_tributo bigint,
	tipo_dato varchar(50),
	constante bit,
	predefinido bit,
	opcional bit,
	activo bit,
	global bit,
	lista varchar(50)
)
GO
