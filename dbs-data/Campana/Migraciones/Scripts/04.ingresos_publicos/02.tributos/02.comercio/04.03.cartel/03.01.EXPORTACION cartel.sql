USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_comercio
      ,numero
      ,id_tipo_anuncio
      ,id_tipo_cartel
      ,id_tipo_propiedad
      ,id_origen_declaracion_jurada
      ,id_categoria_ubicacion
      ,anuncio
      ,marquesina
      ,cantidad_publicidades
      ,fecha_inicio
      ,fecha_resolucion
      ,numero_ddjj
      ,fecha_ddjj
      ,anio_ddjj
      ,mes_ddjj
      ,catastral_cir
      ,catastral_sec
      ,catastral_cod
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
      ,id_cuenta_inmueble
      ,id_tasa
      ,id_sub_tasa
      ,alto
      ,ancho
      ,id_motivo_baja_comercio
      ,fecha_baja
      ,id_bloqueo_emision
      ,id_tipo_producto_publicitado
      ,superficie
FROM cartel
ORDER BY id
GO
