USE LARAMIE_CAMPANA
GO

--TRUNCATE TABLE cuenta
DELETE FROM cuenta WHERE id_tipo_tributo = 13
GO

INSERT INTO cuenta
SELECT
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)+600000) id
	,A.NUMERO_CUENTA
	,A.NUMERO_WEB
	,(case when MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) IS NULL then 2 else 3 end) id_estado_cuenta
	,13 id_tipo_tributo
	,NULL id_tributo
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,NULL id_contribuyente_principal
	,NULL id_direccion_principal
	,NULL id_direccion_entrega
FROM MAJOR_CAMPANA.dbo.CEMENTERIO A
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


TRUNCATE TABLE cementerio
GO

INSERT INTO cementerio
SELECT 
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
	,NULL id_cuenta
	,NUMERO_CUENTA numero_cuenta
	,21 id_estado_carga
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_inicio
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_fin
	,tcf.ID id_tipo_construccion_funeraria
	,CIRCUNSCRIPCION circunscripcion_cementerio
	,SECCION seccion_cementerio
	,A.CODIGO codigo_cementerio
	,MANZANA manzana_cementerio
	,PARCELA parcela_cementerio
	,FRENTE frente_cementerio
	,FILA fila_cementerio
	,NUMERO numero_cementerio	
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_ALTA) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_PRESENTACION) fecha_presentacion
	,DIGITO_VERIFICADOR digito_verificador
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_CONCESION) fecha_concesion
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_ESCRITURA) fecha_escritura
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_SUCESION) fecha_sucesion
	,LIBRO_ESCRITURA
	,FOLIO_ESCRITURA
	,NUMERO_SUCESION
	,SUPERFICIE
	,LARGO
	,ANCHO
	,cem.ID id_cementerio_institucion
	,380 id_tipo_prestador --380: Arrendatarios
FROM MAJOR_CAMPANA.dbo.CEMENTERIO A
	left join LARAMIE_CAMPANA.dbo.tipo_construccion_funeraria tcf on tcf.codigo=A.COD_TIPO_CONSTRUCCION_FUNERARIA
	left join MAJOR_CAMPANA.dbo.LISTA cem on cem.NOMBRE='Cementerio' and cem.CODIGO=A.COD_CEMENTERIO_INSTITUCION
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


--Actualizo el id_cuenta de Vehiculo
UPDATE cementerio
SET id_cuenta=c.id
FROM
	cementerio a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 13
GO

--Actualizo el id_tributo de Cuenta
UPDATE cuenta
SET id_tributo=a.id
FROM
	cementerio a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 13
GO
