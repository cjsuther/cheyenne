export const APPCONFIG = {

    SITE: {
        WEBAPP: process.env.REACT_APP_URL_WEBAPP,
        WEBAPI: process.env.REACT_APP_URL_WEBAPI,
        WEBAPP_PRINCIPAL: process.env.REACT_APP_URL_WEBAPP_PRINCIPAL
    },
    GENERAL: {
        ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
        VERSION: '1.0.0',
        REDUX_KEY: 'REDUX_KEY',
        REDUX_TIMEOUT_DEFAULT: 300, //seg
        MAX_DATA_SIZE: 5000
    },
    WEBAPP: {
        SEGURIDAD: process.env.REACT_APP_URL_WEBAPP_SEGURIDAD,
        ADMINISTRACION: process.env.REACT_APP_URL_WEBAPP_ADMINISTRACION,
        INGRESOS_PUBLICOS: process.env.REACT_APP_URL_WEBAPP_INGRESOS_PUBLICOS
    },
    SECRETS: {
        RSA_PUBLIC_KEY: process.env.REACT_APP_RSA_PUBLIC_KEY,
    }
}
