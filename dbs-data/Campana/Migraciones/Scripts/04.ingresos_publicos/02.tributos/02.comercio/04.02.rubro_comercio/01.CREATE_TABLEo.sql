USE LARAMIE_CAMPANA
GO

CREATE TABLE rubro_comercio
(
	"id" bigint NOT NULL,
	id_comercio bigint NOT NULL,
	id_rubro bigint NOT NULL,
	id_ubicacion_comercio bigint NOT NULL,
	id_rubro_liquidacion bigint NOT NULL,
	id_rubro_provincia bigint NOT NULL,
	id_rubro_bcra bigint NOT NULL,
	descripcion varchar(250) NOT NULL,
	es_de_oficio bit NOT NULL,
	es_rubro_principal bit NOT NULL,
	es_con_ddjj bit NOT NULL,
	fecha_inicio datetime NULL,
	fecha_cese datetime NULL,
	fecha_alta_transitoria datetime NULL,
	fecha_baja_transitoria datetime NULL,
	fecha_baja datetime NULL,
	id_motivo_baja_rubro_comercio bigint NULL
)
GO
