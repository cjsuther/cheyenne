TRUNCATE TABLE tipo_movimiento;

INSERT INTO tipo_movimiento
VALUES
	(1,'1','Emisión',1,1,1,1,0,'D','O'),
	(2,'2','Cancelación por recaudación',2,0,1,0,0,'H','C'),
	(3,'3','Débito',3,1,0,1,0,'D','O'),
	(4,'4','Crédito',4,1,0,1,0,'H','O'),
	(5,'5','Accesorios',5,1,1,1,0,'D','O'),
	(6,'6','Débito por liquidación',6,1,1,1,0,'D','O'),
	(7,'7','Crédito por liquidación',7,1,1,1,0,'H','O'),
	(8,'8','Débito por ajuste',8,1,1,1,0,'D','O'),
	(9,'9','Crédito por ajuste',9,1,1,1,0,'H','O'),
	(10,'10','Débito por asignación',10,1,1,0,0,'D','C'),
	(11,'11','Crédito por asignación',11,1,1,0,0,'H','C'),
	(12,'12','Sellados',12,1,1,1,0,'D','O'),
	(13,'13','Plan de pago',13,0,1,0,0,'F','O'),
	(14,'14','Cancelado por convenio',14,0,0,1,0,'H','F'),
	(15,'15','Bonificado por convenio',15,0,1,1,0,'H','E'),
	(16,'16','Accesorio generado por convenio',16,1,1,1,0,'D','O'),
	(17,'17','Recargo por convenio',17,1,1,1,0,'D','O'),
	(18,'18','Deuda origen convenio',18,1,1,1,0,'D','O'),
	(19,'19','EDE',19,0,0,0,0,'H','M'),
	(20,'20','Descuento buen cumplimiento',20,0,0,0,0,'H','M'),
	(21,'21','Descuento pago anual/anticipado',21,0,1,0,0,'H','E'),
	(22,'22','Bonificado pago contado',22,0,1,1,0,'H','E');