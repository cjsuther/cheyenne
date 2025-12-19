import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PlanPagoService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO);
    }

    async listByCuenta(token: string, idCuenta: number) {
        const paramsUrl = `/cuenta/${idCuenta}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PLAN_PAGO);
    }

    async addPagoContado(token: string, dataBody: object) {
        const paramsUrl = `/pago-contado`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.PLAN_PAGO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO);
    }

    async modifyCaducidad(token: string) {
        const paramsUrl = `/caducidad`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.PLAN_PAGO);
    }
    
}
