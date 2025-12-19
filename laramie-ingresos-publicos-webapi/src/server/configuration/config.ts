import { config } from 'dotenv';


config();

export default {
  GLOBAL_DATA: {
    PROFILES: []
  },
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.NODE_APP_PORT,
  DOMAIN: process.env.NODE_APP_DOMAIN,
  CORS_ALLOWED_ORIGINS: process.env.NODE_APP_CORS_ALLOWED_ORIGINS.split('|'),
  TOKEN_SECRET: '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611',
  TOKEN_TIME_EXPIRATION: 15552000, // 6 meses
  TIME_ZONE: process.env.NODE_APP_TIME_ZONE,
  MAX_SIZE_FILE: process.env.NODE_APP_MAX_SIZE_FILE,
  PATH_SEPARATOR: process.env.NODE_APP_PATH_SEPARATOR,
  XLSX_MAX_ROWS: 5000,
  SITE: {
    WEBAPI_SEGURIDAD: process.env.NODE_APP_URL_WEBAPI_SEGURIDAD,
    WEBAPI_ADMINISTRACION: process.env.NODE_APP_URL_WEBAPI_ADMINISTRACION,
    WEBAPI_INGRESOS_PUBLICOS: process.env.NODE_APP_URL_WEBAPI_INGRESOS_PUBLICOS
  },
  mongo: {
    MONGO_HOST: process.env.NODE_APP_MONGO_HOST,
    MONGO_PORT: process.env.NODE_APP_MONGO_PORT,
    MONGO_DB: process.env.NODE_APP_MONGO_DB,
    MONGO_USER: process.env.NODE_APP_MONGO_USER,
    MONGO_PASSWORD: process.env.NODE_APP_MONGO_PASSWORD,
    MONGO_MAX_CONNECTION: process.env.NODE_APP_MONGO_MAX_CONNECTION
  },
  pgsql: {
    PGSQL_HOST: process.env.NODE_APP_PGSQL_HOST,
    PGSQL_PORT: process.env.NODE_APP_PGSQL_PORT,
    PGSQL_DB: process.env.NODE_APP_PGSQL_DB,
    PGSQL_USER: process.env.NODE_APP_PGSQL_USER,
    PGSQL_PASSWORD: process.env.NODE_APP_PGSQL_PASSWORD,
    PGSQL_MAX_CONNECTION: process.env.NODE_APP_PGSQL_MAX_CONNECTION
  },
  mq: {
    MQ_HOST: process.env.NODE_APP_MQ_HOST,
    MQ_PORT: process.env.NODE_APP_MQ_PORT,
    MQ_EXCHANGE: process.env.NODE_APP_MQ_EXCHANGE,
    MQ_QUEUE: process.env.NODE_APP_MQ_QUEUE,
    MQ_USER: process.env.NODE_APP_MQ_USER,
    MQ_PASSWORD: process.env.NODE_APP_MQ_PASSWORD
  },
  PATH: {
    TEMP: process.env.NODE_APP_PATH_REPOSITORY + 'temp' + process.env.NODE_APP_PATH_SEPARATOR,
    FILES: process.env.NODE_APP_PATH_REPOSITORY + 'files' + process.env.NODE_APP_PATH_SEPARATOR,
    MODULES: process.env.NODE_APP_PATH_REPOSITORY + 'modules' + process.env.NODE_APP_PATH_SEPARATOR,
    RESOURCES: process.env.NODE_APP_PATH_REPOSITORY + 'resources' + process.env.NODE_APP_PATH_SEPARATOR,
    DOCS: process.env.NODE_APP_PATH_REPOSITORY + 'docs' + process.env.NODE_APP_PATH_SEPARATOR,
    PATH_SEPARATOR: process.env.NODE_APP_PATH_SEPARATOR
  },
  EMISION: {
    MAX_READER: process.env.NODE_APP_EMISION_MAX_READER,
    MAX_WORKER: process.env.NODE_APP_EMISION_MAX_WORKER,
    MAX_WRITER: process.env.NODE_APP_EMISION_MAX_WRITER
  }
}
