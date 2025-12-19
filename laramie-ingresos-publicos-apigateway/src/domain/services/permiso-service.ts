import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PermisoService {

    constructor() {

    }

    async listByUsuario(token: string, idUsuario: number) {
        const paramsUrl = `/usuario/${idUsuario}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.SEGURIDAD_PERMISO);
    }
    
}
