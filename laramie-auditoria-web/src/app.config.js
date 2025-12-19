export const APPCONFIG = {

    SITE: {
        WEBAPP: process.env.REACT_APP_URL_WEBAPP,
        WEBAPI: process.env.REACT_APP_URL_WEBAPI,
        WEBAPI_SEGURIDAD: process.env.REACT_APP_URL_WEBAPI_SEGURIDAD,
        WEBAPP_PRINCIPAL: process.env.REACT_APP_URL_WEBAPP_PRINCIPAL,
    },
    GENERAL: {
        ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
        VERSION: '1.0.0',
        REDUX_KEY: 'REDUX_KEY',
        REDUX_TIMEOUT_DEFAULT: 300, //seg
        PROCESS_TIME_INTERVAL: 10, //seg
        MAX_DATA_SIZE: 5000,
        TITLE: 'Auditoría',
    },
    SECRETS: {
        RSA_PUBLIC_KEY: process.env.REACT_APP_RSA_PUBLIC_KEY,
    },
    PASSWORD_RULES: {
        MIN_CHARACTERS: 6,
        MIN_UPPERCASE: 1,
        MIN_LOWERCASE: 1,
        MIN_NUMBERS: 1,
        MIN_SYMBOLS: 1,
    },
}
