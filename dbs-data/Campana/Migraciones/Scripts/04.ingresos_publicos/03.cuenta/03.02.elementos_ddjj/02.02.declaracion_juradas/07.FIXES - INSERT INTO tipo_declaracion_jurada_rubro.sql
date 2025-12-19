TRUNCATE TABLE tipo_declaracion_jurada_rubro;

--SI SE APLICA ESTO, SE RESTRINGE LOS RUBROS QUE APARECEN POR TIPO DDJJ
/*
INSERT INTO tipo_declaracion_jurada_rubro
	SELECT DISTINCT id_tipo_declaracion_jurada, id_rubro
		FROM declaracion_jurada_item WHERE NOT id_rubro IS null;

delete from tipo_declaracion_jurada_rubro
	where id_tipo_declaracion_jurada in (select id from tipo_declaracion_jurada where codigo='TE_2012_2') and id_rubro=107;
*/

INSERT INTO tipo_declaracion_jurada_rubro (id_tipo_declaracion_jurada, id_rubro)
SELECT
    tdj.id AS id_tipo_declaracion_jurada,
    r.id AS id_rubro
FROM (
    VALUES
        ('HABITACIONES', '632101'),
        ('COCHERAS', '714002'),
        ('COCHERAS', '280055'),
        ('CANCHAS_PADDLE', '849007'),
        ('CANCHAS_FUTBOL_TENIS', '280022'),
        ('PUESTOS_FERIA', '280000'),
        ('M2', '849101'),
        ('M2', '849103'),
        ('M2', '849104'),
        ('M2', '849105'),
        ('M2', '853004'),
        ('M2', '853005'),
        ('M2', '910001'),
        ('M2', '910201'),
        ('M2', '910202'),
        ('M2', '910203'),
        ('M2', '910204'),
        ('M2', '910301'),
        ('M2', '910302'),
        ('M2', '910303'),
        ('M2', '910401'),
        ('M2', '910501'),
        ('M2', '910503'),
        ('M2', '911101'),
        ('M2', '911102'),
        ('M2', '911103'),
        ('M2', '911104'),
        ('M2', '910502'),
        ('M2', '720001'),
        ('M2', '720003'),
        ('M2', '720004'),
        ('M2DESCUBIERTOS', '720001'),
        ('M2DESCUBIERTOS', '720003'),
        ('M2DESCUBIERTOS', '720004')
) AS relaciones(codigo_tipo, codigo_rubro)
JOIN tipo_declaracion_jurada tdj ON tdj.codigo = relaciones.codigo_tipo
JOIN rubro r ON r.codigo = relaciones.codigo_rubro
ON CONFLICT DO NOTHING;
