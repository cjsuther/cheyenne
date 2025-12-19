import config from './config';

export const APIS = {
    URLS: {
        LISTA: config.SITE.WEBAPI_SEGURIDAD + 'api/lista',
        USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        PERFIL: config.SITE.WEBAPI_SEGURIDAD + 'api/perfil',
        PERMISO: config.SITE.WEBAPI_SEGURIDAD + 'api/permiso',
        ACCESO: config.SITE.WEBAPI_SEGURIDAD + 'api/acceso',
        SESION: config.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        VERIFICACION: config.SITE.WEBAPI_SEGURIDAD + 'api/verificacion'
    }
}
