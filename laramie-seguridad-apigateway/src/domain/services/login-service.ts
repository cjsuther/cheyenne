import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';

export default class LoginService {

    constructor() {

    }

    async findByLogin(username: string, password: string) {
        const dataBody = {
            username: username,
            password: password
        };
        const paramsUrl = '/login'
        return SendRequest(null, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.USUARIO);
    }
    
}
