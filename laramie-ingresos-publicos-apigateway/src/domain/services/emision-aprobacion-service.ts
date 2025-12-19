import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class EmisionAprobacionService {

    constructor() {

    }

    async findByEmisionEjecucion(token: string, idEmisionEjecucion: number) {
        const paramsUrl = `/emision-ejecucion/${idEmisionEjecucion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_APROBACION);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_APROBACION);
    }

    async modifyAction(token: string, id: number, action: string) {
        const paramsUrl = `/${id}/${action}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_APROBACION);
    }

    async modifyActionAsync(token: string, id: number, action: string, fechaProceso: string) {
        const paramsUrl = `/async/${id}/${action}/${fechaProceso}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_APROBACION);
    }
    
}
