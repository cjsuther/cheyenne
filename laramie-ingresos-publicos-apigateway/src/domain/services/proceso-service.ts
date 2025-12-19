import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class ProcesoService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PROCESO);
    }

    async listByEmisionEjecucion(token: string, idEmisionEjecucion: number) {
        const paramsUrl = `/emision-ejecucion/${idEmisionEjecucion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PROCESO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PROCESO);
    }

    async findByIdentificador(token: string, identificador: string) {
        const paramsUrl = `/identificador/${identificador}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PROCESO);
    }


    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PROCESO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PROCESO);
    }

    async modifyVerify(token: string) {
        const paramsUrl = `/verify`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.PROCESO);
    }

    async modifyExecute(token: string, identificador: string) {
        const paramsUrl = `/execute/${identificador}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.PROCESO);
    }

    async modifyCancel(token: string, identificador: string) {
        const paramsUrl = `/cancel/${identificador}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.PROCESO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.PROCESO);
    }
    
}
