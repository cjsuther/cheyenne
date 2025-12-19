USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.certificado_escribano
GO

INSERT INTO LARAMIE.dbo.certificado_escribano
SELECT
	ANIO_CERTIFICADO anio_certificado,
	NUMERO_CERTIFICADO numero_certificado,
	Case When cod_tipo_certificado = 'S' then 1290
		When cod_tipo_certificado = 'U' then 1291
		When cod_tipo_certificado = 'P' then 1292
		else 1290
	end id_tipo_certificado, --1240 en else para registros vacios

	Convert(bigint, cod_objeto_certificado) id_objeto_certificado, --la otra tabla esta creada con el id de enlace
	Convert(bigint, ID_ESCRIBANO) id_escribano, --la otra tabla esta creada con el id de enlace

	Case when transferencia is null then '' else transferencia end transferencia,
	0 id_cuenta,
		NUMERO_CUENTA numero_cuenta,
	Case When VENDEDOR is null then '' else VENDEDOR end vendedor, --Esto esta mal pasado el dato, tiene nombre y apellido en mismo campo y varias veces pegados sin espacios
	'' partida,
	'' direccion,

	null id_persona_intermediaria,
		COD_TIPO_DOCUMENTO_intermediario id_tipo_documento_intermediario,
		NUMERO_DOCUMENTO_intermediario numero_documento_intermediario,
	null id_persona_retiro,
		COD_TIPO_DOCUMENTO_retiro id_tipo_documento_retiro,
		NUMERO_DOCUMENTO_retiro numero_documento_retiro,

	Case When CHARINDEX('1900', fecha_entrada) != 0 then null
		When CHARINDEX('2100', fecha_entrada) != 0 then null
		else fecha_entrada
	end fecha_entrada,
	Case When CHARINDEX('1900', fecha_salida) != 0 then null
		When CHARINDEX('2100', fecha_salida) != 0 then null
		else fecha_salida
	end fecha_salida,
	Case When CHARINDEX('1900', fecha_entrega) != 0 then null
		When CHARINDEX('2100', fecha_entrega) != 0 then null
		else fecha_entrega
	end fecha_entrega
FROM MAJOR.dbo.CertificadoEscribano
GO

--Actualizo el id_cuenta con los datos reales de cuenta
UPDATE LARAMIE.dbo.certificado_escribano
SET id_cuenta = c.id
FROM
LARAMIE.dbo.certificado_escribano f INNER JOIN LARAMIE.dbo.cuenta c on f.numero_cuenta=c.numero_cuenta
WHERE c.id_tipo_tributo = 10
GO

--Actualizo el id_persona_intermediaria con los datos reales de persona (Solo donde se puede)
UPDATE LARAMIE.dbo.certificado_escribano
SET id_persona_intermediario = p.id
FROM
LARAMIE.dbo.certificado_escribano f INNER JOIN LARAMIE.dbo.persona p
on f.numero_documento_intermediario= p.numero_documento and f.id_tipo_documento_intermediario=p.id_tipo_documento
WHERE f.numero_documento_intermediario <> '0'
GO

--Actualizo el id_persona_retiro con los datos reales de persona (Solo donde se puede)
UPDATE LARAMIE.dbo.certificado_escribano
SET id_persona_retiro = p.id
FROM
LARAMIE.dbo.certificado_escribano f INNER JOIN LARAMIE.dbo.persona p
on f.numero_documento_retiro= p.numero_documento and f.id_tipo_documento_retiro=p.id_tipo_documento
WHERE f.numero_documento_retiro <> '0'
GO

USE LARAMIE
GO
DELETE FROM [dbo].certificado_escribano
WHERE id_escribano = 0 OR id_escribano IS NULL
GO

USE LARAMIE
GO
DELETE FROM [dbo].certificado_escribano
WHERE id_cuenta = 0 OR id_cuenta IS NULL
GO
