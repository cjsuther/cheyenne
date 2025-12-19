TRUNCATE TABLE tipo_movimiento;

INSERT INTO tipo_movimiento
VALUES
	(1,'1','Emisión',1,true,true,true,0,'D','O'),
	(2,'2','Cancelación por recaudación',2,false,true,false,0,'H','C'),
	(3,'3','Débito',3,true,false,true,0,'D','O'),
	(4,'4','Crédito',4,true,false,true,0,'H','O'),
	(5,'5','Accesorios',5,true,true,true,0,'D','O'),
	(6,'6','Débito por liquidación',6,true,true,true,0,'D','O'),
	(7,'7','Crédito por liquidación',7,true,true,true,0,'H','O'),
	(8,'8','Débito por ajuste',8,true,true,true,0,'D','O'),
	(9,'9','Crédito por ajuste',9,true,true,true,0,'H','O'),
	(10,'10','Débito por asignación',10,true,true,false,0,'D','C'),
	(11,'11','Crédito por asignación',11,true,true,false,0,'H','C'),
	(12,'12','Sellados',12,true,true,true,0,'D','O'),
	(13,'13','Plan de pago',13,false,true,false,0,'F','O'),
	(14,'14','Cancelado por convenio',14,false,false,true,0,'H','F'),
	(15,'15','Bonificado por convenio',15,false,true,true,0,'H','E'),
	(16,'16','Accesorio generado por convenio',16,true,true,true,0,'D','O'),
	(17,'17','Recargo por convenio',17,true,true,true,0,'D','O'),
	(18,'18','Deuda origen convenio',18,true,true,true,0,'D','O'),
	(19,'19','EDE',19,false,false,false,0,'H','M'),
	(20,'20','Descuento buen cumplimiento',20,false,false,false,0,'H','E'),
	(21,'21','Descuento pago anual/anticipado',21,false,true,false,0,'H','E'),
	(22,'22','Bonificado pago contado',22,false,true,true,0,'H','E'),
	(23,'23','Descuento',23,false,true,true,0,'H','E'),
	(24,'24','Débito por retenciones',24,true,true,true,0,'D','C'),
	(25,'25','Crédito por retenciones',25,true,true,true,0,'H','C');

ALTER SEQUENCE tipo_movimiento_id_seq RESTART WITH 100; --(A partir de 100 son ids libres)

