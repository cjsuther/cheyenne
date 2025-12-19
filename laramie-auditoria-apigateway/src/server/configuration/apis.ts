import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        SEGURIDAD_PERMISO: config.SITE.WEBAPI_SEGURIDAD + 'api/permiso',
        SESION: config.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        EVENTO: config.SITE.WEBAPI_AUDITORIA + 'api/evento',
        INCIDENCIA: config.SITE.WEBAPI_AUDITORIA + 'api/incidencia',
        ALERTA: config.SITE.WEBAPI_AUDITORIA + 'api/alerta'
    }
}
