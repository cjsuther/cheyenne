import ReciboEspecialConcepto from '../entities/recibo-especial-concepto';
import IReciboEspecialConceptoRepository from '../repositories/recibo-especial-concepto-repository';
import { isValidInteger, isValidString, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ReciboEspecialConceptoState from '../dto/recibo-especial-concepto-state';

export default class ReciboEspecialConceptoService {

	reciboEspecialConceptoRepository: IReciboEspecialConceptoRepository;

	constructor(reciboEspecialConceptoRepository: IReciboEspecialConceptoRepository) {
		this.reciboEspecialConceptoRepository = reciboEspecialConceptoRepository;
	}

	async listByReciboEspecial(idReciboEspecial: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.reciboEspecialConceptoRepository.listByReciboEspecial(idReciboEspecial) as Array<ReciboEspecialConceptoState>).sort((a, b) => a.id - b.id);
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
				const result = await this.reciboEspecialConceptoRepository.findById(id);
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

	async add(reciboEspecialConcepto: ReciboEspecialConcepto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboEspecialConcepto.idReciboEspecial, true) ||
					!isValidInteger(reciboEspecialConcepto.idTasa, true) ||
					!isValidInteger(reciboEspecialConcepto.idSubTasa, true) ||
					!isValidFloat(reciboEspecialConcepto.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				reciboEspecialConcepto.id = null;
				const result = await this.reciboEspecialConceptoRepository.add(reciboEspecialConcepto);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, reciboEspecialConcepto: ReciboEspecialConcepto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboEspecialConcepto.idReciboEspecial, true) ||
					!isValidInteger(reciboEspecialConcepto.idTasa, true) ||
					!isValidInteger(reciboEspecialConcepto.idSubTasa, true) ||
					!isValidFloat(reciboEspecialConcepto.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.reciboEspecialConceptoRepository.modify(id, reciboEspecialConcepto);
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
				const result = await this.reciboEspecialConceptoRepository.remove(id);
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

	async removeByReciboEspecial(idReciboEspecial: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboEspecialConceptoRepository.removeByReciboEspecial(idReciboEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
