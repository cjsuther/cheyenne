USE LARAMIE_CAMPANA
GO

CREATE TABLE comercio (
	"id" bigint NOT NULL,
	id_cuenta bigint NULL,
	numero_cuenta varchar(50) NOT NULL,
	id_estado_carga bigint NOT NULL,
	fecha_carga_inicio datetime NOT NULL,
	fecha_carga_fin datetime NULL,
	id_cuenta_inmueble bigint NULL,
	nombre_fantasia varchar(250) NOT NULL,
	digito_verificador varchar(20) NOT NULL,
	gran_contribuyente bit NOT NULL,
	numero_cuit varchar(20) NOT NULL,
	id_tipo_ubicacion bigint NOT NULL,
	razon_social varchar(250) NOT NULL
)
GO
