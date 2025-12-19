--SELECT TOP (1000) NUMERO_CUENTA_COMERCIO
--      ,COD_TIPO_ARRENDAMIENTO
--      ,NUMERO
--      ,BLOQUE
--      ,FECHA_VIGENCIA_DESDE
--      ,FECHA_VIGENCIA_HASTA
--      ,FECHA_BAJA
--      ,SUPERFICIE
--      ,LONGITUD
--      ,COD_TIPO_CONSUMO_ELECTRICO
--      ,CANTIDAD_ARTEFACTOS_ELECTRICOS
--      ,NUMERO_RESOLUCION
--      ,NOMBRE_EMBARCACION
--      ,MATRICULA_EMBARCACION
--      ,COD_TASA_EMBARCACION
--      ,COD_SUB_TASA_EMBARCACION
--      ,ESLORA
--      ,MANGA
--      ,PUNTAL
--      ,PESO_NETO
--      ,PESO_BRUTO
--      ,PESO_LASTRE
--  FROM MAJOR.dbo.ESPACIO_ARRENDADO

USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.espacio_arrendado
GO

INSERT INTO LARAMIE.dbo.espacio_arrendado
SELECT 
	0 id_comercio
		,NUMERO_CUENTA_COMERCIO numero_cuenta_comercio
	,NULL id_tipo_arrendamiento
		,COD_TIPO_ARRENDAMIENTO cod_tipo_arrendamiento
	,ISNULL (NUMERO, '') numero
	,ISNULL (BLOQUE, '') bloque
	,FECHA_VIGENCIA_DESDE fecha_vigencia_desde
	,FECHA_VIGENCIA_HASTA fecha_vigencia_hasta
	,(case when FECHA_BAJA = '2100-12-31 00:00:00.000' then NULL else FECHA_BAJA end) fecha_baja
	,SUPERFICIE superficie
	,LONGITUD longitud
	,NULL id_tipo_consumo_electrico
		,COD_TIPO_CONSUMO_ELECTRICO cod_tipo_consumo_electrico
	,CANTIDAD_ARTEFACTOS_ELECTRICOS cantidad_artefactos_electricos
	,NUMERO_RESOLUCION numero_resolucion 
	,ISNULL (NOMBRE_EMBARCACION, '') nombre_embarcacion
	,ISNULL (MATRICULA_EMBARCACION, '') matricula_embarcacion
	,NULL id_tasa_embarcacion
		,(case when COD_TASA_EMBARCACION = 0 then NULL else COD_TASA_EMBARCACION end) cod_tasa_embarcacion
	,NULL id_sub_tasa_embarcacion
		,(case when COD_SUB_TASA_EMBARCACION = 0 then NULL else COD_SUB_TASA_EMBARCACION end) cod_sub_tasa_embarcacion
	,ESLORA eslora
	,MANGA manga
	,PUNTAL puntal
	,PESO_NETO peso_neto
	,PESO_BRUTO peso_bruto
	,PESO_LASTRE peso_lastre 
FROM MAJOR.dbo.ESPACIO_ARRENDADO
WHERE NOT NUMERO_CUENTA_COMERCIO IS NULL
GO

--Actualizo el id_comercio con los datos reales de comercio
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_comercio=c.id	
FROM
LARAMIE.dbo.espacio_arrendado ea INNER JOIN LARAMIE.dbo.comercio c ON c.numero_cuenta=ea.numero_cuenta_comercio;
GO


--Actualizo el id_tipo_arrendamiento con los datos de tipo_arrendamiento
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_tipo_arrendamiento=ta.id	
FROM
LARAMIE.dbo.espacio_arrendado ea INNER JOIN LARAMIE.dbo.tipo_arrendamiento ta ON ea.COD_TIPO_ARRENDAMIENTO=ta.codigo;
GO

--Actualizo el id_tipo_consumo_electrico con los datos de la lista
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_tipo_consumo_electrico=l.id
FROM 
LARAMIE.dbo.espacio_arrendado ea INNER JOIN LARAMIE.dbo.lista l ON ea.cod_tipo_consumo_electrico=l.codigo
WHERE l.tipo = 'TipoConsumoElectrico';
GO


--Actualizo el id_tasa con los datos reales de tasa
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_tasa_embarcacion=t.id
FROM
LARAMIE.dbo.espacio_arrendado ea INNER JOIN LARAMIE.dbo.tasa t on ea.cod_tasa_embarcacion=t.codigo
GO

--Actualizo el id_sub_tasa con los datos reales de sub_tasa
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_sub_tasa_embarcacion=s.id
FROM
LARAMIE.dbo.espacio_arrendado ea INNER JOIN LARAMIE.dbo.sub_tasa s on ea.cod_sub_tasa_embarcacion=s.codigo
GO

--Actualizo el id_comercio con los datos reales de comercio
DELETE FROM LARAMIE.dbo.espacio_arrendado WHERE id_comercio =0;
GO

--Para corregir los que tenian un  valor inconsistente
UPDATE LARAMIE.dbo.espacio_arrendado
SET id_tipo_arrendamiento=1
WHERE id_tipo_arrendamiento IS NULL
GO
