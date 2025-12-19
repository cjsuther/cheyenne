--CUENTA
SELECT 
	   id
      ,numero_cuenta
      ,numero_web
      ,id_estado_cuenta
      ,id_tipo_tributo
      ,id_tributo
      ,fecha_alta
      ,fecha_baja
      ,id_contribuyente_principal
      ,id_direccion_principal
      ,id_direccion_entrega
FROM LARAMIE.dbo.cuenta
WHERE id_tipo_tributo=14
ORDER BY id
GO

--FONDEADERO
SELECT
	 id
	,id_cuenta
	,id_estado_carga
	,fecha_carga_inicio
	,fecha_carga_fin
	,id_tasa
	,id_subtasa
	,embarcacion
	,superficie
	,longitud
	,codigo
	,club
	,digito_verificador
	,ubicacion
	,margen
	,fecha_alta
	,id_tipo_fondeadero
FROM LARAMIE.dbo.fondeadero
ORDER BY id
GO
