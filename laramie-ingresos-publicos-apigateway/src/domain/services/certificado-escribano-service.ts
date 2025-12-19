import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CertificadoEscribanoService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }

    async listByFilter(token: string, anioCertificado: string, numeroCertificado: string,
                       idTipoCertificado: number, idEscribano: number, idCuenta: number, etiqueta: string) {
        const paramsUrl = `/filter?`+
        `anioCertificado=${encodeURIComponent(anioCertificado)}&`+
        `numeroCertificado=${encodeURIComponent(numeroCertificado)}&`+
        `idTipoCertificado=${idTipoCertificado}&`+
        `idEscribano=${idEscribano}&`+
        `idCuenta=${idCuenta}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CERTIFICADO_ESCRIBANO);
    }
    
}
