USE LARAMIE
GO

TRUNCATE TABLE inspeccion
GO

INSERT INTO inspeccion
SELECT
	0 id_comercio,
	NUMERO_CUENTA numero_cuenta,
	numero numero,
	Case When COD_MOTIVO_INSPECCION = 1 then 1190
		When COD_MOTIVO_INSPECCION = 2 then 1191
		When COD_MOTIVO_INSPECCION = 3 then 1192
		When COD_MOTIVO_INSPECCION = 4 then 1193
		When COD_MOTIVO_INSPECCION = 5 then 1194
		When COD_MOTIVO_INSPECCION = 6 then 1195
	end id_motivo_inspeccion,
	500 id_supervisor,
	500 id_inspector,
	Case When Charindex('1900', fecha_inicio) <> 0 then null
		When Charindex('2100', fecha_inicio) <> 0 then null
		else fecha_inicio
	end fecha_inicio,
	Case When Charindex('1900', fecha_finalizacion) <> 0 then null
		When Charindex('2100', fecha_finalizacion) <> 0 then null
		else fecha_finalizacion
	end fecha_finalizacion,
	Case When Charindex('1900', fecha_notificacion) <> 0 then null
		When Charindex('2100', fecha_notificacion) <> 0 then null
		else fecha_notificacion
	end fecha_notificacion,
	Case When Charindex('1900', fecha_baja) <> 0 then null
		When Charindex('2100', fecha_baja) <> 0 then null
		else fecha_baja
	end fecha_baja,
	Case When Charindex('1900', anio_desde) <> 0 then ''
		When Charindex('1901', anio_desde) <> 0 then ''
		When anio_desde = '0' then ''
		else anio_desde
	end anio_desde,
	Case When mes_desde = '0' then ''
		else mes_desde
	end mes_desde,
	Case When Charindex('2100', anio_hasta) <> 0 then ''
		When anio_hasta = '0' OR anio_hasta is null then ''
		else anio_hasta
	end anio_hasta,
	Case When mes_hasta = '0' OR mes_hasta is null then ''
		else mes_hasta
	end mes_hasta,
	Case When numero_resolucion = '0' OR numero_resolucion is null then ''
		else numero_resolucion
	end numero_resolucion,
	'' letra_resolucion,
	Case When anio_resolucion = '0' OR anio_resolucion is null then ''
		else anio_resolucion
	end anio_resolucion,
	Case When Charindex('1900', fecha_resolucion) <> 0 then null
		When Charindex('2100', fecha_resolucion) <> 0 then null
		else fecha_resolucion
	end fecha_resolucion,
	'' numero_legajillo,
	isnull(letra_legajillo,'') letra_legajillo,
	'' anio_legajillo,
	'' activo,
	0 porcentaje_multa,
	isnull(emite_constancia,'') emite_constancia,
	Case When paga_porcentaje = 'N' then 0 
		else 1
	end paga_porcentaje,
	0 id_expediente,
	EXPEDIENTE detalle_expediente
FROM MAJOR.dbo.INSPECCION_COMERCIO
ORDER BY NUMERO_CUENTA, numero
GO

--Actualizo el id_comercio con los datos reales de comercio
UPDATE LARAMIE.dbo.inspeccion
SET id_comercio=c.id
FROM
LARAMIE.dbo.inspeccion i INNER JOIN LARAMIE.dbo.comercio c on c.NUMERO_CUENTA=i.NUMERO_CUENTA
GO