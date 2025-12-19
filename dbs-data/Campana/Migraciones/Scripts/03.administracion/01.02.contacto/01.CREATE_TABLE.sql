USE LARAMIE_CAMPANA
GO

CREATE TABLE contacto(
	id bigint NOT NULL,
	entidad varchar(50) NOT NULL,
	id_entidad bigint NOT NULL,
	id_tipo_contacto bigint NOT NULL,
	detalle varchar(250) NOT NULL
)
GO
