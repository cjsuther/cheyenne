import config from './config';

export const APIS = {
    URLS: {
        SEGURIDAD_PERFIL: config.SITE.WEBAPI_SEGURIDAD + 'api/perfil',
        ADMINISTRACION_DIRECCION: config.SITE.WEBAPI_ADMINISTRACION + 'api/direccion',
        ADMINISTRACION_PERSONA_FISICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-fisica',
        ADMINISTRACION_PERSONA_JURIDICA: config.SITE.WEBAPI_ADMINISTRACION + 'api/persona-juridica',
        ADMINISTRACION_PROVINCIA: config.SITE.WEBAPI_ADMINISTRACION + 'api/provincia',
        ADMINISTRACION_PAIS: config.SITE.WEBAPI_ADMINISTRACION + 'api/pais',
		CONFIGURACION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/configuracion',
        LISTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/lista',
        ADMINISTRACION_LISTA: config.SITE.WEBAPI_ADMINISTRACION + 'api/lista',
		CUENTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta',
		VEHICULO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/vehiculo',
		INCISO_VEHICULO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/inciso-vehiculo',
        TIPO_VEHICULO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-vehiculo',
        CATEGORIA_VEHICULO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/categoria-vehiculo',
        CATEGORIA_TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/categoria-tasa',
		TIPO_CONDICION_ESPECIAL: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-condicion-especial',
		TIPO_MOVIMIENTO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tipo-movimiento',
		CUENTA_CORRIENTE_ITEM: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta-corriente-item',
		CUENTA_PAGO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta-pago',
        VINCULO_CUENTA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/vinculo-cuenta',
        ETIQUETA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/etiqueta',
        OBSERVACION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/observacion',
        TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/tasa',
        SUB_TASA: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/sub-tasa',
        NUMERACION: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/numeracion',
        ESPECIAL: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/cuenta-especial',
        VARIABLE: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/variable',
        CATASTRO: config.SITE.WEBAPI_INGRESOS_PUBLICOS + 'api/catastro',
    }
}
