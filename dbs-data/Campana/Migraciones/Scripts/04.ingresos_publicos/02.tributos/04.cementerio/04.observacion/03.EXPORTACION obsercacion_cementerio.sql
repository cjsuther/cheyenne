USE LARAMIE_CAMPANA
GO

SELECT
	id,
	entidad,
	id_entidad,
	detalle,
	id_usuario,
	fecha
FROM observacion_cementerio
ORDER BY id
GO

--del archivo resultante se debe reemplazar el caracter "\" por "-"
