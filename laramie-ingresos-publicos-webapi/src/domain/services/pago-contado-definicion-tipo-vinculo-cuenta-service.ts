import PagoContadoDefinicionTipoVinculoCuenta from '../entities/pago-contado-definicion-tipo-vinculo-cuenta';
import IPagoContadoDefinicionTipoVinculoCuentaRepository from '../repositories/pago-contado-definicion-tipo-vinculo-cuenta-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionTipoVinculoCuentaService {

	pagoContadoDefinicionTipoVinculoCuentaRepository: IPagoContadoDefinicionTipoVinculoCuentaRepository;

	constructor(pagoContadoDefinicionTipoVinculoCuentaRepository: IPagoContadoDefinicionTipoVinculoCuentaRepository) {
		this.pagoContadoDefinicionTipoVinculoCuentaRepository = pagoContadoDefinicionTipoVinculoCuentaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.pagoContadoDefinicionTipoVinculoCuentaRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionTipoVinculoCuenta>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.findById(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(pagoContadoDefinicionTipoVinculoCuenta: PagoContadoDefinicionTipoVinculoCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionTipoVinculoCuenta.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionTipoVinculoCuenta.idTipoVinculoCuenta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionTipoVinculoCuenta.id = null;
				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.add(pagoContadoDefinicionTipoVinculoCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionTipoVinculoCuenta: PagoContadoDefinicionTipoVinculoCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionTipoVinculoCuenta.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionTipoVinculoCuenta.idTipoVinculoCuenta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.modify(id, pagoContadoDefinicionTipoVinculoCuenta);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.remove(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionTipoVinculoCuentaRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
