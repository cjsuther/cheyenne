USE LARAMIE
GO

CREATE TABLE multa
(
	"id" bigint identity,
	id_cuenta bigint,
	id_tipo_multa bigint,
	id_unidad_valor bigint,
	valor numeric(18,2),
	periodo varchar(20),
	mes int,
	fecha datetime,
	id_tasa bigint,
	id_sub_tasa bigint,
	id_cuenta_pago bigint
)
GO
