USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.fondeadero
GO

INSERT INTO LARAMIE.dbo.fondeadero
SELECT 
	   NUMERO_CUENTA numero_cuenta
      ,COD_TASA cod_tasa
      ,COD_SUBTASA cod_subtasa
    ,NULL id_cuenta
    ,21 id_estado_carga
	,(case when FECHA_ALTA = '1900-01-01 00:00:00.000' then GETDATE() else FECHA_ALTA end) fecha_carga_inicio
	,(case when FECHA_BAJA = '2100-01-01 00:00:00.000' then NULL else FECHA_BAJA end) fecha_carga_fin
    ,0 id_tasa
    ,0 id_subtasa
	,ISNULL (embarcacion, '') embarcacion
	,ISNULL (superficie, '') superficie
	,ISNULL (longitud, '') longitud
	,ISNULL (codigo, '') codigo
	,ISNULL (club, '') club
	,ISNULL (digito_verificador, '') digito_verificador
	,ISNULL (ubicacion, '') ubicacion
	,ISNULL (SUBSTRING(margen, 0, 250), '') margen
	,(case when FECHA_ALTA_SERVICIO = '1900-01-01 00:00:00.000' then NULL else FECHA_ALTA_SERVICIO end) fecha_alta
	,NULL id_tipo_fondeadero
FROM MAJOR.dbo.Fondeaderos
WHERE not NUMERO_CUENTA IS NULL
GO

--TRUNCATE TABLE LARAMIE.dbo.cuenta
DELETE FROM LARAMIE.dbo.cuenta WHERE id >= 600000 and ID < 700000
GO
DBCC CHECKIDENT ('cuenta', RESEED, 600000);
GO
INSERT INTO LARAMIE.dbo.cuenta
SELECT
	  (case when NUMERO_CUENTA IS NULL then '' else NUMERO_CUENTA end) numero_cuenta
	 ,(case when NUMERO_WEB IS NULL then '' else NUMERO_WEB end) numero_web
	 ,(case when FECHA_BAJA = '2100-01-01 00:00:00.000' or FECHA_BAJA='NULL' then 2 else 3 end) id_estado_cuenta
	 ,14 id_tipo_tributo
	 ,NULL id_tributo
	 ,(case when FECHA_ALTA = '1900-01-01 00:00:00.000' or FECHA_ALTA='NULL' then GETDATE() else FECHA_ALTA end) fecha_alta
	 ,(case when FECHA_BAJA = '2100-01-01 00:00:00.000' or FECHA_BAJA='NULL' then NULL else FECHA_BAJA end) fecha_baja
	 ,NULL id_contribuyente_principal
	 ,NULL id_direccion_principal
	 ,NULL id_direccion_entrega
FROM MAJOR.dbo.Fondeaderos
GO
DBCC CHECKIDENT ('cuenta', RESEED, 700000);
GO

--Actualizo el id_cuenta con los datos reales de cuenta
UPDATE LARAMIE.dbo.fondeadero
SET id_cuenta=c.id
FROM
LARAMIE.dbo.fondeadero f INNER JOIN LARAMIE.dbo.cuenta c on f.numero_cuenta=c.numero_cuenta
WHERE c.id_tipo_tributo = 14
GO

--Actualizo el id_tributo de Cuenta
UPDATE LARAMIE.dbo.cuenta
SET id_tributo=f.id
FROM
LARAMIE.dbo.fondeadero f INNER JOIN LARAMIE.dbo.cuenta c on f.numero_cuenta=c.numero_cuenta
WHERE c.id_tipo_tributo = 14
GO

--Actualizo el id_tasa con los datos reales de tasa
UPDATE LARAMIE.dbo.fondeadero
SET id_tasa=t.id
FROM
LARAMIE.dbo.fondeadero f INNER JOIN LARAMIE.dbo.tasa t on f.COD_TASA=t.codigo
GO

--Actualizo el id_subtasa con los datos reales de subtasa
UPDATE LARAMIE.dbo.fondeadero
SET id_subtasa=st.id
FROM
LARAMIE.dbo.fondeadero f INNER JOIN LARAMIE.dbo.sub_tasa st on f.COD_TASA=st.cod_tasa AND f.COD_SUBTASA=st.codigo
GO

--Actualizo el id_tipo_fondeadero
update fondeadero set id_tipo_fondeadero=150; --Fijos individuales
update fondeadero set id_tipo_fondeadero=151 where id_subtasa in (select id from sub_tasa where codigo='2'); --Fijos colectivos
update fondeadero set id_tipo_fondeadero=152 where id_subtasa in (select id from sub_tasa where codigo='3'); --Accidentales
update fondeadero set id_tipo_fondeadero=153 where id_subtasa in (select id from sub_tasa where codigo='4'); --Estacionamiento
GO
