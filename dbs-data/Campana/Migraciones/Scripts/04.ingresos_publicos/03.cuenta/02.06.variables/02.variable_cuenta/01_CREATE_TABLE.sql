USE LARAMIE_CAMPANA
GO

CREATE TABLE variable_cuenta
(
	"id" bigint NOT NULL,	
	id_variable bigint NOT NULL,
	id_cuenta bigint NOT NULL,
	valor varchar(250),
	fecha_desde datetime NULL,
	fecha_hasta datetime NULL
)
GO
