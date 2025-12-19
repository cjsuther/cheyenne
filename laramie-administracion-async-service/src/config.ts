import { config } from 'dotenv';


config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  DOMAIN: process.env.NODE_APP_DOMAIN,
  SITE: {
    WEBAPI_SEGURIDAD: process.env.NODE_APP_URL_WEBAPI_SEGURIDAD,
    WEBAPI_ADMINISTRACION: process.env.NODE_APP_URL_WEBAPI_ADMINISTRACION,
    WEBAPI_INGRESOS_PUBLICOS: process.env.NODE_APP_URL_WEBAPI_INGRESOS_PUBLICOS
  },
  ACCESS: {
    USR: process.env.NODE_APP_ACCESS_USR,
    PSW: process.env.NODE_APP_ACCESS_PSW
  },
  INTERVAL: process.env.NODE_APP_INTERVAL
}
