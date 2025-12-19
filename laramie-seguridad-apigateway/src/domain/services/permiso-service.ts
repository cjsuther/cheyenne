import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class PermisoService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.PERMISO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = (id) ? `/${id}` : null;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PERMISO);
    }

    async listByPerfil(token: string, idPerfil:number) {
        const paramsUrl = `/perfil/${idPerfil}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PERMISO);
    }

    async listByUsuario(token: string, idUsuario: number) {
        const paramsUrl = `/usuario/${idUsuario}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PERMISO);
    }

    async checkPermisos(token: string, idUsuario: number, codigoPermiso: string){
        const dataBody = {
            idUsuario: idUsuario,
            codigoPermiso: codigoPermiso
        };
        const paramsUrl = '/usuario'
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PERMISO);
    }

}