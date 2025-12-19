import LadoTerreno from '../entities/lado-terreno';
import LadoTerrenoState from '../dto/lado-terreno-state';
import ILadoTerrenoRepository from '../repositories/lado-terreno-repository';
import IDireccionRepository from '../repositories/direccion-repository';
import ILadoTerrenoServicioRepository from '../repositories/lado-terreno-servicio-repository';
import ILadoTerrenoObraRepository from '../repositories/lado-terreno-servicio-repository';
import { isValidFloat, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class LadoTerrenoService {

	ladoTerrenoRepository: ILadoTerrenoRepository;
	direccionRepository: IDireccionRepository;
	ladoTerrenoServicioRepository: ILadoTerrenoServicioRepository;
	ladoTerrenoObraRepository: ILadoTerrenoObraRepository;

	constructor(ladoTerrenoRepository: ILadoTerrenoRepository,
				direccionRepository: IDireccionRepository,
				ladoTerrenoServicioRepository: ILadoTerrenoServicioRepository,
				ladoTerrenoObraRepository: ILadoTerrenoObraRepository) {
		this.ladoTerrenoRepository = ladoTerrenoRepository;
		this.direccionRepository = direccionRepository;
		this.ladoTerrenoServicioRepository = ladoTerrenoServicioRepository;
		this.ladoTerrenoObraRepository = ladoTerrenoObraRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.ladoTerrenoRepository.listByInmueble(idInmueble) as Array<LadoTerrenoState>).sort((a, b) => a.id - b.id);
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
				const result = await this.ladoTerrenoRepository.findById(id);
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

	async add(ladoTerreno: LadoTerreno) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerreno.idInmueble, true) ||
					!isValidInteger(ladoTerreno.idTipoLado, true) ||
					!isValidInteger(ladoTerreno.numero, true) ||
					!isValidFloat(ladoTerreno.metros, false) ||
					!isValidFloat(ladoTerreno.reduccion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				ladoTerreno.id = null;
				const result = await this.ladoTerrenoRepository.add(ladoTerreno);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, ladoTerreno: LadoTerreno) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerreno.idInmueble, true) ||
					!isValidInteger(ladoTerreno.idTipoLado, true) ||
					!isValidInteger(ladoTerreno.numero, true) ||
					!isValidFloat(ladoTerreno.metros, false) ||
					!isValidFloat(ladoTerreno.reduccion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.ladoTerrenoRepository.modify(id, ladoTerreno);
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
				await this.direccionRepository.removeByEntidad('LadoTerreno', id);
				await this.ladoTerrenoServicioRepository.removeByLadoTerreno(id);
				await this.ladoTerrenoObraRepository.removeByLadoTerreno(id);
				const result = await this.ladoTerrenoRepository.remove(id);
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
				const list = (await this.ladoTerrenoRepository.listByInmueble(idInmueble) as Array<LadoTerrenoState>)
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
