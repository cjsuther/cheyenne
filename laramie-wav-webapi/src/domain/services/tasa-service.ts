import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ListaService from './lista-service';
import { SendRequest } from '../../infraestructure/sdk/utils/request';


export default class TasaService {

    listaService: ListaService;
    
    constructor(listaService: ListaService) {
        this.listaService = listaService;
    }

    async listTasa(token: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.TASA);
                resolve(result);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }

    async listSubTasa(token: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.SUB_TASA);
                resolve(result);
            }
            catch(error) {
                if (error.statusCode && error.message) {
                    reject(new ApiError(error.message, error.statusCode));
                }
                else {
                    reject(new ProcessError('Error procesando datos', error));
                }
            }
        });
    }
}
