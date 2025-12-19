import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class EmisionDefinicionService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_DEFINICION);
    }

    async listByFilter(token: string, idTipoTributo: number, numero: string, descripcion: string, etiqueta: string) {
        const paramsUrl = `/filter?`+
        `idTipoTributo=${idTipoTributo}&`+
        `numero=${encodeURIComponent(numero)}&`+
        `descripcion=${encodeURIComponent(descripcion)}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_DEFINICION);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EMISION_DEFINICION);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.EMISION_DEFINICION);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.EMISION_DEFINICION);
    }

    async cloneById(token: string, id: number) {
        const paramsUrl = `/clone/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.EMISION_DEFINICION);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.EMISION_DEFINICION);
    }
    
}
