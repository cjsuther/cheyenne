USE LARAMIE_CAMPANA
GO

CREATE TABLE clase_elemento
(
    id bigint NOT NULL,
        cod_tasa varchar(50),
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    id_tipo_tributo bigint,
    ejecucion_periodica bit NOT NULL
)
GO

CREATE TABLE tipo_elemento
(
    id bigint NOT NULL,
		cod_tasa varchar(50),
		cod_subtasa varchar(50),
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    id_clase_elemento bigint NOT NULL,
    id_unidad_medida bigint NOT NULL,
    valor numeric(18,2) NOT NULL
)
GO

CREATE TABLE elemento
(
    id bigint NOT NULL,
	id_tipo_tributo bigint NOT NULL,
	id_cuenta bigint NOT NULL,
	id_rubro bigint NULL,
    	cod_tasa varchar(50),
	    cod_subtasa varchar(50),
	numero integer,
	mes integer,
	periodo varchar(20),
	id_origen_declaracion_jurada bigint NOT NULL,
    id_clase_elemento bigint NOT NULL,
    id_tipo_elemento bigint NOT NULL,
    cantidad numeric(18,2) NOT NULL,
    fecha_alta date NOT NULL,
    fecha_baja date,
	resolucion varchar(50),
    activo bit NOT NULL
)
GO
