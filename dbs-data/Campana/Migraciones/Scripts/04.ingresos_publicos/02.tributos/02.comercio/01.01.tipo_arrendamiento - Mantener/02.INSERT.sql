USE LARAMIE
GO

TRUNCATE TABLE tipo_arrendamiento
GO

INSERT INTO tipo_arrendamiento(id, codigo, nombre, orden, id_tasa_inicial_renovacion, id_sub_tasa_inicial_renovacion, id_tasa_transferencia, id_sub_tasa_transferencia, id_tasa_mensual, id_sub_tasa_mensual, id_tasa_expensas, id_sub_tasa_expensas, id_sub_tasa_varios, es_embarcacion)
VALUES
(1,'1','Mercado de Frutos',1,null,null,null,null,null,null,null,null,null,0),
(2,'2','"Embarcación"',2,null,null,null,null,null,null,null,null,null,1)
GO
