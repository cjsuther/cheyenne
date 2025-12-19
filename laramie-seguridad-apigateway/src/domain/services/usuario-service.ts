import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class UsuarioService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.USUARIO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.USUARIO);
    }

    async getChangePassword(login: string) {
        const paramsUrl = `/change-password/${login}`
        return SendRequest(null, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.USUARIO)
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.USUARIO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.USUARIO);
    }

    async putChangePassword(passwordToken: string, password: string) {
        const paramsUrl = `/change-password/${passwordToken}`
        return SendRequest(null, paramsUrl, { password }, REQUEST_METHOD.PUT, APIS.URLS.USUARIO)
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.USUARIO);
    }


    async bindPerfiles(token: string, id:number, dataBody: object) {
        const paramsUrl = `/${id}/perfiles/bind`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.USUARIO);
    }

    async unbindPerfiles(token: string, id:number, dataBody: object) {
        const paramsUrl = `/${id}/perfiles/unbind`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.USUARIO);
    }

    async findByIds(token: string, dataBody: object) {
        const paramsUrl = `/ids`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.USUARIO);
    }
    
}
