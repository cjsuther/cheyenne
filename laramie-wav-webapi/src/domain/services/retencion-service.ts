import { REQUEST_METHOD } from "../../infraestructure/sdk/consts/requestMethodType";
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ConfiguracionService from "./configuracion-service";
import ListaService from "./lista-service";
import ApiError from "../../infraestructure/sdk/error/api-error";
import ProcessError from "../../infraestructure/sdk/error/process-error";
import { getDateNow } from "../../infraestructure/sdk/utils/convert";


export default class RetencionService {

    configuracionService: ConfiguracionService;
    listaService: ListaService;

    constructor(configuracionService: ConfiguracionService, listaService: ListaService) {
        this.configuracionService = configuracionService;
        this.listaService = listaService;
    }

    async listRetencionAlicuota(token: string) {
        return SendRequest(token, null, null, REQUEST_METHOD.GET, APIS.URLS.RETENCION_ALICUOTA);
    }

    async add(token: string, idCuenta: number, dataBody: any) {
        return new Promise( async (resolve, reject) => {
            try {
                const body = {
                    retencion: {...dataBody.retencion,
                        idCuenta: idCuenta,
                        fechaPresentacion: getDateNow()
                    },
                    retencionItems: dataBody.retencionItems
                }

                const result = await SendRequest(token, null, body, REQUEST_METHOD.POST, APIS.URLS.RETENCION);
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
