USE LARAMIE_CAMPANA
GO

SELECT 
    id,
    id_tipo_persona,
    id_persona,
    id_tipo_medio_pago,
    titular,
    numero,
    alias,
    id_tipo_tarjeta,
    id_marca_tarjeta,
    fecha_vencimiento,
    cvv,
    id_entidad_bancaria
FROM medio_pago
ORDER BY id

GO
