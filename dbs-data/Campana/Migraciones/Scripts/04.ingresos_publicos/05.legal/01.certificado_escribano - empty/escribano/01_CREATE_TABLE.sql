USE LARAMIE
GO
CREATE TABLE escribano
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250),
    orden bigint,
    matricula varchar(250)
)
GO