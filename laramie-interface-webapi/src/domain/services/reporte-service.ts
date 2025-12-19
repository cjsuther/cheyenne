import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest, SendRequestStream } from '../../infraestructure/sdk/utils/request';


export default class ReporteService {

    constructor() {

    }

    async generateReport(token: string, reporte: string, dataBody: object) {
        const paramsUrl = `/${reporte}`;
        return SendRequestStream(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.REPORTE);
    }

    async generateReportIndentificador(identificador: string, reporte: string) {
        const paramsUrl = `/${reporte}/identificador/${identificador}`;
        return SendRequestStream(null, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.REPORTE);
    }
    
}
