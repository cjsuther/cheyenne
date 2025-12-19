import VinculoVehiculo from '../entities/vinculo-vehiculo';
import VinculoVehiculoState from '../dto/vinculo-vehiculo-state';
import IVinculoVehiculoRepository from '../repositories/vinculo-vehiculo-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoVehiculoService {

	vinculoVehiculoRepository: IVinculoVehiculoRepository;

	constructor(vinculoVehiculoRepository: IVinculoVehiculoRepository) {
		this.vinculoVehiculoRepository = vinculoVehiculoRepository;
	}

	async listByVehiculo(idVehiculo: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoVehiculoRepository.listByVehiculo(idVehiculo) as Array<VinculoVehiculoState>).sort(
					(a, b) => (a.idTipoVinculoVehiculo !== b.idTipoVinculoVehiculo) ? a.idTipoVinculoVehiculo - b.idTipoVinculoVehiculo : a.id - b.id
				);
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
				const result = await this.vinculoVehiculoRepository.findById(id);
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

	async add(vinculoVehiculo: VinculoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoVehiculo.idVehiculo, true) ||
					!isValidInteger(vinculoVehiculo.idTipoVinculoVehiculo, true) ||
					!isValidInteger(vinculoVehiculo.idPersona, true) ||
					!isValidInteger(vinculoVehiculo.idTipoInstrumento, false) ||
					!isValidDate(vinculoVehiculo.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoVehiculo.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoVehiculo.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoVehiculo.id = null;
				if (vinculoVehiculo.idTipoInstrumento === 0) vinculoVehiculo.idTipoInstrumento = null;
				const result = await this.vinculoVehiculoRepository.add(vinculoVehiculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoVehiculo: VinculoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoVehiculo.idVehiculo, true) ||
					!isValidInteger(vinculoVehiculo.idTipoVinculoVehiculo, true) ||
					!isValidInteger(vinculoVehiculo.idPersona, true) ||
					!isValidInteger(vinculoVehiculo.idTipoInstrumento, false) ||
					!isValidDate(vinculoVehiculo.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoVehiculo.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoVehiculo.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoVehiculo.idTipoInstrumento === 0) vinculoVehiculo.idTipoInstrumento = null;
				const result = await this.vinculoVehiculoRepository.modify(id, vinculoVehiculo);
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
				const result = await this.vinculoVehiculoRepository.remove(id);
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

	async removeByVehiculo(idVehiculo: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.vinculoVehiculoRepository.removeByVehiculo(idVehiculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
