import TipoRubroComercio from '../entities/tipo-rubro-comercio';
import ITipoRubroComercioRepository from '../repositories/tipo-rubro-comercio-repository';
import { isValidString, isValidInteger, isValidDate, isValidBoolean, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoRubroComercioService {

	tipoRubroComercioRepository: ITipoRubroComercioRepository;

	constructor(tipoRubroComercioRepository: ITipoRubroComercioRepository) {
		this.tipoRubroComercioRepository = tipoRubroComercioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoRubroComercioRepository.list();
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
				const result = await this.tipoRubroComercioRepository.findById(id);
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

	async add(tipoRubroComercio: TipoRubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRubroComercio.codigo, true) ||
					!isValidString(tipoRubroComercio.nombre, true) ||
					!isValidInteger(tipoRubroComercio.orden, true) ||
					!isValidString(tipoRubroComercio.agrupamiento, true) ||
					!isValidDate(tipoRubroComercio.fechaBaja, false) ||
					!isValidBoolean(tipoRubroComercio.facturable) ||
					!isValidBoolean(tipoRubroComercio.generico) ||
					!isValidString(tipoRubroComercio.categoria, true) ||
					!isValidFloat(tipoRubroComercio.importeMinimo, false) ||
					!isValidFloat(tipoRubroComercio.alicuota, false) ||
					!isValidBoolean(tipoRubroComercio.regimenGeneral)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoRubroComercio.id = null;
				const result = await this.tipoRubroComercioRepository.add(tipoRubroComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoRubroComercio: TipoRubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRubroComercio.codigo, true) ||
					!isValidString(tipoRubroComercio.nombre, true) ||
					!isValidInteger(tipoRubroComercio.orden, true) ||
					!isValidString(tipoRubroComercio.agrupamiento, true) ||
					!isValidDate(tipoRubroComercio.fechaBaja, false) ||
					!isValidBoolean(tipoRubroComercio.facturable) ||
					!isValidBoolean(tipoRubroComercio.generico) ||
					!isValidString(tipoRubroComercio.categoria, true) ||
					!isValidFloat(tipoRubroComercio.importeMinimo, false) ||
					!isValidFloat(tipoRubroComercio.alicuota, false) ||
					!isValidBoolean(tipoRubroComercio.regimenGeneral)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoRubroComercioRepository.modify(id, tipoRubroComercio);
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
				const result = await this.tipoRubroComercioRepository.remove(id);
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
