import CajaAsignacion from '../entities/caja-asignacion';
import ICajaAsignacionRepository from '../repositories/caja-asignacion-repository';
import { isValidInteger, isValidDate, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CajaAsignacionService {

	cajaAsignacionRepository: ICajaAsignacionRepository;

	constructor(cajaAsignacionRepository: ICajaAsignacionRepository) {
		this.cajaAsignacionRepository = cajaAsignacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listCierreTesoreria() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionRepository.listCierreTesoreria();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCaja(idCaja: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionRepository.listByCaja(idCaja);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByRecaudacionLote(idRecaudacionLote: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionRepository.listByRecaudacionLote(idRecaudacionLote);
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
				const result = await this.cajaAsignacionRepository.findById(id);
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

	async add(cajaAsignacion: CajaAsignacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cajaAsignacion.idCaja, true) ||
					!isValidInteger(cajaAsignacion.idUsuario, true) ||
					!isValidDate(cajaAsignacion.fechaApertura, true) ||
					!isValidDate(cajaAsignacion.fechaCierre, false) ||
					!isValidFloat(cajaAsignacion.importeSaldoInicial, false) ||
					!isValidFloat(cajaAsignacion.importeSaldoFinal, false) ||
					!isValidFloat(cajaAsignacion.importeCobro, false) ||
					!isValidFloat(cajaAsignacion.importeCobroEfectivo, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cajaAsignacion.id = null;
				if (cajaAsignacion.idRecaudacionLote === 0) cajaAsignacion.idRecaudacionLote = null;
				const result = await this.cajaAsignacionRepository.add(cajaAsignacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cajaAsignacion: CajaAsignacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cajaAsignacion.idCaja, true) ||
					!isValidInteger(cajaAsignacion.idUsuario, true) ||
					!isValidDate(cajaAsignacion.fechaApertura, true) ||
					!isValidDate(cajaAsignacion.fechaCierre, false) ||
					!isValidFloat(cajaAsignacion.importeSaldoInicial, false) ||
					!isValidFloat(cajaAsignacion.importeSaldoFinal, false) ||
					!isValidFloat(cajaAsignacion.importeCobro, false) ||
					!isValidFloat(cajaAsignacion.importeCobroEfectivo, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (cajaAsignacion.idRecaudacionLote === 0) cajaAsignacion.idRecaudacionLote = null;
				const result = await this.cajaAsignacionRepository.modify(id, cajaAsignacion);
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
				const result = await this.cajaAsignacionRepository.remove(id);
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
