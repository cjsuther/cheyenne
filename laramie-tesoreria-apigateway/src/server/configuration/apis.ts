import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        SEGURIDAD_PERMISO: config.SITE.WEBAPI_SEGURIDAD + 'api/permiso',
        SESION: config.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        REPORTE: config.SITE.WEBAPI_TESORERIA + 'api/reporte',
        IMPORTADOR: config.SITE.WEBAPI_IMPORTACION + 'api/importador',
        LISTA: config.SITE.WEBAPI_TESORERIA + 'api/lista',
        ENTIDAD: config.SITE.WEBAPI_TESORERIA + 'api/entidad',
        INFORMACION_ADICIONAL: config.SITE.WEBAPI_TESORERIA + 'api/informacion-adicional',
        ARCHIVO: config.SITE.WEBAPI_TESORERIA + 'api/archivo',
        OBSERVACION: config.SITE.WEBAPI_TESORERIA + 'api/observacion',
        ETIQUETA: config.SITE.WEBAPI_TESORERIA + 'api/etiqueta',
        RECAUDADORA: config.SITE.WEBAPI_TESORERIA + 'api/Recaudadora',
        DEPENDENCIA: config.SITE.WEBAPI_TESORERIA + 'api/Dependencia',
        RECIBO_PUBLICACION_LOTE: config.SITE.WEBAPI_TESORERIA + 'api/recibo-publicacion-lote',
        CAJA: config.SITE.WEBAPI_TESORERIA + 'api/caja',
        RECAUDACION_LOTE: config.SITE.WEBAPI_TESORERIA + 'api/recaudacion-lote',
        RECAUDACION: config.SITE.WEBAPI_TESORERIA + 'api/recaudacion',
        PAGO_RENDICION_LOTE: config.SITE.WEBAPI_TESORERIA + 'api/pago-rendicion-lote',
        REGISTRO_CONTABLE_LOTE: config.SITE.WEBAPI_TESORERIA + 'api/registro-contable-lote'
    }
}
