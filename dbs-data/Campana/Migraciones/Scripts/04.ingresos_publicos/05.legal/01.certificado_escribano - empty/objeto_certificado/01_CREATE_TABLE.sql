USE LARAMIE
GO
CREATE TABLE objeto_certificado
(
    id bigint identity NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(50),
    orden bigint,
    actualiza_propietario bit
)
GO