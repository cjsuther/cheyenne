USE LARAMIE_CAMPANA
GO

CREATE TABLE apremio
(
    id bigint NOT NULL,
    numero varchar(20)NOT NULL,
    id_expediente bigint NULL,
    id_organismo_judicial bigint NULL,
    fecha_inicio_demanda datetime NULL,
    carpeta varchar(250) NOT NULL,
    caratula varchar(250)NOT NULL,
    estado varchar(250)NOT NULL,
    detalle_expediente varchar(250) NOT NULL
)
GO
