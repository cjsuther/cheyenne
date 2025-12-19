USE LARAMIE
GO

Select
	id,
	anio_certificado,
	numero_certificado,
	id_tipo_certificado,
	id_objeto_certificado,
	id_escribano,
	transferencia,
	id_cuenta,
	vendedor,
	partida,
	direccion,
	id_persona_intermediario,
	id_persona_retiro,
	fecha_entrada,
	fecha_salida,
	fecha_entrega
From LARAMIE.dbo.certificado_escribano
GO
