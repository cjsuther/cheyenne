import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import { SendRequest, SendRequestStream } from '../../infraestructure/sdk/utils/request';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import CuentaPago from '../entities/cuenta-pago';


export default class PlanPagoService {

    constructor() {

    }

    async findById(token: string, id: number) {
        const paramsUrl = `/${id}`;
        return SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.PLAN_PAGO);
    }

    async generateReportConvenioPreview(token: string, idPersona: number, idCuenta: number, idPlanPagoDefinicion: number, dataBody: object) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/persona/${idPersona}`;
                const cuentas = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                const cuenta = cuentas.find(f => f.id == idCuenta);
                if (!cuenta) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }
                if (!cuenta.idTipoVinculoCuenta || !cuenta.idVinculoCuenta) {
                    reject(new ValidationError('No se pudo identificar el vinculo con la cuenta'));
                    return
                }

                const newDataBody = {...dataBody,
                    idCuenta: idCuenta,
                    idPlanPagoDefinicion: idPlanPagoDefinicion,
                    idTipoVinculoCuenta: cuenta.idTipoVinculoCuenta,
                    idVinculoCuenta: cuenta.idVinculoCuenta
                };

                paramsUrl = `/PlanPagoConvenioPreview`;
                const stream = await SendRequestStream(token, paramsUrl, newDataBody, REQUEST_METHOD.PUT, APIS.URLS.REPORTE) as any;

                resolve(stream);
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

    async add(token: string, idPersona: number, idCuenta: number, idPlanPagoDefinicion: number, dataBody: object) {
		return new Promise( async (resolve, reject) => {
			try {
                let paramsUrl = `/persona/${idPersona}`;
                const cuentas = await SendRequest(token, paramsUrl, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA) as any[];
                const cuenta = cuentas.find(f => f.id == idCuenta);
                if (!cuenta) {
                    reject(new ValidationError('No se pudo obtener los datos de la cuenta'));
                    return
                }
                if (!cuenta.idTipoVinculoCuenta || !cuenta.idVinculoCuenta) {
                    reject(new ValidationError('No se pudo identificar el vinculo con la cuenta'));
                    return
                }

                const newDataBody = {...dataBody,
                    idCuenta: idCuenta,
                    idPlanPagoDefinicion: idPlanPagoDefinicion,
                    idTipoVinculoCuenta: cuenta.idTipoVinculoCuenta,
                    idVinculoCuenta: cuenta.idVinculoCuenta
                };
                const planPago = await SendRequest(token, null, newDataBody, REQUEST_METHOD.POST, APIS.URLS.PLAN_PAGO) as any;
                const cuentaPagos = await SendRequest(token, `/plan-pago/${planPago.id}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA_PAGO) as CuentaPago[];

                let idCuentaPago = null;
                let esAnticipo = false;
                if (cuentaPagos.length > 0) {
                    cuentaPagos.sort((a,b) => a.cuota - b.cuota);
                    const cuentaPago1 = cuentaPagos[0];
                    idCuentaPago = cuentaPago1.id;
                    esAnticipo = (cuentaPago1.cuota === 0);
                }

                resolve({
                    idPlanPago: planPago.id,
                    idCuentaPago,
                    esAnticipo
                });
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
