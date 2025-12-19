import JuicioCitacion from '../entities/juicio-citacion';
import JuicioCitacionState from '../dto/juicio-citacion-state';
import IJuicioCitacionRepository from '../repositories/juicio-citacion-repository';
import { isValidInteger, isValidDate, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class JuicioCitacionService {

	juicioCitacionRepository: IJuicioCitacionRepository;

	constructor(juicioCitacionRepository: IJuicioCitacionRepository) {
		this.juicioCitacionRepository = juicioCitacionRepository;
	}

	async listByApremio(idApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.juicioCitacionRepository.listByApremio(idApremio) as Array<JuicioCitacionState>;
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
				const result = await this.juicioCitacionRepository.findById(id);
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

	async add(juicioCitacion: JuicioCitacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(juicioCitacion.idApremio, true) ||
					!isValidDate(juicioCitacion.fechaCitacion, true) ||
					!isValidInteger(juicioCitacion.idTipoCitacion, true) ||
					!isValidString(juicioCitacion.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				juicioCitacion.id = null;
				const result = await this.juicioCitacionRepository.add(juicioCitacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, juicioCitacion: JuicioCitacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(juicioCitacion.idTipoCitacion, true) ||
					!isValidString(juicioCitacion.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.juicioCitacionRepository.modify(id, juicioCitacion);
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
				const result = await this.juicioCitacionRepository.remove(id);
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

	async removeByApremio(idApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.juicioCitacionRepository.removeByApremio(idApremio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
