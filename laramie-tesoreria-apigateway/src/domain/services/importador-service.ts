import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class ImportadorService {

    constructor() {

    }

    async import(token: string, tipo: string, dataBody: object) {
        const paramsUrl = `/${tipo}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.IMPORTADOR);
    }
    
}
