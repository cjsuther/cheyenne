import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class SesionService {

    constructor() {

    }

    async findByToken(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.SESION);
    }

    async add(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.POST, APIS.URLS.SESION);
    }
}
