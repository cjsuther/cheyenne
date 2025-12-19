import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class IncidenciaService {

    constructor() {

    }

    async listByFilter(token: string, idTipoIncidencia: number, idModulo: number, idUsuario: number, fechaDesde: string, fechaHasta: string, origen: string, mensaje: string) {
        const paramsUrl = `/filter?`+
        `idTipoIncidencia=${idTipoIncidencia}&`+
        `idModulo=${idModulo}&`+
        `idUsuario=${idUsuario}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `origen=${encodeURIComponent(origen)}&`+
        `mensaje=${encodeURIComponent(mensaje)}`;
        
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.INCIDENCIA);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.INCIDENCIA);
    }

    async findByBackId(token: string, id: number) {
        const paramsUrl = `/back/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.INCIDENCIA);
    }

    async findByForwardId(token: string, id: number) {
        const paramsUrl = `/forward/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.INCIDENCIA);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.INCIDENCIA);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.INCIDENCIA);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.INCIDENCIA);
    }
    
}
