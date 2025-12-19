USE LARAMIE_CAMPANA
GO


CREATE TABLE declaracion_jurada
(
	id bigint NOT NULL,
	id_tipo_tributo bigint NOT NULL,
	id_cuenta bigint NOT NULL,
	id_modelo_declaracion_jurada bigint NOT NULL,
	fecha_presentacion_declaracion_jurada datetime NOT NULL,
	anio_declaracion varchar(20) NOT NULL,
	mes_declaracion int NOT NULL,
	numero varchar(20) NOT NULL,
	id_origen_declaracion_jurada bigint NOT NULL,
	fecha_alta datetime NOT NULL,
	fecha_baja datetime NULL,
	resolucion varchar(50) NOT NULL
)
GO

CREATE TABLE declaracion_jurada_item
(
    id bigint NOT NULL,
    id_cuenta bigint NOT NULL,
	id_rubro bigint NULL,
	id_declaracion_jurada bigint NOT NULL,
	id_clase_declaracion_jurada bigint NOT NULL,
	id_tipo_declaracion_jurada bigint NOT NULL,
	valor numeric(18,2) NOT NULL
)
GO