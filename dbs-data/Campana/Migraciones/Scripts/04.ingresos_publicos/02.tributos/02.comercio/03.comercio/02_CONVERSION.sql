USE LARAMIE_CAMPANA
GO

--TRUNCATE TABLE cuenta
DELETE FROM cuenta WHERE id_tipo_tributo = 11
GO

INSERT INTO cuenta
SELECT
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)+500000) id
	,A.NUMERO_CUENTA
	,A.NUMERO_WEB
	,(case when MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) IS NULL then 2 else 3 end) id_estado_cuenta
	,11 id_tipo_tributo
	,NULL id_tributo
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,NULL id_contribuyente_principal
	,NULL id_direccion_principal
	,NULL id_direccion_entrega
FROM MAJOR_CAMPANA.dbo.COMERCIO A
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


TRUNCATE TABLE comercio
GO

INSERT INTO comercio
SELECT 
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
	,NULL id_cuenta
	,A.NUMERO_CUENTA numero_cuenta
	,21 id_estado_carga
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_inicio
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_carga_fin
	,i.ID id_cuenta_inmueble
	,'' nombre_fantasia
	,0 digito_verificador
	,0 gran_contribuyente
	,'' numero_cuit
	,1 id_tipo_ubicacion --1: General
	,'' razon_social
FROM MAJOR_CAMPANA.dbo.COMERCIO A
	left join LARAMIE_CAMPANA.dbo.inmueble i on i.numero_cuenta=A.NUMERO_CUENTA_INMUEBLE_RELACIONADO
WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0
ORDER BY NUMERO_CUENTA
GO


--Actualizo el id_cuenta de Comercio
UPDATE comercio
SET id_cuenta=c.id
FROM
comercio a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 11
GO

--Actualizo el id_tributo de Cuenta
UPDATE cuenta
SET id_tributo=a.id
FROM
comercio a INNER JOIN cuenta c on a.NUMERO_CUENTA=c.NUMERO_CUENTA
WHERE c.id_tipo_tributo = 11
GO
