USE LARAMIE_CAMPANA
GO

CREATE TABLE sub_tasa_imputacion
(
    id bigint NOT NULL,
    id_tasa bigint NOT NULL,
    id_sub_tasa bigint NOT NULL,
    ejercicio varchar(20) NOT NULL,
    id_tipo_cuota bigint NOT NULL,
    id_cuenta_contable bigint,
    id_cuenta_contable_anterior bigint,
    id_cuenta_contable_futura bigint,
    id_jurisdiccion_actual bigint,
    id_recurso_por_rubro_actual bigint,
    id_jurisdiccion_anterior bigint,
    id_recurso_por_rubro_anterior bigint,
    id_jurisdiccion_futura bigint,
    id_recurso_por_rubro_futura bigint
)
GO
