import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PagoContadoDefinicionService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async listByFilter(token: string, idTipoPlanPago: number,
        idTipoTributo: number, idTasaPagoContado: number, idSubTasaPagoContado: number, idEstadoPagoContadoDefinicion: number,
        fechaDesde: string, fechaHasta: string, descripcion: string, etiqueta: string)
    {
        const paramsUrl = `/filter?`+
        `idTipoPlanPago=${idTipoPlanPago}&`+
        `idTipoTributo=${idTipoTributo}&`+
        `idTasaPagoContado=${idTasaPagoContado}&`+
        `idSubTasaPagoContado=${idSubTasaPagoContado}&`+
        `idEstadoPagoContadoDefinicion=${idEstadoPagoContadoDefinicion}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `descripcion=${encodeURIComponent(descripcion)}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async listByCuenta(token: string, idCuenta: number, dataBody: object) {
        const paramsUrl = `/cuenta/${idCuenta}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async listByCuotas(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}/cuotas`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.PAGO_CONTADO_DEFINICION);
    }
    
}
