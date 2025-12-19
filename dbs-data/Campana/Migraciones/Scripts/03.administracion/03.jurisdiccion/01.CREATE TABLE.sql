USE LARAMIE_CAMPANA
GO

CREATE TABLE jurisdiccion
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    ejercicio varchar(20) NOT NULL,
    agrupamiento varchar(250) NOT NULL,
    fecha_baja date,
    nivel integer NOT NULL,
    tipo varchar(250) NOT NULL,
    ejercicio_oficina varchar(20) NOT NULL,
    oficina varchar(50) NOT NULL
)
GO
