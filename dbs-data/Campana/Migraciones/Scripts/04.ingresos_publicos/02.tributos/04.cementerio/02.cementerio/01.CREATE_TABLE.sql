USE LARAMIE_CAMPANA
GO

CREATE TABLE cementerio
(
	"id" bigint  NOT NULL,
	id_cuenta bigint NULL,
	numero_cuenta varchar(50) NOT NULL,
	id_estado_carga bigint NOT NULL,
	fecha_carga_inicio datetime NULL,
	fecha_carga_fin datetime NULL,
	id_tipo_construccion_funeraria bigint NULL,
	circunscripcion_cementerio varchar(20) NOT NULL,
	seccion_cementerio varchar(20) NOT NULL,
	codigo_cementerio varchar(20) NOT NULL,
	manzana_cementerio varchar(20) NOT NULL,
	parcela_cementerio varchar(20) NOT NULL,
	frente_cementerio varchar(20) NOT NULL,
	fila_cementerio varchar(20) NOT NULL,
	numero_cementerio varchar(20) NOT NULL,	
	fecha_alta datetime NULL,
	fecha_baja datetime NULL,
	fecha_presentacion datetime NULL,
	digito_verificador varchar(20) NOT NULL,
	fecha_concesion datetime NULL,
	fecha_escritura datetime NULL,
	fecha_sucesion datetime NULL,
	libro_escritura varchar(20) NOT NULL,
	folio_escritura varchar(20) NOT NULL,
	numero_sucesion varchar(20) NOT NULL,
	superficie numeric(18,2) NOT NULL,
	largo numeric(18,2) NOT NULL,
	ancho numeric(18,2) NOT NULL,
	id_cementerio_institucion bigint NOT NULL,
	id_tipo_prestador bigint NOT NULL
)
GO
