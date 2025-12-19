import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class EventoService {

    constructor() {

    }

    async listByFilter(token: string, idTipoEvento: number, idModulo: number, idUsuario: number, fechaDesde: string, fechaHasta: string, origen: string, mensaje: string) {
        const paramsUrl = `/filter?`+
        `idTipoEvento=${idTipoEvento}&`+
        `idModulo=${idModulo}&`+
        `idUsuario=${idUsuario}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `origen=${encodeURIComponent(origen)}&`+
        `mensaje=${encodeURIComponent(mensaje)}`;
        
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EVENTO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EVENTO);
    }

    async findByBackId(token: string, id: number) {
        const paramsUrl = `/back/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EVENTO);
    }

    async findByForwardId(token: string, id: number) {
        const paramsUrl = `/forward/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.EVENTO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.EVENTO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.EVENTO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.EVENTO);
    }
    
}
