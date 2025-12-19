import Contacto from '../entities/contacto';
import IContactoRepository from '../repositories/contacto-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ContactoService {

	contactoRepository: IContactoRepository;

	constructor(contactoRepository: IContactoRepository) {
		this.contactoRepository = contactoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.contactoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

    async listByEntidad(entidad:string, idEntidad:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.contactoRepository.listByEntidad(entidad, idEntidad);
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
				const result = await this.contactoRepository.findById(id);
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

	async add(contacto: Contacto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(contacto.entidad, true) ||
					!isValidInteger(contacto.idEntidad, true) ||
					!isValidInteger(contacto.idTipoContacto, true) ||
					!isValidString(contacto.detalle, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				contacto.id = null;
				const result = await this.contactoRepository.add(contacto);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, contacto: Contacto) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(contacto.entidad, true) ||
					!isValidInteger(contacto.idEntidad, true) ||
					!isValidInteger(contacto.idTipoContacto, true) ||
					!isValidString(contacto.detalle, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.contactoRepository.modify(id, contacto);
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
				const result = await this.contactoRepository.remove(id);
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

	async removeByEntidad(entidad:string, idEntidad:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.contactoRepository.removeByEntidad(entidad, idEntidad);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
