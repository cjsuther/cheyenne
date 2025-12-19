USE LARAMIE
GO

CREATE TABLE inspeccion
(
	"id" bigint identity,
	id_comercio bigint,
	numero varchar(20),
	id_motivo_inspeccion bigint,
	id_supervisor bigint,
	id_inspector bigint,
	fecha_inicio datetime,
	fecha_finalizacion datetime,
	fecha_notificacion datetime,
	fecha_baja datetime,
	anio_desde varchar(20),
	mes_desde varchar(20),
	anio_hasta varchar(20),
	mes_hasta varchar(20),
	numero_resolucion varchar(20),
	letra_resolucion varchar(20),
	anio_resolucion varchar(20),
	fecha_resolucion datetime,
	numero_legajillo varchar(20),
	letra_legajillo varchar(50),
	anio_legajillo varchar(20),
	activo varchar(20),
	porcentaje_multa real,
	emite_constancia varchar(20),
	paga_porcentaje bit,
	id_expediente bigint,
	detalle_expediente varchar(250)
)
GO
