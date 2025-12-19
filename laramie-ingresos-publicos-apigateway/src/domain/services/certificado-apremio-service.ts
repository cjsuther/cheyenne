import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CertificadoApremioService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async listByFilter(token: string, idApremio: number, idCuenta: number, idEstadoCertificadoApremio: number, numero: string, fechaCertificadoDesde: string, fechaCertificadoHasta: string) {
        const paramsUrl = `/filter?`+
        `idApremio=${idApremio}&`+
        `idCuenta=${idCuenta}&`+
        `idEstadoCertificadoApremio=${idEstadoCertificadoApremio}&`+
        `numero=${encodeURIComponent(numero)}&`+
        `fechaCertificadoDesde=${encodeURIComponent(fechaCertificadoDesde)}&`+
        `fechaCertificadoHasta=${encodeURIComponent(fechaCertificadoHasta)}`;
        
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async listByApremio(token: string, idApremio: number) {
        const paramsUrl = `/apremio/${idApremio}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async modifyCancel(token: string, id: number) {
        const paramsUrl = `/cancel/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.CERTIFICADO_APREMIO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CERTIFICADO_APREMIO);
    }
    
}
