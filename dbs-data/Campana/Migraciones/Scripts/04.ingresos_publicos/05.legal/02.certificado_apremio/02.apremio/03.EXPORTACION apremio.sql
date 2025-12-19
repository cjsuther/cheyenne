USE LARAMIE_CAMPANA
GO

SELECT
	id,
    numero,
    id_expediente,
    id_organismo_judicial,
    fecha_inicio_demanda, --luego se actualiza con los actos procesales
    carpeta,
    caratula,
    estado, --luego se actualiza con los actos procesales
    detalle_expediente
FROM apremio
GO
