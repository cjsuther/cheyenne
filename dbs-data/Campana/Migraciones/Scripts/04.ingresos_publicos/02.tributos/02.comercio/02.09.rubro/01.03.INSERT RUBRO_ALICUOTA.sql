-- Importar desde la tabla Hacienda.dbo.RubrosOrdenanzas. Considerar solo el idOrdenanzas que sea 11. (Evaluar al momento de la migración)
-- El resultado debe ser insertado en la tabla rubro_alicuota.

select CodigoRubro, Coef
from RubrosOrdenanzas
where IdOrdenanza = 11


