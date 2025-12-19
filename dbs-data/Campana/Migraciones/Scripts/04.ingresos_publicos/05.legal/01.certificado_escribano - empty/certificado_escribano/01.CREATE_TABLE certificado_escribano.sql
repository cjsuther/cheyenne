UPDATE MAJOR.dbo.CertificadoEscribano SET NUMERO_DOCUMENTO_retiro=0 WHERE ISNULL(NUMERO_DOCUMENTO_retiro,'')=''
UPDATE MAJOR.dbo.CertificadoEscribano SET NUMERO_DOCUMENTO_intermediario=0 WHERE ISNULL(NUMERO_DOCUMENTO_intermediario,'')=''
ALTER TABLE MAJOR.dbo.CertificadoEscribano ALTER COLUMN COD_TIPO_DOCUMENTO_intermediario numeric(30,0)
ALTER TABLE MAJOR.dbo.CertificadoEscribano ALTER COLUMN COD_TIPO_DOCUMENTO_retiro numeric(30,0)
GO

USE LARAMIE
GO

CREATE TABLE certificado_escribano
(
	id bigint  identity NOT NULL,
    anio_certificado varchar(20),
    numero_certificado varchar(20),
    id_tipo_certificado bigint,
    id_objeto_certificado bigint NULL,
	id_escribano bigint NULL,
	transferencia varchar(250) NULL,
	id_cuenta bigint NOT NULL,
		numero_cuenta varchar(50) NOT NULL,
	vendedor varchar(250) NULL,
	partida varchar(250) NULL,
	direccion varchar(250) NULL,
	id_persona_intermediario bigint NULL,
		id_tipo_documento_intermediario bigint NOT NULL,
		numero_documento_intermediario varchar(20) NOT NULL,
	id_persona_retiro bigint NULL,
		id_tipo_documento_retiro bigint NOT NULL,
		numero_documento_retiro varchar(20) NOT NULL,
	fecha_entrada date NULL,
    fecha_salida date NULL,
    fecha_entrega date NULL
)
GO
