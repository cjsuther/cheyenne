import InformacionAdicionalDTO from "../dto/informacion-adicional-dto";

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';

import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class InformacionAdicionalService {

    archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;

	constructor(archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService) {
        this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
	}

	async listByEntidad(entidad:string, idEntidad:number) {
        return new Promise( async (resolve, reject) => {
            try {
                let informacionAdicionalDTO = new InformacionAdicionalDTO();            
                informacionAdicionalDTO.archivos = await this.archivoService.listByEntidad(entidad, idEntidad) as Array<ArchivoState>;
                informacionAdicionalDTO.observaciones = await this.observacionService.listByEntidad(entidad, idEntidad) as Array<ObservacionState>;
                informacionAdicionalDTO.etiquetas = await this.etiquetaService.listByEntidad(entidad, idEntidad) as Array<EtiquetaState>;

                resolve(informacionAdicionalDTO);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async modify(idUsuario: number, informacionAdicionalDTO:InformacionAdicionalDTO) {
		return new Promise( async (resolve, reject) => {
			try {

				//proceso los archivos, observaciones y etiquetas
				let executesInfo = [];
				informacionAdicionalDTO.archivos.forEach(async row => {
					if (row.state === 'a') {
						executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
					}
					else if (row.state === 'r') {
						executesInfo.push(this.archivoService.remove(row.id));
					}
				});
				informacionAdicionalDTO.observaciones.forEach(async row => {
					if (row.state === 'a') {
						executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
					}
					else if (row.state === 'r') {
						executesInfo.push(this.observacionService.remove(row.id));
					}
				});
				informacionAdicionalDTO.etiquetas.forEach(async row => {
					if (row.state === 'a') {
						executesInfo.push(this.etiquetaService.add(row as Etiqueta));
					}
					else if (row.state === 'r') {
						executesInfo.push(this.etiquetaService.remove(row.id));
					}
				});

				Promise.all(executesInfo)
				.then(responses => {
					resolve({id: 0});
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
	}

}
