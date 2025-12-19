USE LARAMIE
GO

CREATE TABLE lado_terreno_obra
(
    id bigint identity NOT NULL,
    id_lado_terreno bigint NOT NULL,
    id_obra bigint NOT NULL,
    importe numeric(18,2) NOT NULL,
    reduccion_metros numeric(18,2) NOT NULL,
    reduccion_superficie numeric(18,2) NOT NULL,
    fecha date NOT NULL
)
GO
