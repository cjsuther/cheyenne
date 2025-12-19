USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE lista_administracion

INSERT INTO lista_administracion
SELECT
    ID,
    CODIGO,
    NOMBRE tipo,
    VALOR nombre,
    ROW_NUMBER() OVER (ORDER BY NOMBRE) orden
FROM MAJOR_CAMPANA.dbo.LISTA
WHERE
    NOMBRE IN (
               'TipoMedioPago',
               'TipoGeoreferencia',
               'TipoExpediente',
               'TipoFirma',
               'FormaJuridica',
               'TipoTarjeta',
               'NivelEstudio',
               'EstadoFirma',
               'Genero',
               'TipoContacto',
               'EstadoCivil',
               'MarcaTarjeta',
               'IngresosBrutos',
               'TipoDocumento',
               'TipoPersona',
               'CondicionFiscal'
        )
ORDER BY tipo
GO
