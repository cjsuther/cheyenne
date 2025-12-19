import { APPCONFIG } from '../app.config';

export const APIS = {
    URLS: {
        LOGIN: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/login',
        USUARIO: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        SESION: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        PERMISO: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/permiso',
        EVENTO: APPCONFIG.SITE.WEBAPI + 'api/evento',
        ALERTA: APPCONFIG.SITE.WEBAPI + 'api/alerta',
        INCIDENCIA: APPCONFIG.SITE.WEBAPI + 'api/incidencia',
    }
}
