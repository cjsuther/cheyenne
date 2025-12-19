import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
// import { TripartitoDTO } from "../dto/arba-catastro/tripartito-dto";
import Catastro from '../dto/arba-catastro/catastro';


export default class CatastroService {
    async add(token: string, catastro: Catastro) {
        return SendRequest(token, null, catastro, REQUEST_METHOD.POST, APIS.URLS.CATASTRO);
    }

    async modifyByPartida(token: string, partido: string, partida: string, dataBody: object) {
        const paramsUrl = `/partido/${encodeURIComponent(partido)}/partida/${encodeURIComponent(partida)}`;
        return SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.CATASTRO);
    }

    async getByPartida(token: string, partido: string, partida: string) {
        const paramsUrl = `/partido/${encodeURIComponent(partido)}/partida/${encodeURIComponent(partida)}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CATASTRO);
    }
}
