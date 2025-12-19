import RelacionCuenta from '../entities/relacion-cuenta';
import IRelacionCuentaRepository from '../repositories/relacion-cuenta-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import RelacionCuentaState from '../dto/relacion-cuenta-state';

export default class RelacionCuentaService {

	relacionCuentaRepository: IRelacionCuentaRepository;

	constructor(relacionCuentaRepository: IRelacionCuentaRepository) {
		this.relacionCuentaRepository = relacionCuentaRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.relacionCuentaRepository.listByCuenta(idCuenta) as Array<RelacionCuentaState>).sort((a, b) => a.id - b.id);
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
				const result = await this.relacionCuentaRepository.findById(id);
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

	async add(relacionCuenta: RelacionCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(relacionCuenta.idCuenta1, true) ||
					!isValidInteger(relacionCuenta.idCuenta2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				relacionCuenta.id = null;
				const result = await this.relacionCuentaRepository.add(relacionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, relacionCuenta: RelacionCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(relacionCuenta.idCuenta1, true) ||
					!isValidInteger(relacionCuenta.idCuenta2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.relacionCuentaRepository.modify(id, relacionCuenta);
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
				const result = await this.relacionCuentaRepository.remove(id);
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

	async removeByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.relacionCuentaRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
