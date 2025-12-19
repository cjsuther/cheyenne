USE LARAMIE_CAMPANA
GO

--en postgresql se deberian borrar previamente los registros de direcciones con id_tipo_tributo = 13
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
FROM cuenta
WHERE id_tipo_tributo=13
ORDER BY id
