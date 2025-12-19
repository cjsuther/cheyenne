import ObraInmueble from '../entities/obra-inmueble';
import ObraInmuebleState from '../dto/obra-inmueble-state';
import IObraInmuebleRepository from '../repositories/obra-inmueble-repository';
import IObraInmuebleDetalleRepository from '../repositories/obra-inmueble-detalle-repository';
import { isValidInteger, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ObraInmuebleService {

	obraInmuebleRepository: IObraInmuebleRepository;
	obraInmuebleDetalleRepository: IObraInmuebleDetalleRepository;

	constructor(obraInmuebleRepository: IObraInmuebleRepository, obraInmuebleDetalleRepository: IObraInmuebleDetalleRepository) {
		this.obraInmuebleRepository = obraInmuebleRepository;
		this.obraInmuebleDetalleRepository = obraInmuebleDetalleRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.obraInmuebleRepository.listByInmueble(idInmueble) as Array<ObraInmuebleState>).sort((a, b) => a.id - b.id);
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
				const result = await this.obraInmuebleRepository.findById(id);
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

	async add(obraInmueble: ObraInmueble) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(obraInmueble.idInmueble, true) ||
					!isValidInteger(obraInmueble.idTasa, true) ||
					!isValidInteger(obraInmueble.idTipoMovimiento, true) ||
					!isValidInteger(obraInmueble.cuota, true) ||
					!isValidDate(obraInmueble.fechaPrimerVencimiento, true) ||
					!isValidDate(obraInmueble.fechaSegundoVencimiento, true) ||
					!isValidDate(obraInmueble.fechaPresentacion, false) ||
					!isValidDate(obraInmueble.fechaInspeccion, false) ||
					!isValidDate(obraInmueble.fechaAprobacion, false) ||
					!isValidDate(obraInmueble.fechaInicioDesglose, false) ||
					!isValidDate(obraInmueble.fechaFinDesglose, false) ||
					!isValidDate(obraInmueble.fechaFinObra, false) ||
					!isValidDate(obraInmueble.fechaArchivado, false) ||
					!isValidDate(obraInmueble.fechaIntimado, false) ||
					!isValidDate(obraInmueble.fechaVencidoIntimado, false) ||
					!isValidDate(obraInmueble.fechaMoratoria, false) ||
					!isValidDate(obraInmueble.fechaVencidoMoratoria, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				obraInmueble.id = null;
				if (obraInmueble.idSubTasa === 0) obraInmueble.idSubTasa = null;
				if (obraInmueble.idPersona === 0) obraInmueble.idPersona = null;
				if (obraInmueble.idTipoDocumento === 0) obraInmueble.idTipoDocumento = null;
				if (obraInmueble.idExpediente === 0) obraInmueble.idExpediente = null;
				const result = await this.obraInmuebleRepository.add(obraInmueble);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, obraInmueble: ObraInmueble) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(obraInmueble.idInmueble, true) ||
					!isValidInteger(obraInmueble.idTasa, true) ||
					!isValidInteger(obraInmueble.idSubTasa, false) ||
					!isValidInteger(obraInmueble.idTipoMovimiento, true) ||
					!isValidInteger(obraInmueble.cuota, true) ||
					!isValidDate(obraInmueble.fechaPrimerVencimiento, true) ||
					!isValidDate(obraInmueble.fechaSegundoVencimiento, true) ||
					!isValidDate(obraInmueble.fechaPresentacion, false) ||
					!isValidDate(obraInmueble.fechaInspeccion, false) ||
					!isValidDate(obraInmueble.fechaAprobacion, false) ||
					!isValidDate(obraInmueble.fechaInicioDesglose, false) ||
					!isValidDate(obraInmueble.fechaFinDesglose, false) ||
					!isValidDate(obraInmueble.fechaFinObra, false) ||
					!isValidDate(obraInmueble.fechaArchivado, false) ||
					!isValidDate(obraInmueble.fechaIntimado, false) ||
					!isValidDate(obraInmueble.fechaVencidoIntimado, false) ||
					!isValidDate(obraInmueble.fechaMoratoria, false) ||
					!isValidDate(obraInmueble.fechaVencidoMoratoria, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (obraInmueble.idSubTasa === 0) obraInmueble.idSubTasa = null;
				if (obraInmueble.idPersona === 0) obraInmueble.idPersona = null;
				if (obraInmueble.idTipoDocumento === 0) obraInmueble.idTipoDocumento = null;
				if (obraInmueble.idExpediente === 0) obraInmueble.idExpediente = null;
				const result = await this.obraInmuebleRepository.modify(id, obraInmueble);
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
				await this.obraInmuebleDetalleRepository.removeByObraInmueble(id);
				const result = await this.obraInmuebleRepository.remove(id);
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
				const list = (await this.obraInmuebleRepository.listByInmueble(idInmueble) as Array<ObraInmuebleState>)
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
