import { getNamespace } from 'cls-hooked';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';


export default class PerfilService {

    constructor() {

    }

    async listPermisos() {
        return new Promise( async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                const paramsUrl = `/permisos`;
                const result = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.SEGURIDAD_PERFIL);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
