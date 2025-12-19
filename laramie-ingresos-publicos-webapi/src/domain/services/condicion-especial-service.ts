import CondicionEspecial from '../entities/condicion-especial';
import CondicionEspecialState from '../dto/condicion-especial-state';
import ICondicionEspecialRepository from '../repositories/condicion-especial-repository';
import TipoCondicionEspecialService from './tipo-condicion-especial-service';
import { isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import TipoCondicionEspecial from '../entities/tipo-condicion-especial';

export default class CondicionEspecialService {

	condicionEspecialRepository: ICondicionEspecialRepository;
	tipoCondicionEspecialService: TipoCondicionEspecialService;

	constructor(condicionEspecialRepository: ICondicionEspecialRepository, tipoCondicionEspecialService: TipoCondicionEspecialService) {
		this.condicionEspecialRepository = condicionEspecialRepository;
		this.tipoCondicionEspecialService = tipoCondicionEspecialService;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.condicionEspecialRepository.listByCuenta(idCuenta) as Array<CondicionEspecialState>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByTipoCondicionEspecial(codigoTipoCondicionEspecial: string) {
		return new Promise( async (resolve, reject) => {
			try {
				const tipoCondicionEspecial = await this.tipoCondicionEspecialService.findByCodigo(codigoTipoCondicionEspecial) as TipoCondicionEspecial;
				if (tipoCondicionEspecial) {
					const result = await this.condicionEspecialRepository.listByTipoCondicionEspecial(tipoCondicionEspecial.id) as Array<CondicionEspecial>;
					resolve(result);
				}
				else {
					resolve([]);
				}
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.condicionEspecialRepository.findById(id);
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

	async add(condicionEspecial: CondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(condicionEspecial.idCuenta, true) ||
					!isValidInteger(condicionEspecial.idTipoCondicionEspecial, true) ||
					!isValidDate(condicionEspecial.fechaDesde, true) ||
					!isValidDate(condicionEspecial.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				condicionEspecial.id = null;
				const result = await this.condicionEspecialRepository.add(condicionEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, condicionEspecial: CondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(condicionEspecial.idCuenta, true) ||
					!isValidInteger(condicionEspecial.idTipoCondicionEspecial, true) ||
					!isValidDate(condicionEspecial.fechaDesde, true) ||
					!isValidDate(condicionEspecial.fechaHasta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.condicionEspecialRepository.modify(id, condicionEspecial);
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
				const result = await this.condicionEspecialRepository.remove(id);
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
				const result = await this.condicionEspecialRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}