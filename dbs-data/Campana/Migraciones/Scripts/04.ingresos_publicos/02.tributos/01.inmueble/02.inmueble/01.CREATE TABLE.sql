USE LARAMIE_CAMPANA
GO

CREATE TABLE inmueble
(
    id bigint NOT NULL,
    id_cuenta bigint,
	numero_cuenta varchar(50) NOT NULL,
    id_estado_carga bigint NOT NULL,
    fecha_carga_inicio date NOT NULL,
    fecha_carga_fin date,
    catastral_cir varchar(20) NOT NULL,
    catastral_sec varchar(20) NOT NULL,
    catastral_codigo varchar(20) NOT NULL,
    catastral_frac varchar(20) NOT NULL,
    catastral_lfrac varchar(20) NOT NULL,
    catastral_manz varchar(20) NOT NULL,
    catastral_lmanz varchar(20) NOT NULL,
    catastral_parc varchar(20) NOT NULL,
    catastral_lparc varchar(20) NOT NULL,
    catastral_ufunc varchar(20) NOT NULL,
    catastral_ucomp varchar(20) NOT NULL,
    catastral_rtas_prv varchar(20) NOT NULL,
    tributo_manz varchar(20) NOT NULL,
    tributo_lote varchar(20) NOT NULL,
    tributo_esquina bit NOT NULL,
    catastral_chacra varchar(20) NOT NULL,
    catastral_lchacra varchar(20) NOT NULL,
    catastral_quinta varchar(20) NOT NULL,
    catastral_lquinta varchar(20) NOT NULL,
    catastral_subparc varchar(20) NOT NULL,
    id_firma_digital_certificado_deuda bigint,
    id_estado_firma_certificado_deuda bigint,
    id_firma_digital_certificado_catastral bigint,
    id_estado_firma_certificado_catastral bigint,
    catastral_partido varchar(20) NOT NULL
)
GO
