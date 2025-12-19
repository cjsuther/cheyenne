import RubroLiquidacion from '../entities/rubro-liquidacion';
import IRubroLiquidacionRepository from '../repositories/rubro-liquidacion-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RubroLiquidacionService {

	rubroLiquidacionRepository: IRubroLiquidacionRepository;

	constructor(rubroLiquidacionRepository: IRubroLiquidacionRepository) {
		this.rubroLiquidacionRepository = rubroLiquidacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.rubroLiquidacionRepository.list();
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
				const result = await this.rubroLiquidacionRepository.findById(id);
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

	async add(rubroLiquidacion: RubroLiquidacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroLiquidacion.codigo, true) ||
					!isValidString(rubroLiquidacion.nombre, true) ||
					!isValidInteger(rubroLiquidacion.orden, true) ||
					!isValidBoolean(rubroLiquidacion.numera) ||
					!isValidInteger(rubroLiquidacion.numero, true) ||
					!isValidBoolean(rubroLiquidacion.reliquida)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				rubroLiquidacion.id = null;
				const result = await this.rubroLiquidacionRepository.add(rubroLiquidacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, rubroLiquidacion: RubroLiquidacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroLiquidacion.codigo, true) ||
					!isValidString(rubroLiquidacion.nombre, true) ||
					!isValidInteger(rubroLiquidacion.orden, true) ||
					!isValidBoolean(rubroLiquidacion.numera) ||
					!isValidInteger(rubroLiquidacion.numero, true) ||
					!isValidBoolean(rubroLiquidacion.reliquida)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.rubroLiquidacionRepository.modify(id, rubroLiquidacion);
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
				const result = await this.rubroLiquidacionRepository.remove(id);
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
