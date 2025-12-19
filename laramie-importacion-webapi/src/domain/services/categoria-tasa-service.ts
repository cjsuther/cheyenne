import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CategoriaTasaService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CATEGORIA_TASA);
    }

}
