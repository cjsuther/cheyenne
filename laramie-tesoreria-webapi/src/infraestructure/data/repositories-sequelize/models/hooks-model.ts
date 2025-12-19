import { getNamespace } from 'cls-hooked';
import container from '../../../ioc/dependency-injection';
import PublishService from '../../../../domain/services/publish-service';
import { verifyAccessToken } from '../../../../server/authorization/token';
import { getDateNow } from '../../../sdk/utils/convert';

export async function afterBullCreate(rows, options) {
  for (let i=0; i<rows.length; i++) {
    const row = rows[i];
    await onChange('Creación de registro', 'afterBulkCreate', row, options);
  }
}

export async function afterCreate(row, options) {
  return onChange('Creación de registro', 'afterCreate', row, options);
}

export async function afterUpdate(row, options) {
  return onChange('Actualización de registro', 'afterUpdate', row, options);
}

export async function afterDestroy(row, options) {
  return onChange('Eliminación de registro', 'afterDestroy', row, options);
}

export async function afterVoid(row, options) {

}


async function onChange(title, action, row, options) {

  try {
      const localStorage = getNamespace('LocalStorage');
      const token = localStorage.get("accessToken");
      const dataToken = (token) ? verifyAccessToken(token)??{idUsuario: 0} : {idUsuario: 0};

      const data = {
          token: token,
          idTipoEvento: 21,
          idUsuario: dataToken.idUsuario,
          fecha: getDateNow(true),
          idModulo: 35,
          origen: `laramie-tesoreria-webapi/model/${action}`,
          mensaje: title,
          data: {
            entity: row.constructor.name ?? row.toString(),
            object: row,
            changed: [...row._changed] ?? []
          }
      };

      const publishService = container.resolve('publishService') as PublishService;

      await publishService.sendMessage(`laramie-tesoreria-webapi/model/${action}`, "AddEvento", dataToken.idUsuario.toString(), data);
    }
  catch(error) {
      console.log(error);
  }

}

export const hooksConfig = {
  beforeBulkUpdate: (options) => {
    options.individualHooks = true;
  },
  beforeBulkDestroy: (options) => {
    options.individualHooks = true;
  },
  afterBulkCreate: afterBullCreate,
  afterCreate: afterCreate,
  afterUpdate: afterUpdate,
  afterDestroy: afterDestroy
}