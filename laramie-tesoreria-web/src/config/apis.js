import { APPCONFIG } from '../app.config';

export const APIS = {
    URLS: {
        LOGIN: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/login',
        SESION: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        SEGURIDAD_USUARIO: APPCONFIG.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        IMPORTADOR: APPCONFIG.SITE.WEBAPI + 'api/importador',
        TIP: APPCONFIG.SITE.WEBAPI_ADMINISTRACION + 'api/tip',
        USUARIO: APPCONFIG.SITE.WEBAPI + 'api/usuario',
        PERMISO: APPCONFIG.SITE.WEBAPI + 'api/permiso',
        FILE: APPCONFIG.SITE.WEBAPI + 'api/file',
        LISTA: APPCONFIG.SITE.WEBAPI + 'api/lista',
        ENTIDAD: APPCONFIG.SITE.WEBAPI + 'api/entidad',
        INFORMACION_ADICIONAL: APPCONFIG.SITE.WEBAPI + 'api/informacion-adicional',
        ARCHIVO: APPCONFIG.SITE.WEBAPI + 'api/archivo',
        OBSERVACION: APPCONFIG.SITE.WEBAPI + 'api/observacion',
        ETIQUETA: APPCONFIG.SITE.WEBAPI + 'api/etiqueta',
        REPORTE: APPCONFIG.SITE.WEBAPI + 'api/reporte',
        CAJA: APPCONFIG.SITE.WEBAPI + 'api/caja',
        RECIBO_PUBLICACION_LOTE: APPCONFIG.SITE.WEBAPI + 'api/recibo-publicacion-lote',
        RECAUDACION_LOTE: APPCONFIG.SITE.WEBAPI + 'api/recaudacion-lote',
        REGISTRO_CONTABLE_LOTE: APPCONFIG.SITE.WEBAPI + 'api/registro-contable-lote',
        PAGO_RENDICION_LOTE: APPCONFIG.SITE.WEBAPI + 'api/pago-rendicion-lote',
        PRINTER: APPCONFIG.SITE.PRINTER
    }
}
