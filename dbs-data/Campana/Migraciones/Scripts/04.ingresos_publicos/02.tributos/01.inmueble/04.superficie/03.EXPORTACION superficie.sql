USE LARAMIE_CAMPANA
GO

SELECT  id
      ,id_inmueble
      ,nro_superficie
      ,nro_interno
      ,nro_declaracion_jurada
      ,id_tipo_superficie
      ,plano
      ,id_grupo_superficie
      ,id_tipo_obra_superficie
      ,id_destino_superficie
      ,fecha_intimacion
      ,nro_intimacion
      ,nro_anterior
      ,fecha_presentacion
      ,fecha_vigente_desde
      ,fecha_registrado
      ,fecha_permiso_provisorio
      ,fecha_aprobacion
      ,conforme_obra
      ,fecha_fin_obra
      ,ratificacion
      ,derechos
      ,metros
FROM superficie
ORDER BY id
GO

