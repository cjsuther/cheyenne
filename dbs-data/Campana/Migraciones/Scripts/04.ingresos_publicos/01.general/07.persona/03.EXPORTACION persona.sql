USE LARAMIE_CAMPANA;
GO

SELECT 
     id,
     id_tipo_documento,
     CASE 
         WHEN es_persona_juridica = 0 THEN 500   -- Persona Física
         WHEN es_persona_juridica = 1 THEN 501   -- Persona Jurídica
     END AS id_tipo_persona,
     numero_documento,
     CASE 
         WHEN es_persona_juridica = 0 
              THEN LTRIM(RTRIM(nombre)) + ' ' + LTRIM(RTRIM(apellido))
         WHEN es_persona_juridica = 1 
              THEN LTRIM(RTRIM(denominacion))
     END AS nombre_persona
FROM persona_unificado
ORDER BY id;
GO

--del archivo resultante se debe reemplazar el caracter "\" por "-"