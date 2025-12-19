export const APPCONFIG = {

    SITE: {
        WEBAPP: process.env.REACT_APP_URL_WEBAPP,
        WEBAPI: process.env.REACT_APP_URL_WEBAPI,
        WEBAPI_SEGURIDAD: process.env.REACT_APP_URL_WEBAPI_SEGURIDAD,
        WEBAPP_PRINCIPAL: process.env.REACT_APP_URL_WEBAPP_PRINCIPAL    
    },
    GENERAL: {
        ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
        VERSION: '1.0.0',
        REDUX_KEY: 'REDUX_KEY',
        REDUX_TIMEOUT_DEFAULT: 300, //seg
        MAX_DATA_SIZE: 5000
    },
    MAPS: {
        LAT: process.env.REACT_APP_MAPS_DEFAULT_LAT,
        LNG: process.env.REACT_APP_MAPS_DEFAULT_LNG
    }
}
