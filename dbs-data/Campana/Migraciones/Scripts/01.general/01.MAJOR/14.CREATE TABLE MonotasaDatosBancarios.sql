USE MAJOR_CAMPANA_COMPLEMENTO;
GO

IF OBJECT_ID('dbo.MonotasaDatosBancarios','U') IS NOT NULL
    DROP TABLE dbo.MonotasaDatosBancarios;
GO

CREATE TABLE dbo.MonotasaDatosBancarios
(
    numero_cuenta     varchar(20)  NOT NULL,  -- Legajo + Sublegajo(2)
    cuitContribuyente varchar(20)  NOT NULL,  -- CUIT limpio (11 dígitos típicamente)
    codigo_banco      varchar(10)  NOT NULL,  -- Bancos.Codigo (ej. '00340')
    cbu               varchar(22)  NOT NULL,  -- CBU concatenado (22 dígitos)
    fecha_alta        datetime2(3) NOT NULL
);
GO