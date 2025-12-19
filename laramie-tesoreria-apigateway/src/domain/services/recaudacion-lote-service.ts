import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class RecaudacionLoteService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async listDetalle(token: string, id: number) {
        const paramsUrl = `/detalle/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async listControl(token: string) {
        const paramsUrl = `/control`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async listConciliacion(token: string) {
        const paramsUrl = `/conciliacion`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async listIngresosPublicos(token: string) {
        const paramsUrl = `/ingresos-publicos`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async listRegistroContable(token: string) {
        const paramsUrl = `/registro-contable`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.RECAUDACION_LOTE);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.RECAUDACION_LOTE);
    }

    async addImportacionPreview(token: string, dataBody: object) {
        const paramsUrl = `/importacion/preview`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.RECAUDACION_LOTE);
    }

    async addImportacionConfirmacion(token: string, dataBody: object) {
        const paramsUrl = `/importacion/confirmacion`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.RECAUDACION_LOTE);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.RECAUDACION_LOTE);
    }

    async modifyControl(token: string, id: number, dataBody: object) {
        const paramsUrl = `/control/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.RECAUDACION_LOTE);
    }
    
    async modifyConciliacionManual(token: string, idRecaudacion: number) {
        const paramsUrl = `/conciliacion/manual/${idRecaudacion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.RECAUDACION_LOTE);
    }

    async modifyIngresosPublicos(token: string, dataBody: object) {
        const paramsUrl = `/ingresos-publicos`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.RECAUDACION_LOTE);
    }

    async modifyRegistroContable(token: string, dataBody: object) {
        const paramsUrl = `/registro-contable`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.RECAUDACION_LOTE);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.RECAUDACION_LOTE);
    }
    
}
