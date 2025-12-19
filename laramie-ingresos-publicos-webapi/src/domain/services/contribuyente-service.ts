import Contribuyente from '../entities/contribuyente';
import IContribuyenteRepository from '../repositories/contribuyente-repository';
import { isValidInteger, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ContribuyenteService {

	contribuyenteRepository: IContribuyenteRepository;

	constructor(contribuyenteRepository: IContribuyenteRepository) {
		this.contribuyenteRepository = contribuyenteRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.contribuyenteRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuenta(idCuenta:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.contribuyenteRepository.listByCuenta(idCuenta);
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
				const result = await this.contribuyenteRepository.findById(id);
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

	async findByPersona(idPersona: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.contribuyenteRepository.findByPersona(idPersona);
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

	async add(contribuyente: Contribuyente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(contribuyente.idPersona, true) ||
					!isValidDate(contribuyente.fechaAlta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				contribuyente.id = null;
				const result = await this.contribuyenteRepository.add(contribuyente);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, contribuyente: Contribuyente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(contribuyente.idPersona, true) ||
					!isValidDate(contribuyente.fechaAlta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.contribuyenteRepository.modify(id, contribuyente);
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
				const result = await this.contribuyenteRepository.remove(id);
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
