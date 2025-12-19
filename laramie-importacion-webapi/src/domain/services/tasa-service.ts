import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import Tasa from '../entities/tasa';


export default class TasaService {

    constructor() {

    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.TASA);
    }

    async findByCodigo(token: string, codigo: string) {
        const paramsUrl = `/filter?codigo=${codigo}&descripcion=&etiqueta=`;
        const result = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.TASA) as Tasa[];
        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    }

}
