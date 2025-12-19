import TipoActoProcesal from '../entities/tipo-acto-procesal';
import ITipoActoProcesalRepository from '../repositories/tipo-acto-procesal-repository';
import { isValidInteger, isValidString, isValidNumber, isValidDate, isValidFloat, isValidArray } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoActoProcesalService {

	tipoActoProcesalRepository: ITipoActoProcesalRepository;

	constructor(tipoActoProcesalRepository: ITipoActoProcesalRepository) {
		this.tipoActoProcesalRepository = tipoActoProcesalRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const list = (await this.tipoActoProcesalRepository.list()) as Array<TipoActoProcesal>;
				const nivelMax = Math.max.apply(null, list.map(x => x.nivel));

				for (let nivel=1; nivel <= nivelMax; nivel++) {
					
					list.filter(f => f.nivel === nivel)
					.sort((a,b) => a.codigoActoProcesal.localeCompare(b.codigoActoProcesal))
					.forEach((row, index) => {
						try {
							let orden = (index + 1) * Math.pow(100, (nivelMax-nivel));
							if (nivel !== 1) {
								const rowPadre = list.find(f => f.id === row.idTipoActoProcesal);
								orden = orden + rowPadre.orden;
							}
							row.orden = orden;
							row.codigoActoProcesal = row.codigoActoProcesal.trim();
							row.codigoActoProcesal = row.codigoActoProcesal.padStart(nivel + row.codigoActoProcesal.length, "-");
						}
						catch(error) {}
					});
					
				}
				const result = list.sort((a,b) => a.orden - b.orden);

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
				const result = await this.tipoActoProcesalRepository.findById(id);
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

	async add(tipoActoProcesal: TipoActoProcesal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(tipoActoProcesal.idTipoActoProcesal, false) ||
					!isValidString(tipoActoProcesal.codigoActoProcesal, true) ||
					!isValidString(tipoActoProcesal.descripcion, true) ||
					!isValidInteger(tipoActoProcesal.plazoDias, true) ||
					!isValidFloat(tipoActoProcesal.porcentajeHonorarios, true) ||
					!isValidDate(tipoActoProcesal.fechaBaja, false) ||
					!isValidInteger(tipoActoProcesal.nivel, true) ||
					!isValidInteger(tipoActoProcesal.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoActoProcesal.id = null;
				if (tipoActoProcesal.idTipoActoProcesal === 0) tipoActoProcesal.idTipoActoProcesal = null;
				const result = await this.tipoActoProcesalRepository.add(tipoActoProcesal);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoActoProcesal: TipoActoProcesal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(tipoActoProcesal.idTipoActoProcesal, false) ||
					!isValidString(tipoActoProcesal.codigoActoProcesal, true) ||
					!isValidString(tipoActoProcesal.descripcion, true) ||
					!isValidInteger(tipoActoProcesal.plazoDias, true) ||
					!isValidFloat(tipoActoProcesal.porcentajeHonorarios, true) ||
					!isValidDate(tipoActoProcesal.fechaBaja, false) ||
					!isValidInteger(tipoActoProcesal.nivel, true) ||
					!isValidInteger(tipoActoProcesal.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (tipoActoProcesal.idTipoActoProcesal === 0) tipoActoProcesal.idTipoActoProcesal = null;
				const result = await this.tipoActoProcesalRepository.modify(id, tipoActoProcesal);
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
				await this.tipoActoProcesalRepository.unbindAllPlantillasDocumentos(id);
				const result = await this.tipoActoProcesalRepository.remove(id);
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

    async modifyPlantillasDocumentos(id:number, plantillasDocumentos:number[]) {
        return new Promise( async (resolve, reject) => {
            try {
				await this.tipoActoProcesalRepository.unbindAllPlantillasDocumentos(id);
                const result = await this.tipoActoProcesalRepository.bindPlantillasDocumentos(id, plantillasDocumentos);

                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

}
