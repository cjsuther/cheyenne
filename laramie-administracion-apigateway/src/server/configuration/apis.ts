import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        SEGURIDAD_PERMISO: config.SITE.WEBAPI_SEGURIDAD + 'api/permiso',
        SESION: config.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        LISTA: config.SITE.WEBAPI_ADMINISTRACION + 'api/lista',
        ENTIDAD: config.SITE.WEBAPI_ADMINISTRACION + 'api/entidad',
		CONTACTO: config.SITE.WEBAPI_ADMINISTRACION + 'api/contacto',
        DIRECCION: config.SITE.WEBAPI_ADMINISTRACION + 'api/direccion',
		DOCUMENTO: config.SITE.WEBAPI_ADMINISTRACION + 'api/documento',
        INFORMACION_ADICIONAL: config.SITE.WEBAPI_ADMINISTRACION + 'api/informacion-adicional',
        ARCHIVO: config.SITE.WEBAPI_ADMINISTRACION + 'api/archivo',
        OBSERVACION: config.SITE.WEBAPI_ADMINISTRACION + 'api/observacion',
        ETIQUETA: config.SITE.WEBAPI_ADMINISTRACION + 'api/etiqueta',
        EXPEDIENTE: config.SITE.WEBAPI_ADMINISTRACION + 'api/expediente',
        PERSONA_FISICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-fisica',
        PERSONA_JURIDICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-juridica',
		MEDIO_PAGO: config.SITE.WEBAPI_ADMINISTRACION + 'api/medio-pago',
        PAIS: config.SITE.WEBAPI_ADMINISTRACION + 'api/pais',
        PROVINCIA: config.SITE.WEBAPI_ADMINISTRACION + 'api/provincia',
        LOCALIDAD: config.SITE.WEBAPI_ADMINISTRACION + 'api/localidad',
        ZONA_GEOREFERENCIA: config.SITE.WEBAPI_ADMINISTRACION + 'api/zona-georeferencia',
        TEMA_EXPEDIENTE: config.SITE.WEBAPI_ADMINISTRACION + 'api/tema-expediente',        
    }
}
