import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PlantillaDocumentoService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PLANTILLA_DOCUMENTO);
    }

    async listByTipoPlantillaDocumento(token: string, idTipoPlantillaDocumento: number) {
        const paramsUrl = `/tipo-plantilla-documento/${idTipoPlantillaDocumento}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLANTILLA_DOCUMENTO);
    }
    
    async listByTipoActoProcesal(token: string, idTipoActoProcesal: number) {
        const paramsUrl = `/tipo-acto-procesal/${idTipoActoProcesal}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLANTILLA_DOCUMENTO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLANTILLA_DOCUMENTO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PLANTILLA_DOCUMENTO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLANTILLA_DOCUMENTO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.PLANTILLA_DOCUMENTO);
    }
    
}
