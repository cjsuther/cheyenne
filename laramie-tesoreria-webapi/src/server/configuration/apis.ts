import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_PERFIL: config.SITE.WEBAPI_SEGURIDAD + 'api/perfil',
        CUENTA_CONTABLE: config.SITE.WEBAPI_ADMINISTRACION + 'api/cuenta-contable',
        JURISDICCION: config.SITE.WEBAPI_ADMINISTRACION + 'api/jurisdiccion',
        RECURSO_POR_RUBRO: config.SITE.WEBAPI_ADMINISTRACION + 'api/recurso-por-rubro',
        TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tasa',
        SUB_TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/sub-tasa',
        TIPO_MOVIMIENTO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-movimiento',
    }
}
