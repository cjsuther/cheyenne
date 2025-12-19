import fs from 'fs';
import Archivo from '../entities/archivo';
import IArchivoRepository from '../repositories/archivo-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import config from '../../server/configuration/config';

export default class ArchivoService {

	archivoRepository: IArchivoRepository;

	constructor(archivoRepository: IArchivoRepository) {
		this.archivoRepository = archivoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.archivoRepository.list();
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
                const result = await this.archivoRepository.listByEntidad(entidad, idEntidad);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByInmueble(idInmueble:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByInmueble(idInmueble);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByComercio(idComercio:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByComercio(idComercio);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByVehiculo(idVehiculo:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByVehiculo(idVehiculo);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByCementerio(idCementerio:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByCementerio(idCementerio);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByFondeadero(idFondeadero:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByFondeadero(idFondeadero);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByEspecial(idEspecial:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.archivoRepository.listByEspecial(idEspecial);
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
				const result = await this.archivoRepository.findById(id);
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

	async add(idUsuario: number, archivo: Archivo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(archivo.entidad, true) ||
					!isValidInteger(archivo.idEntidad, true) ||
					!isValidString(archivo.nombre, true) ||
					!isValidString(archivo.path, true) ||
					!isValidString(archivo.descripcion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				//muevo el archivo del directorio temporal al definitivo
				const pathFileSource = `${config.PATH.TEMP}${archivo.path}`;
				const pathFileTarget = `${config.PATH.FILES}${archivo.path}`;
				ensureDirectoryExistence(pathFileTarget);
				fs.rename(pathFileSource, pathFileTarget, (err) => {
					if (err) {
						reject(new ProcessError('Error moviendo archivo', err));
						return;
					}
				});

				archivo.idUsuario = idUsuario;
				archivo.fecha = getDateNow(true);
				archivo.id = null;
				const result = await this.archivoRepository.add(archivo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, archivo: Archivo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(archivo.entidad, true) ||
					!isValidInteger(archivo.idEntidad, true) ||
					!isValidString(archivo.nombre, true) ||
					!isValidString(archivo.path, true) ||
					!isValidString(archivo.descripcion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.archivoRepository.modify(id, archivo);
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
				const result = await this.archivoRepository.remove(id);
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
