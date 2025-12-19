import Controlador from '../entities/controlador';
import IControladorRepository from '../repositories/controlador-repository';
import { isValidInteger, isValidString, isValidBoolean, isValidDate, isValidNumber, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ControladorDTO from '../../domain/dto/controlador-dto';
import ControladorFilter from '../../domain/dto/controlador-filter';

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';

export default class ControladorService {

	controladorRepository: IControladorRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;

	constructor(controladorRepository: IControladorRepository,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService) {
		this.controladorRepository = controladorRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.controladorRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(controladorFilter: ControladorFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                let result = null;
				let data = (await this.controladorRepository.listByFilter(controladorFilter) as Array<Controlador>).sort((a, b) => a.id - b.id);
				if (controladorFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(controladorFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "Controlador");
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
				let controladorDTO = new ControladorDTO();
				controladorDTO.controlador = await this.controladorRepository.findById(id) as Controlador;
				if (!controladorDTO.controlador) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				controladorDTO.archivos = await this.archivoService.listByEntidad("Controlador", id) as Array<ArchivoState>;
                controladorDTO.observaciones = await this.observacionService.listByEntidad("Controlador", id) as Array<ObservacionState>;
                controladorDTO.etiquetas = await this.etiquetaService.listByEntidad("Controlador", id) as Array<EtiquetaState>;

				resolve(controladorDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, controladorDTO: ControladorDTO) {
		const resultTransaction = this.controladorRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let controlador = controladorDTO.controlador;
					if (
					!isValidInteger(controlador.idTipoControlador, true) ||
					!isValidString(controlador.numero, true) ||
					!isValidBoolean(controlador.esSupervisor) ||
					!isValidDate(controlador.fechaAlta, true) ||
					!isValidDate(controlador.fechaBaja, false) ||
					!isValidString(controlador.catastralCir, false) ||
					!isValidString(controlador.catastralSec, false) ||
					!isValidString(controlador.catastralChacra, false) ||
					!isValidString(controlador.catastralLchacra, false) ||
					!isValidString(controlador.catastralQuinta, false) ||
					!isValidString(controlador.catastralLquinta, false) ||
					!isValidString(controlador.catastralFrac, false) ||
					!isValidString(controlador.catastralLfrac, false) ||
					!isValidString(controlador.catastralManz, false) ||
					!isValidString(controlador.catastralLmanz, false) ||
					!isValidString(controlador.catastralParc, false) ||
					!isValidString(controlador.catastralLparc, false) ||
					!isValidString(controlador.catastralSubparc, false) ||
					!isValidString(controlador.catastralUfunc, false) ||
					!isValidString(controlador.catastralUcomp, false) ||
					!isValidInteger(controlador.idPersona, true) ||
					!isValidInteger(controlador.idTipoPersona, true) ||
					!isValidString(controlador.nombrePersona, true) ||
					!isValidInteger(controlador.idTipoDocumento, true) ||
					!isValidString(controlador.numeroDocumento, true) ||
					!isValidString(controlador.legajo, true) ||
					!isValidInteger(controlador.idOrdenamiento, true) ||
					!isValidInteger(controlador.idControladorSupervisor, false) ||
					!isValidString(controlador.clasificacion, true) ||
					!isValidDate(controlador.fechaUltimaIntimacion, false) ||
					!isValidFloat(controlador.cantidadIntimacionesEmitidas, false) ||
					!isValidFloat(controlador.cantidadIntimacionesAnuales, false) ||
					!isValidFloat(controlador.porcentaje, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					controlador.id = null;
					if (controlador.idControladorSupervisor === 0) controlador.idControladorSupervisor = null;
					controlador = await this.controladorRepository.add(controlador);
					if (!controlador) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					controladorDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = controlador.id;
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					controladorDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = controlador.id;
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					controladorDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = controlador.id;
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(controlador);
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

	async modify(id: number, idUsuario: number, controladorDTO: ControladorDTO) {
		const resultTransaction = this.controladorRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let controlador = controladorDTO.controlador;
					if (
					!isValidInteger(controlador.idTipoControlador, true) ||
					!isValidString(controlador.numero, true) ||
					!isValidBoolean(controlador.esSupervisor) ||
					!isValidDate(controlador.fechaAlta, true) ||
					!isValidDate(controlador.fechaBaja, false) ||
					!isValidString(controlador.catastralCir, false) ||
					!isValidString(controlador.catastralSec, false) ||
					!isValidString(controlador.catastralChacra, false) ||
					!isValidString(controlador.catastralLchacra, false) ||
					!isValidString(controlador.catastralQuinta, false) ||
					!isValidString(controlador.catastralLquinta, false) ||
					!isValidString(controlador.catastralFrac, false) ||
					!isValidString(controlador.catastralLfrac, false) ||
					!isValidString(controlador.catastralManz, false) ||
					!isValidString(controlador.catastralLmanz, false) ||
					!isValidString(controlador.catastralParc, false) ||
					!isValidString(controlador.catastralLparc, false) ||
					!isValidString(controlador.catastralSubparc, false) ||
					!isValidString(controlador.catastralUfunc, false) ||
					!isValidString(controlador.catastralUcomp, false) ||
					!isValidInteger(controlador.idPersona, true) ||
					!isValidInteger(controlador.idTipoPersona, true) ||
					!isValidString(controlador.nombrePersona, true) ||
					!isValidInteger(controlador.idTipoDocumento, true) ||
					!isValidString(controlador.numeroDocumento, true) ||
					!isValidString(controlador.legajo, true) ||
					!isValidInteger(controlador.idOrdenamiento, true) ||
					!isValidInteger(controlador.idControladorSupervisor, false) ||
					!isValidString(controlador.clasificacion, true) ||
					!isValidDate(controlador.fechaUltimaIntimacion, false) ||
					!isValidFloat(controlador.cantidadIntimacionesEmitidas, false) ||
					!isValidFloat(controlador.cantidadIntimacionesAnuales, false) ||
					!isValidFloat(controlador.porcentaje, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					if (controlador.idControladorSupervisor === 0) controlador.idControladorSupervisor = null;
					controlador = await this.controladorRepository.modify(id, controlador);
					if (!controlador) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					controladorDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.archivoService.remove(row.id));
						}
					});
					controladorDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.observacionService.remove(row.id));
						}
					});
					controladorDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(controlador);
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
				const result = await this.controladorRepository.remove(id);
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
