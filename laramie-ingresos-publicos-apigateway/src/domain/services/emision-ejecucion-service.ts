import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class EmisionEjecucionService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION);
    }

    async listByFilter(token: string, idEmisionDefinicion: number, idTipoTributo: number, numero: string, descripcion: string, periodo: string, etiqueta: string) {
        const paramsUrl = `/filter?`+
        `idEmisionDefinicion=${idEmisionDefinicion}&`+
        `idTipoTributo=${idTipoTributo}&`+
        `numero=${encodeURIComponent(numero)}&`+
        `descripcion=${encodeURIComponent(descripcion)}&`+
        `periodo=${encodeURIComponent(periodo)}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION);
    }

    async listByEmisionDefinicion(token: string, idEmisionDefinicion: number) {
        const paramsUrl = `/emision-definicion/${idEmisionDefinicion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_EJECUCION);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.EMISION_EJECUCION);
    }

    async addMostradorWeb(token: string, idCuenta: number, dataBody: object) {
        const paramsUrl = `/mostrador-web/${idCuenta}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.EMISION_EJECUCION);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.EMISION_EJECUCION);
    }

    async modifyStart(token: string, id: number) {
        const paramsUrl = `/start/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_EJECUCION);
    }

    async modifyContinue(token: string, id: number) {
        const paramsUrl = `/continue/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_EJECUCION);
    }

    async modifyStop(token: string, id: number) {
        const paramsUrl = `/stop/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_EJECUCION);
    }

    async modifyPause(token: string, id: number) {
        const paramsUrl = `/pause/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_EJECUCION);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.EMISION_EJECUCION);
    }
    
}
