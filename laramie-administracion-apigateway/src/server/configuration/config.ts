import { config } from 'dotenv';


config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.NODE_APP_PORT,
  DOMAIN: process.env.NODE_APP_DOMAIN,
  CORS_ALLOWED_ORIGINS: process.env.NODE_APP_CORS_ALLOWED_ORIGINS.split('|'),
  TOKEN_SECRET: '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611',
  TOKEN_TIME_EXPIRATION: 15552000, // 6 meses
  TIME_ZONE: '-03:00',
  MAX_SIZE_FILE: process.env.NODE_APP_MAX_SIZE_FILE,
  SITE: {
    WEBAPI_SEGURIDAD: process.env.NODE_APP_URL_WEBAPI_SEGURIDAD,
    WEBAPI_ADMINISTRACION: process.env.NODE_APP_URL_WEBAPI_ADMINISTRACION
  },
  PATH: {
    TEMP: process.env.NODE_APP_PATH_REPOSITORY + 'temp' + process.env.NODE_APP_PATH_SEPARATOR,
    FILES: process.env.NODE_APP_PATH_REPOSITORY + 'files' + process.env.NODE_APP_PATH_SEPARATOR
  }
}
