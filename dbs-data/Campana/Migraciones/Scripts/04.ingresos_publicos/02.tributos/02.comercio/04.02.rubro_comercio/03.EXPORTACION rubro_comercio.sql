USE LARAMIE_CAMPANA
GO

SELECT 
	   id
      ,id_comercio
      ,id_rubro
      ,id_ubicacion_comercio
      ,id_rubro_liquidacion
      ,id_rubro_provincia
      ,id_rubro_bcra
      ,descripcion
      ,es_de_oficio
      ,es_rubro_principal
      ,es_con_ddjj
      ,fecha_inicio
      ,fecha_cese
      ,fecha_alta_transitoria
      ,fecha_baja_transitoria
      ,fecha_baja
      ,id_motivo_baja_rubro_comercio
  FROM rubro_comercio
  ORDER BY id
  GO
