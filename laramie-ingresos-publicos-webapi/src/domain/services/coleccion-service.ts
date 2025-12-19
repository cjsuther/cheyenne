import Coleccion from '../entities/coleccion';
import IColeccionRepository from '../repositories/coleccion-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ColeccionCampoService from './coleccion-campo-service';

export default class ColeccionService {

	coleccionRepository: IColeccionRepository;
	coleccionCampoService: ColeccionCampoService;

	constructor(coleccionRepository: IColeccionRepository,
			coleccionCampoService: ColeccionCampoService) {
		this.coleccionRepository = coleccionRepository;
		this.coleccionCampoService = coleccionCampoService;
	}

	async list(idTipoTributo: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.coleccionRepository.list() as Array<Coleccion>).filter(f => f.idTipoTributo === idTipoTributo || f.idTipoTributo === null);
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
				const result = await this.coleccionRepository.findById(id);
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

	async add(coleccion: Coleccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(coleccion.idTipoTributo, true) ||
					!isValidString(coleccion.nombre, true) ||
					!isValidString(coleccion.descripcion, true) ||
					!isValidString(coleccion.ejecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				coleccion.id = null;
				const result = await this.coleccionRepository.add(coleccion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, coleccion: Coleccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(coleccion.idTipoTributo, true) ||
					!isValidString(coleccion.nombre, true) ||
					!isValidString(coleccion.descripcion, true) ||
					!isValidString(coleccion.ejecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.coleccionRepository.modify(id, coleccion);
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
				const result = await this.coleccionRepository.remove(id);
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

	async execute(coleccion:Coleccion, idCuenta:number, idEmisionEjecucion:number, idTasa:number, idSubTasa:number, periodo:number, mes:number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.coleccionRepository.execute(coleccion, idCuenta, idEmisionEjecucion, idTasa, idSubTasa, periodo, mes);
				resolve(result);
			}
			catch(error) {
				if (error.original && error.original.hint && error.original.hint.toString() === 'CUSTOM') {
					reject(new ProcessError(error.message, error));
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

}
