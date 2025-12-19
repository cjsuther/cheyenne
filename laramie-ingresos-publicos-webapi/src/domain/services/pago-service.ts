import NumeracionService from './numeracion-service';
import ConfiguracionService from './configuracion-service';
import ICuentaPagoRepository from '../repositories/cuenta-pago-repository';
import CuentaPagoItemService from './cuenta-pago-item-service';
import CuentaCorrienteExecute from './process/cuenta-corriente/cuenta-corriente-execute';

import CuentaPago from '../entities/cuenta-pago';

import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';

export default class PagoService {

	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	cuentaPagoRepository: ICuentaPagoRepository;
	cuentaPagoItemService: CuentaPagoItemService;
	cuentaCorrienteExecute: CuentaCorrienteExecute;

	constructor(configuracionService: ConfiguracionService,
				numeracionService: NumeracionService,
				cuentaPagoRepository: ICuentaPagoRepository,
				cuentaPagoItemService: CuentaPagoItemService,
				cuentaCorrienteExecute: CuentaCorrienteExecute)
	{
		this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.cuentaPagoRepository = cuentaPagoRepository;
		this.cuentaPagoItemService = cuentaPagoItemService;
		this.cuentaCorrienteExecute = cuentaCorrienteExecute;
	}

	async modifyPagoAnticipado(idUsuario: number, id: number) {
		const resultTransaction = this.cuentaPagoRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const toDay = getDateNow(false);
					const cuentaPago = await this.cuentaPagoRepository.findById(id) as CuentaPago;

					await this.cuentaCorrienteExecute.executePagoAnticipado(idUsuario, id);

					resolve({idCuentaPago: id});
				}
				catch(error) {
                    if (error instanceof ValidationError ||
                        error instanceof ProcessError ||
                        error instanceof ReferenceError) {
                        reject(error);
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
				}
			});
		});
		return resultTransaction;
	}

}
