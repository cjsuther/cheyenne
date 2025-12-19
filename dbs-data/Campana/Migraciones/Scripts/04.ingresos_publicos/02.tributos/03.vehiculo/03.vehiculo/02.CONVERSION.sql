USE LARAMIE_CAMPANA
GO

--TRUNCATE TABLE cuenta
DELETE FROM cuenta WHERE id_tipo_tributo = 12
GO

INSERT INTO cuenta
SELECT
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)+200000) id
	,A.NUMERO_CUENTA
	,A.NUMERO_WEB
	,(case when MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) IS NULL then 2 else 3 end) id_estado_cuenta
	,12 id_tipo_tributo
	,NULL id_tributo
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,NULL id_contribuyente_principal
	,NULL id_direccion_principal
	,NULL id_direccion_entrega
FROM MAJOR_CAMPANA.dbo.VEHICULO A
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


TRUNCATE TABLE vehiculo
GO

INSERT INTO vehiculo
SELECT 
     (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
    ,NULL id_cuenta
    ,NUMERO_CUENTA numero_cuenta
    ,21 id_estado_carga
    ,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_inicio
    ,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_fin
    ,DOMINIO
    ,DOMINIO_ANTERIOR
    ,ANIO_MODELO
    ,ISNULL(NULLIF(MARCA,'NULL'),'') marca
    ,ISNULL(NULLIF(CODIGO_MARCA,'NULL'),'') codigo_marca
    ,ISNULL(NULLIF(MODELO,'NULL'),'') modelo
    ,inc.ID id_inciso_vehiculo
    ,tve.ID id_tipo_vehiculo
    ,cve.ID id_categoria_vehiculo
    ,NRO_MOTOR numero_motor
    ,ISNULL(NULLIF(MARCA_MOTOR,'NULL'),'') marca_motor
    ,NRO_CHASIS numero_chasis
    ,SERIE_MOTOR
    ,CLAVE_LEGAJO legajo
    ,VALUACION
    ,PESO
    ,CARGA
    ,CILINDRADA
    ,fab.ID id_origen_fabricacion
    ,combus.ID id_combustible
    ,uso.ID id_uso_vehiculo
    ,(case when MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) is null then null else baja.ID end) id_motivo_baja_vehiculo
    ,RECUPERO
    ,RADICACION_ANTERIOR
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_ALTA_TRIBUTO) fecha_alta
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_PATENTAMIENTO) fecha_patentamiento
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_RADICACION) fecha_radicacion
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_TRANSFERENCIA) fecha_transferencia
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_COMPRA) fecha_compra
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HABILITACION_DESDE) fecha_habilitacion_desde
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HABILITACION_HASTA) fecha_habilitacion_hasta
    ,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_UI_DDJJ) fecha_ddjj
    ,CODIGO_MTM codigo_mtm
FROM MAJOR_CAMPANA.dbo.VEHICULO A
	left join LARAMIE_CAMPANA.dbo.inciso_vehiculo inc on inc.codigo=A.COD_INCISO_VEHICULO
	left join LARAMIE_CAMPANA.dbo.tipo_vehiculo tve on tve.codigo=A.COD_TIPO_VEHICULO
	left join LARAMIE_CAMPANA.dbo.categoria_vehiculo cve on cve.codigo=A.COD_CATEGORIA_VEHICULO and cve.id_inciso_vehiculo=inc.id
	left join MAJOR_CAMPANA.dbo.LISTA fab on fab.NOMBRE='OrigenFabricacion' and fab.CODIGO=A.COD_ORIGEN_FABRICACION
	left join MAJOR_CAMPANA.dbo.LISTA combus on combus.NOMBRE='Combustible' and combus.CODIGO=A.COD_COMBUSTIBLE
	left join MAJOR_CAMPANA.dbo.LISTA uso on uso.NOMBRE='FinalidadVehiculo' and uso.CODIGO=A.COD_FINALIDAD_VEHICULO
	left join MAJOR_CAMPANA.dbo.LISTA baja on baja.NOMBRE='MotivoBajaVehiculo' and baja.CODIGO=A.COD_MOTIVO_BAJA_VEHICULO
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


--Actualizo el id_cuenta de Vehiculo
UPDATE vehiculo
SET id_cuenta=c.id
FROM
	vehiculo a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 12
GO

--Actualizo el id_tributo de Cuenta
UPDATE cuenta
SET id_tributo=a.id
FROM
	vehiculo a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 12
GO
