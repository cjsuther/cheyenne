import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class CatastroService {

    constructor() {

    }

    async list(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.CATASTRO);
    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CATASTRO);
    }

    async findByPartida(token: string, partida: string) {
        const paramsUrl = `/partida/${partida}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CATASTRO);
    }

    async findByNomenclatura(token: string, circunscripcion: string, seccion: string, chacra: string, letraChacra: string, quinta: string, letraQuinta: string, fraccion: string, letraFraccion: string, manzana: string, letraManzana: string, parcela: string, letraParcela: string, subparcela: string) {
        const paramsUrl = `/nomenclatura/filters?`+
        `circunscripcion=${encodeURIComponent(circunscripcion)}&`+
        `seccion=${encodeURIComponent(seccion)}&`+
        `chacra=${encodeURIComponent(chacra)}&`+
        `letraChacra=${encodeURIComponent(letraChacra)}&`+
        `quinta=${encodeURIComponent(quinta)}&`+
        `letraQuinta=${encodeURIComponent(letraQuinta)}&`+
        `fraccion=${encodeURIComponent(fraccion)}&`+
        `letraFraccion=${encodeURIComponent(letraFraccion)}&`+
        `manzana=${encodeURIComponent(manzana)}&`+
        `letraManzana=${encodeURIComponent(letraManzana)}&`+
        `parcela=${encodeURIComponent(parcela)}&`+
        `letraParcela=${encodeURIComponent(letraParcela)}&`+
        `subparcela=${encodeURIComponent(subparcela)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CATASTRO);
    }

    async add(token: string, dataBody: object) {
        return SendRequest(token, null, dataBody, REQUEST_METHOD.POST, APIS.URLS.CATASTRO);
    }

    async modify(token: string, id: number, dataBody: object) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CATASTRO);
    }

    async remove(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.DELETE, APIS.URLS.CATASTRO);
    }
    
}
