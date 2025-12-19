USE LARAMIE_CAMPANA
GO

SELECT 
	 id
	,id_cuenta
	,id_estado_carga
	,fecha_carga_inicio
	,fecha_carga_fin
	,catastral_cir
	,catastral_sec
	,catastral_frac
	,catastral_lfrac
	,catastral_manz
	,catastral_lmanz
	,catastral_parc
	,catastral_lparc
	,catastral_ufunc
	,catastral_ucomp
	,catastral_rtas_prv
	,tributo_manz
	,tributo_lote
	,tributo_esquina
	,catastral_chacra
	,catastral_lchacra
	,catastral_quinta
	,catastral_lquinta
	,catastral_subparc
	,catastral_codigo
	,null id_firma_digital_certificado_deuda
	,null id_estado_firma_certificado_deuda
	,null id_firma_digital_certificado_catastral
	,null id_estado_firma_certificado_catastral
	,catastral_partido
FROM inmueble
ORDER BY id