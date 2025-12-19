import DeclaracionJuradaRubro from '../entities/declaracion-jurada-rubro';
import IDeclaracionJuradaRubroRepository from '../repositories/declaracion-jurada-rubro-repository';
import { isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class DeclaracionJuradaRubroService {

	declaracionJuradaRubroRepository: IDeclaracionJuradaRubroRepository;

	constructor(declaracionJuradaRubroRepository: IDeclaracionJuradaRubroRepository) {
		this.declaracionJuradaRubroRepository = declaracionJuradaRubroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.declaracionJuradaRubroRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByDeclaracionJuradaComercio(idDeclaracionJuradaComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.declaracionJuradaRubroRepository.listByDeclaracionJuradaComercio(idDeclaracionJuradaComercio) as Array<DeclaracionJuradaRubro>);
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
				const result = await this.declaracionJuradaRubroRepository.findById(id);
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

	async add(declaracionJuradaRubro: DeclaracionJuradaRubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJuradaRubro.idDeclaracionJuradaComercio, true) ||
					!isValidInteger(declaracionJuradaRubro.idRubroComercio, true) ||
					!isValidFloat(declaracionJuradaRubro.importeIngresosBrutos, true) ||
					!isValidFloat(declaracionJuradaRubro.importeDeducciones, true) ||
					!isValidFloat(declaracionJuradaRubro.importeIngresosNetos, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				declaracionJuradaRubro.id = null;
				const result = await this.declaracionJuradaRubroRepository.add(declaracionJuradaRubro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, declaracionJuradaRubro: DeclaracionJuradaRubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJuradaRubro.idDeclaracionJuradaComercio, true) ||
					!isValidInteger(declaracionJuradaRubro.idRubroComercio, true) ||
					!isValidFloat(declaracionJuradaRubro.importeIngresosBrutos, true) ||
					!isValidFloat(declaracionJuradaRubro.importeDeducciones, true) ||
					!isValidFloat(declaracionJuradaRubro.importeIngresosNetos, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.declaracionJuradaRubroRepository.modify(id, declaracionJuradaRubro);
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
				const result = await this.declaracionJuradaRubroRepository.remove(id);
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
