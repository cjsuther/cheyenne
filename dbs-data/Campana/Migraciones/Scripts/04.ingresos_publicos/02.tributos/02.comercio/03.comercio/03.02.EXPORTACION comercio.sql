USE LARAMIE_CAMPANA
GO

SELECT 
	"id",
	id_cuenta,
	id_estado_carga,
	fecha_carga_inicio,
	fecha_carga_fin,
	id_cuenta_inmueble,
	nombre_fantasia,
	digito_verificador,
	gran_contribuyente,
	numero_cuit,
	id_tipo_ubicacion,
	razon_social
FROM comercio
ORDER BY id
GO
