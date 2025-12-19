import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CuentaService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async listByFilter(token: string, idCuenta: number, idTipoTributo: number, numeroCuenta: string, numeroWeb: string, idPersona: number, etiqueta: string) {
        const paramsUrl = `/filter?`+
        `idCuenta=${idCuenta}&`+
        `idTipoTributo=${idTipoTributo}&`+
        `numeroCuenta=${encodeURIComponent(numeroCuenta)}&`+
        `numeroWeb=${encodeURIComponent(numeroWeb)}&`+
        `idPersona=${idPersona}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async listByContribuyente(token: string, idContribuyente: number) {
        const paramsUrl = `/contribuyente/${idContribuyente}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async listByPersona(token: string, idPersona: number) {
        const paramsUrl = `/persona/${idPersona}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async findDataById(token: string, id: number) {
        const paramsUrl = `/data/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
    }

    async modifyBajaById(token: string, id: number) {
        const paramsUrl = `/baja/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.CUENTA);
    }
    
}
