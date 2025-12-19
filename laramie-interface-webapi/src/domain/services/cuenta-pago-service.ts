import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import CuentaPago from '../entities/cuenta-pago';
import CuentaPagoResumen from '../entities/cuenta-pago-resumen';


export default class CuentaPagoService {

    constructor() {

    }

    async findById(token: string, id: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/${id}`;
                const data = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_PAGO) as any;
    
                const item = new CuentaPago();
                item.setFromObject(data);
                const itemResumen = new CuentaPagoResumen();
                itemResumen.setFromObject(data);
                itemResumen.numero = `${item.codigoDelegacion}-${item.numeroRecibo.toString().padStart(10,"0")}`,
                itemResumen.importeVencimiento = item.importeVencimiento1;
                itemResumen.fechaVencimiento = item.fechaVencimiento1;

                resolve(itemResumen);
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
