import { Sequelize, DataTypes } from 'sequelize';
import config from '../../../../server/configuration/config';

import { defaults } from 'pg';
defaults.parseInt8 = true;

DataTypes.DATE.prototype._stringify = function(date:any, options:any) {
  date = this._applyTimezone(date, options);
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
}.bind(DataTypes.DATE.prototype);


let sharedSequelize:Sequelize = null;

const createConnection = (sharedConnection:boolean, usePool:boolean = true) => {
  if (sharedConnection) {
    if (!sharedSequelize) {
      sharedSequelize = createSecuelize(usePool);
    }
    return sharedSequelize;
  }
  else {
    return createSecuelize(usePool);
  }
}

const createSecuelize = (usePool:boolean) => {
  const host = config.pgsql.PGSQL_HOST;
  const port = parseInt(config.pgsql.PGSQL_PORT);
  const db = config.pgsql.PGSQL_DB;
  const usu = config.pgsql.PGSQL_USER;
  const psw = config.pgsql.PGSQL_PASSWORD;
  const max = parseInt(config.pgsql.PGSQL_MAX_CONNECTION);
  const timezone = config.TIME_ZONE;

  const sequelize = new Sequelize(db, usu, psw, (usePool) ?
  {
    dialect: 'postgres', 
    host: host,
    port: port,
    logging: false,
    dialectOptions: {
      clientMinMessages: 'ignore',
      useUTC: true
    },
    pool: {
      min: 0,
      max: max,
      idle: 10000,
      acquire: 60000
    },
    timezone: timezone //for writing to database
  } :
  {
    dialect: 'postgres', 
    host: host,
    port: port,
    logging: false,
    dialectOptions: {
      clientMinMessages: 'ignore',
      useUTC: true
    },
    timezone: timezone //for writing to database
  });

  return sequelize;
}


export { createConnection };
