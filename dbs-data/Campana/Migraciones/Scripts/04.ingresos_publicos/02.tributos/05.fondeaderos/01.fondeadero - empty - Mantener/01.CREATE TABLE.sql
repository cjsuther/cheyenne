USE MAJOR
GO

UPDATE Fondeaderos SET COD_TIPO_CONTROLADOR_ZONA_ENTREGA = NULL WHERE ISNUMERIC(COD_TIPO_CONTROLADOR_ZONA_ENTREGA)=0
ALTER TABLE Fondeaderos ALTER COLUMN COD_TIPO_CONTROLADOR_ZONA_ENTREGA NUMERIC(30,0);
GO
UPDATE Fondeaderos SET ID_CONTROLADOR=NULL where ltrim(rtrim(replace(ID_CONTROLADOR,'0',''))) = '' OR ID_CONTROLADOR='NULL'
GO
ALTER TABLE Fondeaderos ALTER COLUMN COD_TASA numeric(30,0); 
ALTER TABLE Fondeaderos ALTER COLUMN COD_SUBTASA numeric(30,0);
ALTER TABLE Fondeaderos ALTER COLUMN embarcacion varchar(250); 
ALTER TABLE Fondeaderos ALTER COLUMN superficie varchar(50); 
ALTER TABLE Fondeaderos ALTER COLUMN longitud varchar(50); 
ALTER TABLE Fondeaderos ALTER COLUMN codigo varchar(50); 
ALTER TABLE Fondeaderos ALTER COLUMN club varchar(50); 
ALTER TABLE Fondeaderos ALTER COLUMN digito_verificador varchar(50); 
GO

UPDATE Fondeaderos SET embarcacion=SUBSTRING(embarcacion,1,250)
GO

DELETE FROM Fondeaderos where ltrim(rtrim(replace(NUMERO_CUENTA,'0',''))) = '' OR NUMERO_CUENTA='NULL' OR NUMERO_CUENTA IS NULL
GO

USE LARAMIE
GO

CREATE TABLE fondeadero
(
    id bigint identity NOT NULL,
        numero_cuenta varchar(50) NOT NULL,
        cod_tasa varchar(50),
        cod_subtasa varchar(50),
    id_cuenta bigint,
    id_estado_carga bigint NOT NULL,
    fecha_carga_inicio date NOT NULL,
    fecha_carga_fin date,
    id_tasa bigint,
    id_subtasa bigint,
    embarcacion varchar(250) NOT NULL,
    superficie varchar(20) NOT NULL,
    longitud varchar(20) NOT NULL,
    codigo varchar(20) NOT NULL,
    club varchar(20) NOT NULL,
    digito_verificador varchar(20) NOT NULL,
    ubicacion varchar(250) NOT NULL,
    margen varchar(250) NOT NULL,
    fecha_alta date,
    id_tipo_fondeadero bigint NULL
)
GO
