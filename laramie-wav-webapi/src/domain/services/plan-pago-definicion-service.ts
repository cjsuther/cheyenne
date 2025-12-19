import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import PlanPagoDefinicion from '../entities/plan-pago-definicion';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import PlanPagoDefinicionCuotas from '../entities/plan-pago-definicion-cuotas';
import OpcionCuota from '../entities/opcion-cuota';
import CuentaPersona from '../entities/cuenta-persona';
import ValidationError from '../../infraestructure/sdk/error/validation-error';


export default class PlanPagoDefinicionService {

    constructor() {

    }

    async listByCuenta(token: string, idPersona: number, idCuenta: number, dataBody: object) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/persona/${idPersona}`;
                const cuentas = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as CuentaPersona[];
                const cuenta = cuentas.find(f => f.id == idCuenta);
                if (!cuenta) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }

                paramsUrl = `/cuenta/${idCuenta}`;
                const data = await  SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION) as any;

                const items: PlanPagoDefinicion[] = data.filter(f => f.valid && [450,452].includes(f.idViaConsolidacion)).map(row => {
                    const item = new PlanPagoDefinicion();
                    item.setFromObject(row);
                    return item;
                });

                const allowedItems = items.filter(f => f.aplicaTitular && cuenta.esTitular || f.aplicaResponsableCuenta && cuenta.esResponsableCuenta);
                resolve(allowedItems);
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

    async listByCuotas(token: string, id: number, dataBody: object) {
		return new Promise( async (resolve, reject) => {
			try {
                const paramsUrl = `/${id}/cuotas`;
                const data = await SendRequest(token, paramsUrl, dataBody, REQUEST_METHOD.PUT, APIS.URLS.PLAN_PAGO_DEFINICION) as any;

                const planPago = new PlanPagoDefinicionCuotas();
                planPago.planPagoDefinicion.setFromObject(data.planPagoDefinicion);
                planPago.opcionCuotas = data.opcionCuotas.map(row => {
                    const item = new OpcionCuota();
                    item.setFromObject(row);
                    return item;
                });

                resolve(planPago);
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
