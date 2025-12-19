import Tasa from '../entities/tasa';
import ITasaRepository from '../repositories/tasa-repository';
import { isValidString, isValidInteger, isValidNumber, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import TasaDTO from '../dto/tasa-dto';
import TasaFilter from '../dto/tasa-filter';

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';

export default class TasaService {

	tasaRepository: ITasaRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;

	constructor(tasaRepository: ITasaRepository,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService) {
		this.tasaRepository = tasaRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tasaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(tasaFilter: TasaFilter) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = null;
                let data = (await this.tasaRepository.listByFilter(tasaFilter) as Array<Tasa>).sort((a, b) => a.id - b.id);
				if (tasaFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(tasaFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "Tasa");
					const ids = etiquetas.map(x => x.idEntidad);
					result = data.filter(f => ids.includes(f.id));
				}
				else {
					result = data;
				}
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
				let tasaDTO = new TasaDTO();
				tasaDTO.tasa = await this.tasaRepository.findById(id) as Tasa;
				if (!tasaDTO.tasa) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				tasaDTO.archivos = await this.archivoService.listByEntidad("Tasa", id) as Array<ArchivoState>;
                tasaDTO.observaciones = await this.observacionService.listByEntidad("Tasa", id) as Array<ObservacionState>;
                tasaDTO.etiquetas = await this.etiquetaService.listByEntidad("Tasa", id) as Array<EtiquetaState>;

				resolve(tasaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, tasaDTO: TasaDTO) {
		const resultTransaction = this.tasaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let tasa = tasaDTO.tasa;
					if (
						!isValidString(tasa.codigo, true) ||
						!isValidInteger(tasa.idTipoTributo, true) ||
						!isValidInteger(tasa.idCategoriaTasa, true) ||
						!isValidString(tasa.descripcion, true) ||
						!isValidFloat(tasa.porcentajeDescuento, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					tasa.id = null;
					tasa = await this.tasaRepository.add(tasa);
					if (!tasa) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					tasaDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = tasa.id;
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					tasaDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = tasa.id;
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					tasaDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = tasa.id;
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						this.findById(tasa.id).then(resolve).catch(reject);
					})
					.catch((error) => {
						reject(error);
					});
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError ||
						error instanceof ReferenceError) {
						reject(error);
					}
					else {
						reject(new ProcessError('Error procesando datos', error));
					}
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, idUsuario: number, tasaDTO: TasaDTO) {
		const resultTransaction = this.tasaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let tasa = tasaDTO.tasa;
					if (
						!isValidString(tasa.codigo, true) ||
						!isValidInteger(tasa.idTipoTributo, true) ||
						!isValidInteger(tasa.idCategoriaTasa, true) ||
						!isValidString(tasa.descripcion, true) ||
						!isValidFloat(tasa.porcentajeDescuento, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					tasa = await this.tasaRepository.modify(id, tasa);
					if (!tasa) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					tasaDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.archivoService.remove(row.id));
						}
					});
					tasaDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.observacionService.remove(row.id));
						}
					});
					tasaDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						this.findById(tasa.id).then(resolve).catch(reject);
					})
					.catch((error) => {
						reject(error);
					});
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError ||
						error instanceof ReferenceError) {
						reject(error);
					}
					else {
						reject(new ProcessError('Error procesando datos', error));
					}
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tasaRepository.remove(id);
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
