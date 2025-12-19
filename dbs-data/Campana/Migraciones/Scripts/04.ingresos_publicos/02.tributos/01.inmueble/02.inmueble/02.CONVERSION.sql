USE LARAMIE_CAMPANA
GO

--TRUNCATE TABLE cuenta
DELETE FROM cuenta WHERE id_tipo_tributo = 10
GO

INSERT INTO cuenta
SELECT
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
	,A.NUMERO_CUENTA
	,A.NUMERO_WEB
	,(case when MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) IS NULL then 2 else 3 end) id_estado_cuenta
	,10 id_tipo_tributo
	,NULL id_tributo
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,NULL id_contribuyente_principal
	,NULL id_direccion_principal
	,NULL id_direccion_entrega
FROM MAJOR_CAMPANA.dbo.Inmueble A
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


TRUNCATE TABLE inmueble
GO

INSERT INTO inmueble
SELECT 
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
	,NULL id_cuenta
	,NUMERO_CUENTA numero_cuenta
	,21 id_estado_carga
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_inicio
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_fin
	,CATASTRAL_CIR
	,CATASTRAL_SEC
	,CATASTRAL_CODIGO
	,CATASTRAL_FRAC
	,CATASTRAL_LFRAC
	,CATASTRAL_MANZ
	,CATASTRAL_LMANZ
	,CATASTRAL_PARC
	,CATASTRAL_LPARC
	,CATASTRAL_UFUNC
	,CATASTRAL_UCOMP
	,CATASTRAL_RTAS_PRV
	,MANZANA tributo_manz
	,LOTE tributo_lote
	,(CASE WHEN ES_ESQUINA = 'S' THEN 1 ELSE 0 END) TRIBUTO_ESQUINA
	,CATASTRAL_CHACRA
	,CATASTRAL_LCHACRA
	,CATASTRAL_QUINTA
	,CATASTRAL_LQUINTA
	,CATASTRAL_SUBPARC
    ,NULL id_firma_digital_certificado_deuda
    ,NULL id_estado_firma_certificado_deuda
    ,NULL id_firma_digital_certificado_catastral
    ,NULL id_estado_firma_certificado_catastral
    ,CATASTRAL_PARTIDO
FROM MAJOR_CAMPANA.dbo.Inmueble A	
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


--Actualizo el id_cuenta de Inmueble
UPDATE inmueble
SET id_cuenta=c.id
FROM
inmueble a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 10
GO

--Actualizo el id_tributo de Cuenta
UPDATE cuenta
SET id_tributo=a.id
FROM
inmueble a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 10
GO
