import config from './config';

export const APIS = {
    URLS: {
        USUARIO: config.SITE.WEBAPI_SEGURIDAD + 'api/usuario',
        SESION: config.SITE.WEBAPI_SEGURIDAD + 'api/sesion',
        CONFIGURACION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/configuracion',
        PLAN_PAGO_DEFINICION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/plan-pago-definicion',
        PAGO_CONTADO_DEFINICION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/pago-contado-definicion',
        CUENTA_CORRIENTE_ITEM: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta-corriente-item',
        CUENTA_PAGO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta-pago',
		VINCULO_CUENTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/vinculo-cuenta',
		CUENTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta',
        COMERCIO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/comercio',
        RETENCION_ALICUOTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/retencion-alicuota',
        FONDEADERO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/fondeadero',
        PAGO_CONTADO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/pago-contado',
        PLAN_PAGO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/plan-pago',
        TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tasa',
        SUB_TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/sub-tasa',
        TIPO_CONDICION_ESPECIAL: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-condicion-especial',
        TIPO_MOVIMIENTO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-movimiento',
        RUBRO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/rubro',
        INGRESOS_PUBLICOS_LISTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/lista',
        ADMINISTRACION_LISTA: config.SITE.WEBAPI_ADMINISTRACION + 'api/lista',
        ADMINISTRACION_PERSONA_FISICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-fisica',
        ADMINISTRACION_PERSONA_JURIDICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-juridica',
        REPORTE: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/reporte',
        MODELO_DECLARACION_JURADA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/modelo-declaracion-jurada',
        DECLARACION_JURADA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/declaracion-jurada',
        RETENCION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/retencion',
        PAIS: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/pais',
        PROVINCIA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/provincia',
        LOCALIDAD: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/localidad'
    }
}
