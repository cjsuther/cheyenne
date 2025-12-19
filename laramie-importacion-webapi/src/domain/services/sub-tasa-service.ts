import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import SubTasa from '../entities/sub-tasa';


export default class SubTasaService {

    constructor() {

    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.SUB_TASA);
    }

    async findByCodigo(token: string, idTasa:number, codigo: string) {
        const paramsUrl = `/filter?idTasa=${idTasa}&codigo=${codigo}&descripcion=&etiqueta=`;
        const result = await  SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.SUB_TASA) as SubTasa[];
        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }
    }

}
