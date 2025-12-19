import ControladorCuenta from '../entities/controlador-cuenta';
import IControladorCuentaRepository from '../repositories/controlador-cuenta-repository';
import { isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ControladorCuentaService {

	controladorCuentaRepository: IControladorCuentaRepository;

	constructor(controladorCuentaRepository: IControladorCuentaRepository) {
		this.controladorCuentaRepository = controladorCuentaRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.controladorCuentaRepository.listByCuenta(idCuenta) as Array<ControladorCuenta>).sort((a, b) => a.id - b.id);
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
				const result = await this.controladorCuentaRepository.findById(id);
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

	async add(controladorCuenta: ControladorCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(controladorCuenta.idCuenta, true) ||
					!isValidInteger(controladorCuenta.idTipoControlador, false) ||
					!isValidInteger(controladorCuenta.idControlador, true) ||
					!isValidDate(controladorCuenta.fechaDesde, false) ||
					!isValidDate(controladorCuenta.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				controladorCuenta.id = null;
				if (controladorCuenta.idTipoControlador === 0) controladorCuenta.idTipoControlador = null;
				const result = await this.controladorCuentaRepository.add(controladorCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, controladorCuenta: ControladorCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(controladorCuenta.idCuenta, true) ||
					!isValidInteger(controladorCuenta.idTipoControlador, false) ||
					!isValidInteger(controladorCuenta.idControlador, true) ||
					!isValidDate(controladorCuenta.fechaDesde, false) ||
					!isValidDate(controladorCuenta.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (controladorCuenta.idTipoControlador === 0) controladorCuenta.idTipoControlador = null;
				const result = await this.controladorCuentaRepository.modify(id, controladorCuenta);
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
				const result = await this.controladorCuentaRepository.remove(id);
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
				const result = await this.controladorCuentaRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
