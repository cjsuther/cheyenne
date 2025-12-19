UPDATE emision_ejecucion_cuenta_cuota
	SET codigo_barras='06126080'||LPAD(numero_recibo::varchar(10),10,'0')||'000001100000000110000251910215'
	WHERE id_emision_ejecucion=3000456;

DELETE FROM codigo_barras_cliente WHERE codigo_barras
	IN (SELECT codigo_barras FROM emision_ejecucion_cuenta_cuota WHERE id_emision_ejecucion=3000456);

INSERT INTO codigo_barras_cliente (id_tipo_codigo_barras,descripcion,codigo_barras,codigo_barras_cliente,codigo_qr_cliente)
	SELECT id_tipo_codigo_barras,descripcion,codigo_barras,codigo_barras_cliente,codigo_qr_cliente
	FROM
	(
		SELECT 
			33 id_tipo_codigo_barras,
			'SOLO PODRÁN ABONARSE POR BOCA EXTERNA, HASTA LA FECHA DEL PRIMER VENCIMIENTO PARA PAGO A TRAVÉS DE E-PAGOS' descripcion,
			codigo_barras,
			'969000023010000000556137820250729'||substring(codigo_barras from 6 for 13) codigo_barras_cliente,
			'iVBORw0KGgoAAAANSUhEUgAAAKQAAACkAQMAAAAjexcCAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABP0lEQVRIie2WURICMQhDuQH3v2VugEnoVv0G/6zO6r6dWYYQaCP+68erqhCoADL7ZofyCvBSqT++36FlhkTVuVmj+ioHLNOMLAfcpHqQlJwsvjSbURXwrq8az6gWc2AK+UHmlO8vOsQmYSq5RWVn+S8R/I0n4piygMyBn5T0daIt0DCkNNQogC0aahMG5EPGqtii3SiuqNRJLFH5w52SzuBWc0o13awLHW2hlqicF8d16sY1Wq5otlsysUSh6UZRZG0+etSZU8neE8NzeYtWGroTlcYedf9pHLsPsUSdQx59Kq9mY+pNJL2XfDTLnGrAU+7sYX936Sk9EdHKAFu0PIvkunLAWKI4B5Z60tmivZn2maIe9+1QTmM1YCHetdig9onmPu5IndPe+NCD+W6xY+rTSqqg1KfeZ4Ip/a8frhe+7tl9B70NzQAAAABJRU5ErkJggg==' codigo_qr_cliente
		FROM emision_ejecucion_cuenta_cuota
		WHERE id_emision_ejecucion=3000456
		UNION
		SELECT 
			34 id_tipo_codigo_barras,
			'PAGO POR CAJA MUNICIPAL O CUCEI O PROVINCIANET' descripcion,
			codigo_barras,
			'67720612608000005837132507100000011000025073'||substring(codigo_barras from 6 for 13) codigo_barras_cliente,
			'' codigo_qr_cliente
		FROM emision_ejecucion_cuenta_cuota
		WHERE id_emision_ejecucion=3000456
	)
	ORDER BY codigo_barras, id_tipo_codigo_barras;

UPDATE emision_aprobacion
	SET id_estado_aprobacion_codigo_barras=351, --aprobado
		id_usuario_aprobacion_codigo_barras=1, --u otro
		fecha_aprobacion_codigo_barras=NOW()
	WHERE id_emision_ejecucion=3000456;