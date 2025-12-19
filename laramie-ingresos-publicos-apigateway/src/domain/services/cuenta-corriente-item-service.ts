import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CuentaCorrienteItemService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByFilter(token: string, idCuenta: number, incluyePlanes: string, fechaDesde: string, fechaHasta: string, fechaDeuda: string) {
        const paramsUrl = `/filter?`+
        `idCuenta=${idCuenta}&`+
        `incluyePlanes=${incluyePlanes}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `fechaDeuda=${encodeURIComponent(fechaDeuda)}`;
        
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByCuenta(token: string, idCuenta: number) {
        const paramsUrl = `/cuenta/${idCuenta}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByContribuyente(token: string, idContribuyente: number) {
        const paramsUrl = `/contribuyente/${idContribuyente}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByCredito(token: string, idCuenta: number) {
        const paramsUrl = `/credito/${idCuenta}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByDeuda(token: string, idCuenta: number) {
        const paramsUrl = `/deuda/${idCuenta}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByDeudaVencimiento(token: string, idCuenta: number, fechaVencimiento:string) {
        const paramsUrl = `/deuda/${idCuenta}/vencimiento/${fechaVencimiento}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async listByPagoACuenta(token: string, dataBody: object) {
        const paramsUrl = `/pago-acuenta`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addReciboComun(token: string, dataBody: object) {
        const paramsUrl = `/recibo-comun`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addPagoReciboEspecial(token: string, dataBody: object) {
        const paramsUrl = `/pago-recibo-especial`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addByPagoACuenta(token: string, dataBody: object) {
        const paramsUrl = `/pago-acuenta`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addCredito(token: string, dataBody: object) {
        const paramsUrl = `/credito`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async addByDebitoCredito(token: string, dataBody: object) {
        const paramsUrl = `/debito-credito`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CUENTA_CORRIENTE_ITEM);
    }
    
}
