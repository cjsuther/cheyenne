import EmisionConcepto from '../entities/emision-concepto';
import IEmisionConceptoRepository from '../repositories/emision-concepto-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionConceptoService {

	emisionConceptoRepository: IEmisionConceptoRepository;

	constructor(emisionConceptoRepository: IEmisionConceptoRepository) {
		this.emisionConceptoRepository = emisionConceptoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionConceptoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.emisionConceptoRepository.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionConcepto>).sort((a, b) => a.orden - b.orden);
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
				const result = await this.emisionConceptoRepository.findById(id);
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

	async add(emisionConcepto: EmisionConcepto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionConcepto.idEmisionDefinicion, true) ||
					!isValidInteger(emisionConcepto.idTasa, true) ||
					!isValidInteger(emisionConcepto.idSubTasa, true) ||
					!isValidInteger(emisionConcepto.idTipoMovimiento, true) ||
					!isValidString(emisionConcepto.descripcion, true) ||
					!isValidString(emisionConcepto.formulaCondicion, false) ||
					!isValidString(emisionConcepto.formulaImporteTotal, true) ||
					!isValidString(emisionConcepto.formulaImporteNeto, false) ||
					!isValidInteger(emisionConcepto.vencimiento, true) ||
					!isValidInteger(emisionConcepto.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionConcepto.id = null;
				const result = await this.emisionConceptoRepository.add(emisionConcepto);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionConcepto: EmisionConcepto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionConcepto.idEmisionDefinicion, true) ||
					!isValidInteger(emisionConcepto.idTasa, true) ||
					!isValidInteger(emisionConcepto.idSubTasa, true) ||
					!isValidInteger(emisionConcepto.idTipoMovimiento, true) ||
					!isValidString(emisionConcepto.descripcion, true) ||
					!isValidString(emisionConcepto.formulaCondicion, false) ||
					!isValidString(emisionConcepto.formulaImporteTotal, true) ||
					!isValidString(emisionConcepto.formulaImporteNeto, false) ||
					!isValidInteger(emisionConcepto.vencimiento, true) ||
					!isValidInteger(emisionConcepto.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionConceptoRepository.modify(id, emisionConcepto);
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
				const result = await this.emisionConceptoRepository.remove(id);
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

	async removeByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionConceptoRepository.removeByEmisionDefinicion(idEmisionDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
