import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class InformacionAdicionalService {

    constructor() {

    }

    async listByEntidad(token: string, entidad:string, idEntidad: number) {
        const paramsUrl = `/entidad/${entidad}/${idEntidad}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.INFORMACION_ADICIONAL);
    }

    async modify(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.PUT, APIS.URLS.INFORMACION_ADICIONAL);
    }
}
