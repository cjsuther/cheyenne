USE LARAMIE_CAMPANA
GO

CREATE TABLE categoria_vehiculo
(
	"id" int not null,
	codigo nvarchar(50) not null,
	nombre nvarchar(250) not null,
	orden int not null,
	id_inciso_vehiculo int null,
	limite_inferior int not null,
	limite_superior int not null,
	codigo_sucerp nvarchar(20) not null
)
GO

ALTER TABLE categoria_vehiculo ADD CONSTRAINT UQ_categoria_vehiculo_codigo UNIQUE (codigo, id_inciso_vehiculo)
GO
