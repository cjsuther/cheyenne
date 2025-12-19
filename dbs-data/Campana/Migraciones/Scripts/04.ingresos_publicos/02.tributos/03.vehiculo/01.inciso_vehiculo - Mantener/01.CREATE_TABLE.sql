USE LARAMIE_CAMPANA
GO

CREATE TABLE inciso_vehiculo
(
	"id" bigint not null,
	codigo nvarchar(10) not null,
	nombre nvarchar(250) not null,
	orden int not null,
	vehiculo_menor bit not null,
	codigo_sucerp nvarchar(50) not null
)
GO

ALTER TABLE inciso_vehiculo ADD CONSTRAINT UQ_inciso_vehiculo_codigo UNIQUE (codigo)
GO
