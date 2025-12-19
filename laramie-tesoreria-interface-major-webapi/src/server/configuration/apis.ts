import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_PERFIL: config.SITE.WEBAPI_SEGURIDAD + 'api/perfil',
        SEGURIDAD_USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        INCIDENCIA: config.SITE.WEBAPI_TESORERIA + 'api/incidencia',
        MAJOR_SERVICE: config.SITE.WEBAPI_TESORERIA_MAJOR + 'laramie/services/servicioslaramie.asmx'
    }
}
