import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';

export default class NumeracionService {

    constructor() {

    }

    async findByNombre(token: string, nombre: string) {
        const paramsUrl = `/${nombre}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.NUMERACION);
    }

    async modifyByNombre(token: string, nombre: string, dataBody: object) {
        const paramsUrl = `/${nombre}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.NUMERACION);
    }
    
}
