USE LARAMIE_CAMPANA
GO

SELECT 
	id,
	id_cuenta,
	id_estado_carga,
	fecha_carga_inicio,
	fecha_carga_fin,
	id_tipo_construccion_funeraria,
	circunscripcion_cementerio,
	seccion_cementerio,
	manzana_cementerio,
	parcela_cementerio,
	frente_cementerio,
	fila_cementerio,
	numero_cementerio,
	fecha_alta,
	fecha_baja,
	fecha_presentacion,
	digito_verificador,
	fecha_concesion,
	fecha_escritura,
	fecha_sucesion,
	libro_escritura,
	folio_escritura,
	numero_sucesion,
	superficie,
	largo,
	ancho,
	id_cementerio_institucion,
	id_tipo_prestador,
	codigo_cementerio
FROM cementerio
ORDER BY id
GO