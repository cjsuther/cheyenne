USE LARAMIE
GO

SELECT id
      ,id_comercio
      ,numero
      ,id_motivo_inspeccion
      ,id_supervisor
      ,id_inspector
      ,fecha_inicio
      ,fecha_finalizacion
      ,fecha_notificacion
      ,fecha_baja
      ,case when anio_desde = 0 then '' else anio_desde end anio_desde
	  ,case when mes_desde = 0 then '' else mes_desde end mes_desde
	  ,case when anio_hasta = 0 then '' else anio_hasta end anio_hasta
	  ,case when mes_hasta = 0 then '' else mes_hasta end mes_hasta
	  ,case when numero_resolucion = 0 then '' else numero_resolucion end numero_resolucion
      ,letra_resolucion
	  ,case when anio_resolucion = 0 then '' else anio_resolucion end anio_resolucion
      ,fecha_resolucion
      ,numero_legajillo
      ,letra_legajillo
      ,anio_legajillo
      ,activo
      ,porcentaje_multa
      ,emite_constancia
      ,paga_porcentaje
      ,id_expediente
      ,detalle_expediente
  FROM LARAMIE.dbo.inspeccion
  ORDER BY id
  GO
