import { APPCONFIG } from '../app.config';

export const APIS = {
    URLS: {
        LOGIN: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/login',
        PERMISO: APPCONFIG.SITE.WEBAPI + 'api/permiso',
        FILE: APPCONFIG.SITE.WEBAPI + 'api/file',
        LISTA: APPCONFIG.SITE.WEBAPI + 'api/lista',
        ENTIDAD: APPCONFIG.SITE.WEBAPI + 'api/entidad',
        INFORMACION_ADICIONAL: APPCONFIG.SITE.WEBAPI + 'api/informacion-adicional',
        ARCHIVO: APPCONFIG.SITE.WEBAPI + 'api/archivo',
        OBSERVACION: APPCONFIG.SITE.WEBAPI + 'api/observacion',
        ETIQUETA: APPCONFIG.SITE.WEBAPI + 'api/etiqueta',
        EXPEDIENTE: APPCONFIG.SITE.WEBAPI + 'api/expediente',
        PERSONA_FISICA: APPCONFIG.SITE.WEBAPI + 'api/persona-fisica',
        PERSONA_JURIDICA: APPCONFIG.SITE.WEBAPI + 'api/persona-juridica',
        SESION: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/sesion'
    }
}
