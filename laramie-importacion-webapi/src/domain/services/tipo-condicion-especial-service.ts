import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class TipoCondicionEspecialService {

    constructor() {

    }

    async findByCodigo(token: string, codigo: string) {
        const paramsUrl = `/codigo/${codigo}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.TIPO_CONDICION_ESPECIAL);
    }

}
