USE LARAMIE_CAMPANA
GO

CREATE TABLE persona_unificado
(
	"id" int not NULL,
	tipo_persona int not NULL,
	id_tipo_documento bigint not NULL,
	numero_documento varchar(250) not NULL,
	id_nacionalidad bigint NULL,
	nombre varchar(250) not NULL,
	apellido varchar(250) not NULL,
    id_genero bigint NULL,
	id_estado_civil bigint NULL,
	id_nivel_estudio int NULL,
	profesion varchar(250) not NULL,
	matricula varchar(50) not NULL,
	fecha_nacimiento datetime NULL,
	fecha_defuncion datetime NULL,
	discapacidad int not NULL,
	id_condicion_fiscal bigint NULL,
	id_ingresos_brutos bigint NULL,
	ganancias int not NULL,
	pin varchar(20) not NULL,
	foto text not NULL,
	denominacion varchar(250) not NULL,
	nombre_fantasia varchar(250) not NULL,
	id_forma_juridica bigint NULL,
	id_jurisdiccion bigint NULL,
	fecha_constitucion datetime NULL,
	mes_cierre int not NULL,
	logo text not NULL,
	domicilio varchar(250)
)
GO