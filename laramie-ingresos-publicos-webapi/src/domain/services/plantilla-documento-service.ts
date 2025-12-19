import fs from 'fs';
import PlantillaDocumento from '../entities/plantilla-documento';
import IPlantillaDocumentoRepository from '../repositories/plantilla-documento-repository';
import { isValidInteger, isValidString, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import config from '../../server/configuration/config';

export default class PlantillaDocumentoService {

	plantillaDocumentoRepository: IPlantillaDocumentoRepository;

	constructor(plantillaDocumentoRepository: IPlantillaDocumentoRepository) {
		this.plantillaDocumentoRepository = plantillaDocumentoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.plantillaDocumentoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByTipoPlantillaDocumento(idTipoPlantillaDocumento: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.plantillaDocumentoRepository.listByTipoPlantillaDocumento(idTipoPlantillaDocumento);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByTipoActoProcesal(idTipoActoProcesal: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.plantillaDocumentoRepository.listByTipoActoProcesal(idTipoActoProcesal);
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
				const result = await this.plantillaDocumentoRepository.findById(id);
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

	async add(idUsuario: number, plantillaDocumento: PlantillaDocumento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(plantillaDocumento.idTipoPlantillaDocumento, true) ||
					!isValidString(plantillaDocumento.descripcion, true) ||
					!isValidString(plantillaDocumento.nombre, true) ||
					!isValidString(plantillaDocumento.path, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				//muevo el archivo del directorio temporal al definitivo
				const pathFileSource = `${config.PATH.TEMP}${plantillaDocumento.path}`;
				const pathFileTarget = `${config.PATH.FILES}${plantillaDocumento.path}`;
				ensureDirectoryExistence(pathFileTarget);
				fs.rename(pathFileSource, pathFileTarget, (err) => {
					if (err) {
						reject(new ProcessError('Error moviendo archivo', err));
						return;
					}
				});

				plantillaDocumento.idUsuario = idUsuario;
				plantillaDocumento.fecha = getDateNow(true);
				plantillaDocumento.id = null;
				const result = await this.plantillaDocumentoRepository.add(plantillaDocumento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, plantillaDocumento: PlantillaDocumento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(plantillaDocumento.idTipoPlantillaDocumento, true) ||
					!isValidString(plantillaDocumento.descripcion, true) ||
					!isValidString(plantillaDocumento.nombre, true) ||
					!isValidString(plantillaDocumento.path, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const original = await this.plantillaDocumentoRepository.findById(id);
				if (original.path != plantillaDocumento.path) {

					//muevo el archivo del directorio temporal al definitivo
					const pathFileSource = `${config.PATH.TEMP}${plantillaDocumento.path}`;
					const pathFileTarget = `${config.PATH.FILES}${plantillaDocumento.path}`;
					ensureDirectoryExistence(pathFileTarget);
					fs.rename(pathFileSource, pathFileTarget, (err) => {
						if (err) {
							reject(new ProcessError('Error moviendo archivo', err));
							return;
						}
					});
				}

				const result = await this.plantillaDocumentoRepository.modify(id, plantillaDocumento);
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
				const result = await this.plantillaDocumentoRepository.remove(id);
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
