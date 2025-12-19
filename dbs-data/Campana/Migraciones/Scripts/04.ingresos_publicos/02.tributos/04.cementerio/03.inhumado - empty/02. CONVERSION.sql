USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.inhumado
GO

INSERT INTO LARAMIE.dbo.inhumado
SELECT
		i.NUMERO_CUENTA numero_cuenta
	  ,0 id_cementerio
      ,(case
		when i.cod_tipo_documento=1 then 510
		when i.cod_tipo_documento=2 then 511
		when i.cod_tipo_documento=3 then 512
		when i.cod_tipo_documento=4 then 513
		when i.cod_tipo_documento=5 then 514
		when i.cod_tipo_documento=6 then 515
		when i.cod_tipo_documento=7 then 516
		when i.cod_tipo_documento=9 then 517
		when i.cod_tipo_documento=20 then 518
		else 517 end) id_tipo_documento
      ,ISNULL (i.numero_documento, '') numero_documento
	  ,ISNULL (i.apellido_inhumado, '') apellido
      ,ISNULL (i.nombre_inhumado, '') nombre
	  ,(case
		when i.fecha_nacimiento='1900-01-01 00:00:00.000' then NULL
		when i.fecha_nacimiento='2100-01-01 00:00:00.000' then NULL
		else i.fecha_nacimiento end) fecha_nacimiento
	  ,(case
		when i.cod_genero='M' then 560
		when i.cod_genero='F' then 561
		else 562 end) id_genero	  
	  ,(case
		when i.cod_estado_civil=1 then 570
		when i.cod_estado_civil=2 then 571
		when i.cod_estado_civil=3 then 572
		when i.cod_estado_civil=4 then 573
		when i.cod_estado_civil=5 then 574
		when i.cod_estado_civil=6 then 575
		else NULL end) id_estado_civil
      ,CASE WHEN i.cod_nacionalidad IN (0,9999) THEN NULL ELSE Cast(i.cod_nacionalidad as bigint) END id_nacionalidad
	  ,(case
		when i.fecha_defuncion='1900-01-01 00:00:00.000' then NULL
		when i.fecha_defuncion='2100-01-01 00:00:00.000' then NULL
		else i.fecha_defuncion end) fecha_defuncion
	  ,(case
		when i.fecha_ingreso='1900-01-01 00:00:00.000' then NULL
		when i.fecha_ingreso='2100-01-01 00:00:00.000' then NULL
		else i.fecha_ingreso end) fecha_ingreso
	  ,(case
		when i.cod_motivo_fallecimiento=1 then 1170
		when i.cod_motivo_fallecimiento=2 then 1171
		when i.cod_motivo_fallecimiento=9999 then 1172
		else 1172 end) id_motivo_fallecimiento
      ,ISNULL (i.numero_defuncion, '') numero_defuncion
      ,ISNULL (i.libro, '') libro
      ,ISNULL (i.folio, '') folio
      ,RC.id id_registro_civil
	  ,ISNULL (i.acta, '') acta
	  ,(case
		when i.cod_tipo_origen_inhumacion=6 then 1180
		when i.cod_tipo_origen_inhumacion=7 then 1181
		when i.cod_tipo_origen_inhumacion=8 then 1182
		when i.cod_tipo_origen_inhumacion=99 then 1183
		else NULL end) id_tipo_origen_inhumacion
      ,ISNULL (observaciones_origen, '') observaciones_origen
      ,NULL id_tipo_condicion_especial
	  ,(case
		when i.fecha_egreso='1900-01-01 00:00:00.000' then NULL
		when i.fecha_egreso='2100-01-01 00:00:00.000' then NULL
		else i.fecha_egreso end) fecha_egreso
	  ,(case
		when i.fecha_traslado='1900-01-01 00:00:00.000' then NULL
		when i.fecha_traslado='2100-01-01 00:00:00.000' then NULL
		else i.fecha_traslado end) fecha_traslado
	  ,(case
		when i.cod_tipo_destino_inhumacion=6 then 1200
		when i.cod_tipo_destino_inhumacion=7 then 1201
		when i.cod_tipo_destino_inhumacion=8 then 1202
		when i.cod_tipo_destino_inhumacion=99 then 1203
		else NULL end) id_tipo_destino_inhumacion
      ,ISNULL (i.observaciones_destino, '') observaciones_destino
	  ,(case
		when i.fecha_exhumacion='1900-01-01 00:00:00.000' then NULL
		when i.fecha_exhumacion='2100-01-01 00:00:00.000' then NULL
		else i.fecha_exhumacion end) fecha_exhumacion
	  ,(case
		when i.fecha_reduccion='1900-01-01 00:00:00.000' then NULL
		when i.fecha_reduccion='2100-01-01 00:00:00.000' then NULL
		else i.fecha_reduccion end) fecha_reduccion
      ,ISNULL (i.numero_reduccion, '') numero_reduccion
      ,ISNULL (i.unidad, '') unidad
      ,NULL id_tipo_documento_responsable
      ,ISNULL (i.numero_documento_responsable, '') numero_documento_responsable
	  ,ISNULL (i.apellido_responsable, '') apellido_responsable  
      ,ISNULL (i.nombre_responsable, '') nombre_responsable  
	  ,(case when i.fecha_hora_inicio_velatorio = 'N/A' then NULL else i.fecha_hora_inicio_velatorio end) fecha_hora_inicio_velatorio
	  ,(case when i.fecha_hora_fin_velatorio = 'N/A' then NULL else i.fecha_hora_inicio_velatorio end) fecha_hora_fin_velatorio
      ,NULL id_comercio_cocheria
      ,ISNULL (i.cuit_cocheria, '') numero_cuit_cocheria
	  ,ISNULL (i.DIRECCION_velatorio, '') direccion
FROM MAJOR.dbo.INHUMADOS i
left join LARAMIE.dbo.registro_civil RC on RC.nombre=i.registro_civil
WHERE not NUMERO_CUENTA IS NULL
ORDER BY
	NUMERO_CUENTA, numero_documento
GO

--Actualizo el id_cementerio con los datos reales de cementerio
UPDATE LARAMIE.dbo.inhumado
SET id_cementerio=c.id
FROM
LARAMIE.dbo.inhumado i INNER JOIN LARAMIE.dbo.cementerio c on i.numero_cuenta=c.numero_cuenta
GO
