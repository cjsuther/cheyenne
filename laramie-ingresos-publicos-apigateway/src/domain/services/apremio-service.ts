import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class ApremioService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.APREMIO);
    }

    async listByFilter(token: string, numero: string, caratula: string, idExpediente: number, idOrganismoJudicial: number, fechaInicioDemandaDesde: string, fechaInicioDemandaHasta: string) {
        const paramsUrl = `/filter?`+
        `numero=${encodeURIComponent(numero)}&`+
        `caratula=${encodeURIComponent(caratula)}&`+
        `idExpediente=${idExpediente}&`+
        `idOrganismoJudicial=${idOrganismoJudicial}&`+
        `fechaInicioDemandaDesde=${encodeURIComponent(fechaInicioDemandaDesde)}&`+
        `fechaInicioDemandaHasta=${encodeURIComponent(fechaInicioDemandaHasta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.APREMIO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.APREMIO);
    }

    async add(token: string, idCertificadoApremio: number, dataBody: object) {
        const paramsUrl = `/${idCertificadoApremio}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.POST, APIS.URLS.APREMIO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.APREMIO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.APREMIO);
    }
    
}
