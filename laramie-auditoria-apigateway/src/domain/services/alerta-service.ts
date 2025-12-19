import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class AlertaService {

    constructor() {

    }

    async listByFilter(token: string, idTipoAlerta: number, idModulo: number, idUsuario: number, fechaDesde: string, fechaHasta: string, origen: string, mensaje: string) {
        const paramsUrl = `/filter?`+
        `idTipoAlerta=${idTipoAlerta}&`+
        `idModulo=${idModulo}&`+
        `idUsuario=${idUsuario}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `origen=${encodeURIComponent(origen)}&`+
        `mensaje=${encodeURIComponent(mensaje)}`;
        
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ALERTA);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ALERTA);
    }

    async findByBackId(token: string, id: number) {
        const paramsUrl = `/back/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ALERTA);
    }

    async findByForwardId(token: string, id: number) {
        const paramsUrl = `/forward/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.ALERTA);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.ALERTA);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.ALERTA);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.ALERTA);
    }
    
}
