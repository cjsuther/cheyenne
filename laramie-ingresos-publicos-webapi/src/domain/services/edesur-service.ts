import Edesur from '../entities/edesur';
import IEdesurRepository from '../repositories/edesur-repository';
import IEdesurClienteRepository from '../repositories/edesur-cliente-repository';
import { isValidInteger, isValidString, isValidNumber, isValidDate, isValidBoolean, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import EdesurState from '../dto/edesur-state';

export default class EdesurService {

	edesurRepository: IEdesurRepository;
	edesurClienteRepository: IEdesurClienteRepository;

	constructor(edesurRepository: IEdesurRepository, edesurClienteRepository: IEdesurClienteRepository) {
		this.edesurRepository = edesurRepository;
		this.edesurClienteRepository = edesurClienteRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.edesurRepository.listByInmueble(idInmueble) as Array<EdesurState>).sort((a, b) => a.id - b.id);
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
				const result = await this.edesurRepository.findById(id);
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

	async add(edesur: Edesur) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(edesur.idInmueble, true) ||
					!isValidString(edesur.ultPeriodoEdesur, false) ||
					!isValidString(edesur.ultCuotaEdesur, false) ||
					!isValidFloat(edesur.ultImporteEdesur, false) ||
					!isValidString(edesur.medidor, true) ||
					!isValidInteger(edesur.idFrecuenciaFacturacion, true) ||
					!isValidString(edesur.plan, false) ||
					!isValidString(edesur.radio, false) ||
					!isValidString(edesur.manzana, false) ||
					!isValidString(edesur.idAnteriorEdesur, false) ||
					!isValidFloat(edesur.tarifa, false) ||
					!isValidFloat(edesur.tarifa1, false) ||
					!isValidString(edesur.claseServicio, false) ||
					!isValidFloat(edesur.porcDesc, false) ||
					!isValidString(edesur.cAnual, false) ||
					!isValidString(edesur.recorrido, false) ||
					!isValidString(edesur.planB, false) ||
					!isValidString(edesur.comuna, false) ||
					!isValidString(edesur.calleEdesur, false) ||
					!isValidString(edesur.numeroEdesur, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				edesur.id = null;
				const result = await this.edesurRepository.add(edesur);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, edesur: Edesur) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(edesur.idInmueble, true) ||
					!isValidString(edesur.ultPeriodoEdesur, false) ||
					!isValidString(edesur.ultCuotaEdesur, false) ||
					!isValidFloat(edesur.ultImporteEdesur, false) ||
					!isValidString(edesur.medidor, true) ||
					!isValidInteger(edesur.idFrecuenciaFacturacion, true) ||
					!isValidString(edesur.plan, false) ||
					!isValidString(edesur.radio, false) ||
					!isValidString(edesur.manzana, false) ||
					!isValidString(edesur.idAnteriorEdesur, false) ||
					!isValidFloat(edesur.tarifa, false) ||
					!isValidFloat(edesur.tarifa1, false) ||
					!isValidString(edesur.claseServicio, false) ||
					!isValidFloat(edesur.porcDesc, false) ||
					!isValidString(edesur.cAnual, false) ||
					!isValidString(edesur.recorrido, false) ||
					!isValidString(edesur.planB, false) ||
					!isValidString(edesur.comuna, false) ||
					!isValidString(edesur.calleEdesur, false) ||
					!isValidString(edesur.numeroEdesur, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.edesurRepository.modify(id, edesur);
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
				await this.edesurClienteRepository.removeByEdesur(id);
				const result = await this.edesurRepository.remove(id);
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

	async removeByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const list = (await this.edesurRepository.listByInmueble(idInmueble) as Array<EdesurState>)
				for (let i=0; i<list.length; i++) {
					const row = list[i];
					await this.remove(row.id);
				}
				resolve(idInmueble);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}