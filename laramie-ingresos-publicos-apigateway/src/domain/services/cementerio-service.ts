import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CementerioService {

    constructor() {

    }

    async listByCuenta(token: string, numeroCuenta: string, numeroWeb: string, numeroDocumento: string, idPersona: number, etiqueta: string) {
        const paramsUrl = `/cuenta/filter?`+
        `numeroCuenta=${encodeURIComponent(numeroCuenta)}&`+
        `numeroWeb=${encodeURIComponent(numeroWeb)}&`+
        `numeroDocumento=${encodeURIComponent(numeroDocumento)}&`+
        `idPersona=${idPersona}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CEMENTERIO);
    }

    async listByDatos(token: string, numeroDocumentoInhumado: string, nombreApellidoInhumado: string) {
        const paramsUrl = `/datos/filter?`+
        `numeroDocumentoInhumado=${encodeURIComponent(numeroDocumentoInhumado)}&`+
        `nombreApellidoInhumado=${encodeURIComponent(nombreApellidoInhumado)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CEMENTERIO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CEMENTERIO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CEMENTERIO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CEMENTERIO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CEMENTERIO);
    }
    
}
