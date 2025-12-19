USE LARAMIE_CAMPANA
GO

CREATE TABLE recurso_por_rubro
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    presupuesto varchar(250) NOT NULL,
    agrupamiento varchar(250) NOT NULL,
    procedencia varchar(250) NOT NULL,
    caracter_economico varchar(250) NOT NULL,
    nivel integer NOT NULL,
    fecha_baja date,
    detalle varchar(1000) NOT NULL,
    ejercicio varchar(20) NOT NULL,
)
GO
