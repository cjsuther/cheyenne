USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_tipo_controlador
      ,numero
      ,es_supervisor
      ,fecha_alta
      ,fecha_baja
      ,catastral_cir
      ,catastral_sec
      ,catastral_chacra
      ,catastral_lchacra
      ,catastral_quinta
      ,catastral_lquinta
      ,catastral_frac
      ,catastral_lfrac
      ,catastral_manz
      ,catastral_lmanz
      ,catastral_parc
      ,catastral_lparc
      ,catastral_subparc
      ,catastral_ufunc
      ,catastral_ucomp
      ,id_persona
      ,legajo
      ,id_ordenamiento
      ,id_controlador_supervisor
      ,clasificacion
      ,fecha_ultima_intimacion
      ,cantidad_intimaciones_emitidas
      ,cantidad_intimaciones_anuales
      ,porcentaje
      ,catastral_codigo
      ,catastral_partido
FROM controlador
ORDER BY id
GO

