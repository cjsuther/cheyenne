import ObraInmuebleDetalle from '../entities/obra-inmueble-detalle';
import IObraInmuebleDetalleRepository from '../repositories/obra-inmueble-detalle-repository';
import { isValidInteger, isValidBoolean, isValidString, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ObraInmuebleDetalleService {

	obraInmuebleDetalleRepository: IObraInmuebleDetalleRepository;

	constructor(obraInmuebleDetalleRepository: IObraInmuebleDetalleRepository) {
		this.obraInmuebleDetalleRepository = obraInmuebleDetalleRepository;
	}

	async listByObraInmueble(idObraInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.obraInmuebleDetalleRepository.listByObraInmueble(idObraInmueble);
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
				const result = await this.obraInmuebleDetalleRepository.findById(id);
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

	async add(obraInmuebleDetalle: ObraInmuebleDetalle) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(obraInmuebleDetalle.idObraInmueble, true) ||
					!isValidInteger(obraInmuebleDetalle.idTipoObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idDestinoObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idFormaPresentacionObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idFormaCalculoObra, true) ||
					!isValidBoolean(obraInmuebleDetalle.sujetoDemolicion) ||
					!isValidBoolean(obraInmuebleDetalle.generarSuperficie) ||
					!isValidString(obraInmuebleDetalle.tipoSuperficie, true) ||
					!isValidString(obraInmuebleDetalle.descripcion, true) ||
					!isValidFloat(obraInmuebleDetalle.valor, true) ||
					!isValidFloat(obraInmuebleDetalle.alicuota, true) ||
					!isValidFloat(obraInmuebleDetalle.metros, true) ||
					!isValidFloat(obraInmuebleDetalle.montoPresupuestado, true) ||
					!isValidFloat(obraInmuebleDetalle.montoCalculado, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				obraInmuebleDetalle.id = null;
				const result = await this.obraInmuebleDetalleRepository.add(obraInmuebleDetalle);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, obraInmuebleDetalle: ObraInmuebleDetalle) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(obraInmuebleDetalle.idObraInmueble, true) ||
					!isValidInteger(obraInmuebleDetalle.idTipoObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idDestinoObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idFormaPresentacionObra, true) ||
					!isValidInteger(obraInmuebleDetalle.idFormaCalculoObra, true) ||
					!isValidBoolean(obraInmuebleDetalle.sujetoDemolicion) ||
					!isValidBoolean(obraInmuebleDetalle.generarSuperficie) ||
					!isValidString(obraInmuebleDetalle.tipoSuperficie, true) ||
					!isValidString(obraInmuebleDetalle.descripcion, true) ||
					!isValidFloat(obraInmuebleDetalle.valor, true) ||
					!isValidFloat(obraInmuebleDetalle.alicuota, true) ||
					!isValidFloat(obraInmuebleDetalle.metros, true) ||
					!isValidFloat(obraInmuebleDetalle.montoPresupuestado, true) ||
					!isValidFloat(obraInmuebleDetalle.montoCalculado, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.obraInmuebleDetalleRepository.modify(id, obraInmuebleDetalle);
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
				const result = await this.obraInmuebleDetalleRepository.remove(id);
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
