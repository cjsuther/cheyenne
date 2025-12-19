import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class ReciboPublicacionLoteService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async findReciboByNumero(token: string, codigoDelegacion: string, numeroRecibo: number) {
        const paramsUrl = `/recibo/numero/${codigoDelegacion}/${numeroRecibo}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async findReciboByCodigoBarrasCliente(token: string, codigoBarrasCliente: string) {
        const paramsUrl = `/recibo/codigo-barras-cliente/${codigoBarrasCliente}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.RECIBO_PUBLICACION_LOTE);
    }
    
}
