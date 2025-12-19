import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class EmisionEjecucionCuentaService {

    constructor() {

    }

    async listResume(token: string, idEmisionEjecucion: number) {
        const paramsUrl = `/resume/${idEmisionEjecucion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION_CUENTA);
    }
    
    async findByNumero(token: string, idEmisionEjecucion: number, numero: number) {
        const paramsUrl = `/numero/${idEmisionEjecucion}/${numero}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION_CUENTA);
    }
    
    async findByCuenta(token: string, idEmisionEjecucion: number, idCuenta: number) {
        const paramsUrl = `/cuenta/${idEmisionEjecucion}/${idCuenta}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION_CUENTA);
    }
    
}
