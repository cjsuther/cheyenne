import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class VinculoCuentaService {

    constructor() {

    }

    async listByTributo(token: string, idTipoTributo: number, idTributo: number) {
        const paramsUrl = `/tributo/${idTipoTributo}/${idTributo}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.VINCULO_CUENTA);
    }
    
}
