import ZonaEntrega from '../entities/zona-entrega';
import ZonaEntregaState from '../dto/zona-entrega-state';
import IZonaEntregaRepository from '../repositories/zona-entrega-repository';
import IDireccionRepository from '../repositories/direccion-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ZonaEntregaService {

	zonaEntregaRepository: IZonaEntregaRepository;
	direccionRepository: IDireccionRepository;

	constructor(zonaEntregaRepository: IZonaEntregaRepository,
				direccionRepository: IDireccionRepository) {
		this.zonaEntregaRepository = zonaEntregaRepository;
		this.direccionRepository = direccionRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.zonaEntregaRepository.listByCuenta(idCuenta) as Array<ZonaEntregaState>).sort((a, b) => a.id - b.id);
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
				const result = await this.zonaEntregaRepository.findById(id);
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

	async add(zonaEntrega: ZonaEntrega) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(zonaEntrega.idCuenta, true) ||
					!isValidInteger(zonaEntrega.idTipoControlador, true) ||
					!isValidString(zonaEntrega.email, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				zonaEntrega.id = null;
				const result = await this.zonaEntregaRepository.add(zonaEntrega);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, zonaEntrega: ZonaEntrega) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(zonaEntrega.idCuenta, true) ||
					!isValidInteger(zonaEntrega.idTipoControlador, true) ||
					!isValidString(zonaEntrega.email, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.zonaEntregaRepository.modify(id, zonaEntrega);
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
				await this.direccionRepository.removeByEntidad('ZonaEntrega', id);
				const result = await this.zonaEntregaRepository.remove(id);
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

	async removeByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const list = (await this.zonaEntregaRepository.listByCuenta(idCuenta) as Array<ZonaEntregaState>)
				for (let i=0; i<list.length; i++) {
					const row = list[i];
					await this.remove(row.id);
				}
				resolve(idCuenta);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
