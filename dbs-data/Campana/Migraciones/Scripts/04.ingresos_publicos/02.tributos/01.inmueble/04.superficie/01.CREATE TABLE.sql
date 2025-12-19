USE LARAMIE_CAMPANA
GO

CREATE TABLE superficie
(
    id bigint NOT NULL,
    id_inmueble bigint NOT NULL,
    nro_superficie varchar(50) NOT NULL,
    nro_interno varchar(50) NOT NULL,
    nro_declaracion_jurada varchar(50) NOT NULL,
    id_tipo_superficie integer NOT NULL,
    plano varchar(50) NOT NULL,
    id_grupo_superficie bigint NULL,
    id_tipo_obra_superficie bigint NULL,
    id_destino_superficie bigint NULL,
    fecha_intimacion date NULL,
    nro_intimacion varchar(50) NOT NULL,
    nro_anterior varchar(50) NOT NULL,
    fecha_presentacion date NULL,
    fecha_vigente_desde date NULL,
    fecha_registrado date NULL,
    fecha_permiso_provisorio date NULL,
    fecha_aprobacion date NULL,
    conforme_obra bit NOT NULL,
    fecha_fin_obra date NULL,
    ratificacion varchar(50) NOT NULL,
    derechos varchar(50) NOT NULL,
    metros numeric(18,2) NOT NULL
)
GO
