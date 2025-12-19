USE LARAMIE
GO

CREATE TABLE espacio_arrendado
(
    id bigint identity NOT NULL,
    id_comercio bigint NOT NULL,
    id_tipo_arrendamiento bigint NULL,
    numero varchar(20) NOT NULL,
    bloque varchar(20) NOT NULL,
    fecha_vigencia_desde date NOT NULL,
    fecha_vigencia_hasta date,
    fecha_baja date,
    superficie numeric(18,2) NOT NULL,
    longitud numeric(18,2) NOT NULL,
    id_tipo_consumo_electrico bigint NULL,
    cantidad_artefactos_electricos integer NOT NULL,
    numero_resolucion varchar(20) NOT NULL,
    nombre_embarcacion varchar(250) NOT NULL,
    matricula_embarcacion varchar(20) NOT NULL,
    id_tasa_embarcacion bigint,
    id_sub_tasa_embarcacion bigint,
    eslora numeric(18,2) NOT NULL,
    manga numeric(18,2) NOT NULL,
    puntal numeric(18,2) NOT NULL,
    peso_neto numeric(18,2) NOT NULL,
    peso_bruto numeric(18,2) NOT NULL,
    peso_lastre numeric(18,2) NOT NULL
)

