import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class VehiculoService {

    constructor() {

    }

    async listByCuenta(token: string, numeroCuenta: string, numeroWeb: string, numeroDocumento: string, idPersona: number, etiqueta: string) {
        const paramsUrl = `/cuenta/filter?`+
        `numeroCuenta=${encodeURIComponent(numeroCuenta)}&`+
        `numeroWeb=${encodeURIComponent(numeroWeb)}&`+
        `numeroDocumento=${encodeURIComponent(numeroDocumento)}&`+
        `idPersona=${idPersona}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.VEHICULO);
    }

    async listByDatos(token: string, dominio: string, marcaModelo: string) {
        const paramsUrl = `/datos/filter?`+
        `dominio=${encodeURIComponent(dominio)}&`+
        `marcaModelo=${encodeURIComponent(marcaModelo)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.VEHICULO);
    }

    async listByDeuda(token: string) {
        const paramsUrl = `/deuda`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.VEHICULO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.VEHICULO);
    }

    async addImportacion(token: string, dataBody: object) {
        const paramsUrl = `/importacion`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.VEHICULO);
    }

    async modifyImportacion(token: string, id: number, dataBody: object) {
        const paramsUrl = `/importacion/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.VEHICULO);
    }
    
}
