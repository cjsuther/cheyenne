import CuentaCorrienteCondicionEspecial from '../entities/cuenta-corriente-condicion-especial';
import ICuentaCorrienteCondicionEspecialRepository from '../repositories/cuenta-corriente-condicion-especial-repository';
import { isValidInteger, isValidString, isValidDate, isValidNumber } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CuentaCorrienteCondicionEspecialService {

	cuentaCorrienteCondicionEspecialRepository: ICuentaCorrienteCondicionEspecialRepository;

	constructor(cuentaCorrienteCondicionEspecialRepository: ICuentaCorrienteCondicionEspecialRepository) {
		this.cuentaCorrienteCondicionEspecialRepository = cuentaCorrienteCondicionEspecialRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaCorrienteCondicionEspecialRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.cuentaCorrienteCondicionEspecialRepository.listByCuenta(idCuenta) as Array<CuentaCorrienteCondicionEspecial>).sort((a,b) => a.numero - b.numero);
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
				const result = await this.cuentaCorrienteCondicionEspecialRepository.findById(id);
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

	async add(cuentaCorrienteCondicionEspecial: CuentaCorrienteCondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaCorrienteCondicionEspecial.numero, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.idTipoCondicionEspecial, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.idCuenta, true) ||
					!isValidString(cuentaCorrienteCondicionEspecial.codigoDelegacion, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.numeroMovimiento, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.numeroPartida, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.numeroComprobante, false) ||
					!isValidDate(cuentaCorrienteCondicionEspecial.fechaDesde, true) ||
					!isValidDate(cuentaCorrienteCondicionEspecial.fechaHasta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuentaCorrienteCondicionEspecial.id = null;
				const result = await this.cuentaCorrienteCondicionEspecialRepository.add(cuentaCorrienteCondicionEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuentaCorrienteCondicionEspecial: CuentaCorrienteCondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaCorrienteCondicionEspecial.numero, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.idTipoCondicionEspecial, true) ||
					!isValidInteger(cuentaCorrienteCondicionEspecial.numeroComprobante, false) ||
					!isValidDate(cuentaCorrienteCondicionEspecial.fechaDesde, true) ||
					!isValidDate(cuentaCorrienteCondicionEspecial.fechaHasta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaCorrienteCondicionEspecialRepository.modify(id, cuentaCorrienteCondicionEspecial);
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
				const result = await this.cuentaCorrienteCondicionEspecialRepository.remove(id);
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

}
