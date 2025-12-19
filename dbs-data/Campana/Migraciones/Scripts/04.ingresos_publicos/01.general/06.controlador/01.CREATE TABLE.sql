USE LARAMIE_CAMPANA
GO

CREATE TABLE controlador
(
    id bigint NOT NULL,
    id_tipo_controlador bigint NOT NULL,
    numero varchar(20)  NOT NULL,
    es_supervisor bit NOT NULL,
    fecha_alta date NOT NULL,
    fecha_baja date,
    catastral_cir varchar(20)  NOT NULL,
    catastral_sec varchar(20)  NOT NULL,
    catastral_codigo varchar(20) NOT NULL,
    catastral_partido varchar(20) NOT NULL,
    catastral_chacra varchar(20)  NOT NULL,
    catastral_lchacra varchar(20)  NOT NULL,
    catastral_quinta varchar(20)  NOT NULL,
    catastral_lquinta varchar(20)  NOT NULL,
    catastral_frac varchar(20)  NOT NULL,
    catastral_lfrac varchar(20)  NOT NULL,
    catastral_manz varchar(20)  NOT NULL,
    catastral_lmanz varchar(20)  NOT NULL,
    catastral_parc varchar(20)  NOT NULL,
    catastral_lparc varchar(20)  NOT NULL,
    catastral_subparc varchar(20)  NOT NULL,
    catastral_ufunc varchar(20)  NOT NULL,
    catastral_ucomp varchar(20)  NOT NULL,
    id_persona bigint NOT NULL,
    legajo varchar(50)  NOT NULL,
    id_ordenamiento bigint NOT NULL,
    id_controlador_supervisor bigint,
    clasificacion varchar(20)  NOT NULL,
    fecha_ultima_intimacion date,
    cantidad_intimaciones_emitidas numeric(18,2) NOT NULL,
    cantidad_intimaciones_anuales numeric(18,2) NOT NULL,
    porcentaje numeric(18,2) NOT NULL
)
GO

ALTER TABLE controlador ADD  CONSTRAINT [UQ_id_tipo_controlador_numero] UNIQUE NONCLUSTERED 
(
	[id_tipo_controlador] ASC,
	[numero] ASC
)
GO
