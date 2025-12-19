import ProcedimientoFiltro from '../entities/procedimiento-filtro';
import IProcedimientoFiltroRepository from '../repositories/procedimiento-filtro-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ProcedimientoFiltroState from '../dto/procedimiento-filtro-state';

export default class ProcedimientoFiltroService {

	procedimientoFiltroRepository: IProcedimientoFiltroRepository;

	constructor(procedimientoFiltroRepository: IProcedimientoFiltroRepository) {
		this.procedimientoFiltroRepository = procedimientoFiltroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoFiltroRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByProcedimiento(idProcedimiento: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.procedimientoFiltroRepository.listByProcedimiento(idProcedimiento) as Array<ProcedimientoFiltroState>).sort((a, b) => a.id - b.id);
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
				const result = await this.procedimientoFiltroRepository.findById(id);
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

	async add(procedimientoFiltro: ProcedimientoFiltro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoFiltro.idProcedimiento, true) ||
					!isValidInteger(procedimientoFiltro.idFiltro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				procedimientoFiltro.id = null;
				const result = await this.procedimientoFiltroRepository.add(procedimientoFiltro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, procedimientoFiltro: ProcedimientoFiltro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoFiltro.idProcedimiento, true) ||
					!isValidInteger(procedimientoFiltro.idFiltro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.procedimientoFiltroRepository.modify(id, procedimientoFiltro);
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
				const result = await this.procedimientoFiltroRepository.remove(id);
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

	async removeByProcedimiento(idProcedimiento: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoFiltroRepository.removeByProcedimiento(idProcedimiento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
