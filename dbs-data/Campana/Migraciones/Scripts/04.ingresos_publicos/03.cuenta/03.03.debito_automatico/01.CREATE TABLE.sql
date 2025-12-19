USE LARAMIE_CAMPANA
GO

CREATE TABLE debito_automatico
(
    id bigint NOT NULL,
    id_cuenta bigint NOT NULL,
    id_tasa bigint NOT NULL,
    id_sub_tasa bigint NOT NULL,
    id_rubro bigint,
    id_tipo_solicitud_debito_automatico bigint,
    numero_solicitud_debito_automatico varchar(50) NOT NULL,
    id_medio_pago bigint NOT NULL,
    detalle_medio_pago varchar(250) NOT NULL,
    fecha_desde datetime NOT NULL,
    fecha_alta datetime NOT NULL,
    fecha_baja datetime,
    id_entidad_recaudadora bigint
)
GO
