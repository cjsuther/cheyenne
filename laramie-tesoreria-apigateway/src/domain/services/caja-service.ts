import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CajaService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async listByDependencia(token: string, idDependencia: number) {
        const paramsUrl = `/dependencia/${idDependencia}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async listCierreTesoreria(token: string) {
        const paramsUrl = `/cierre-tesoreria`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async findUsuario(token: string, idUsuario: number) {
        const paramsUrl = `/usuario/${idUsuario}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async findResumenById(token: string, id: number) {
        const paramsUrl = `/resumen/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async findResumenByCajaAsignacion(token: string, idCajaAsignacion: number) {
        const paramsUrl = `/resumen/caja-asignacion/${idCajaAsignacion}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async listCajaAsignacion(token: string) {
        const paramsUrl = '/caja-asignacion';
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async listCajaAsignacionByIdCaja(token: string, idCaja: number) {
        const paramsUrl = `/caja-asignacion/${idCaja}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CAJA);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CAJA);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async modifyApertura(token: string, id: number, dataBody: object) {
        const paramsUrl = `/apertura/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async modifyCierre(token: string, id: number) {
        const paramsUrl = `/cierre/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async modifyMovimientoCobranza(token: string, id: number, dataBody: object) {
        const paramsUrl = `/movimiento/cobranza/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async modifyMovimientoRetiro(token: string, id: number, dataBody: object) {
        const paramsUrl = `/movimiento/retiro/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async modifyMovimientoIngreso(token: string, id: number, dataBody: object) {
        const paramsUrl = `/movimiento/ingreso/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async removeMovimiento(token: string, idMovimientoCaja: number) {
        const paramsUrl = `/movimiento/${idMovimientoCaja}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CAJA);
    }

    async modifyCierreTesoreria(token: string, dataBody: object) {
        const paramsUrl = `/cierre-tesoreria`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CAJA);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CAJA);
    }
    
}
