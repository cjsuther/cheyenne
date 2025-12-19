import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PlanPagoDefinicionService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async listByFilter(token: string, idEstadoPlanPagoDefinicion: number, idTipoPlanPago: number,
        idTipoTributo: number, idTasaPlanPago: number, idSubTasaPlanPago: number, descripcion: string,
        fechaDesde: string, fechaHasta: string, etiqueta: string) {
        const paramsUrl = `/filter?`+
        `idEstadoPlanPagoDefinicion=${idEstadoPlanPagoDefinicion}&`+
        `idTipoPlanPago=${idTipoPlanPago}&`+
        `idTipoTributo=${idTipoTributo}&`+
        `idTasaPlanPago=${idTasaPlanPago}&`+
        `idSubTasaPlanPago=${idSubTasaPlanPago}&`+
        `descripcion=${encodeURIComponent(descripcion)}&`+
        `fechaDesde=${encodeURIComponent(fechaDesde)}&`+
        `fechaHasta=${encodeURIComponent(fechaHasta)}&`+
        `etiqueta=${encodeURIComponent(etiqueta)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async listByCuenta(token: string, idCuenta: number, dataBody: object) {
        const paramsUrl = `/cuenta/${idCuenta}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async listByCuotas(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}/cuotas`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.PLAN_PAGO_DEFINICION);
    }
    
}
