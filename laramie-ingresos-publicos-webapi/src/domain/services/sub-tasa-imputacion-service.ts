import SubTasaImputacion from '../entities/sub-tasa-imputacion';
import SubTasaImputacionState from '../dto/sub-tasa-imputacion-state';
import ISubTasaImputacionRepository from '../repositories/sub-tasa-imputacion-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class SubTasaImputacionService {

	subTasaImputacionRepository: ISubTasaImputacionRepository;

	constructor(subTasaImputacionRepository: ISubTasaImputacionRepository) {
		this.subTasaImputacionRepository = subTasaImputacionRepository;
	}

	async listBySubTasa(idSubTasa: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.subTasaImputacionRepository.listBySubTasa(idSubTasa) as Array<SubTasaImputacionState>).sort((a, b) => a.id - b.id);
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
				const result = await this.subTasaImputacionRepository.findById(id);
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

	async add(subTasaImputacion: SubTasaImputacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(subTasaImputacion.idTasa, false) ||
					!isValidInteger(subTasaImputacion.idSubTasa, false) ||
					!isValidString(subTasaImputacion.ejercicio, false) ||
					!isValidInteger(subTasaImputacion.idTipoCuota, false) ||
					!isValidInteger(subTasaImputacion.idCuentaContable, false) ||
					!isValidInteger(subTasaImputacion.idCuentaContableAnterior, false) ||
					!isValidInteger(subTasaImputacion.idCuentaContableFutura, false) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionActual, false) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroActual, false) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionAnterior, false) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroAnterior, false) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionFutura, false) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroFutura, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				subTasaImputacion.id = null;
				const result = await this.subTasaImputacionRepository.add(subTasaImputacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, subTasaImputacion: SubTasaImputacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(subTasaImputacion.idTasa, true) ||
					!isValidInteger(subTasaImputacion.idSubTasa, true) ||
					!isValidString(subTasaImputacion.ejercicio, true) ||
					!isValidInteger(subTasaImputacion.idTipoCuota, true) ||
					!isValidInteger(subTasaImputacion.idCuentaContable, true) ||
					!isValidInteger(subTasaImputacion.idCuentaContableAnterior, true) ||
					!isValidInteger(subTasaImputacion.idCuentaContableFutura, true) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionActual, true) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroActual, true) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionAnterior, true) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroAnterior, true) ||
					!isValidInteger(subTasaImputacion.idJurisdiccionFutura, true) ||
					!isValidInteger(subTasaImputacion.idRecursoPorRubroFutura, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.subTasaImputacionRepository.modify(id, subTasaImputacion);
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
				const result = await this.subTasaImputacionRepository.remove(id);
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

	async removeBySubTasa(idSubTasa: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.subTasaImputacionRepository.removeBySubTasa(idSubTasa);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
