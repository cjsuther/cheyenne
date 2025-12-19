import ReciboPublicacion from '../entities/recibo-publicacion';
import IReciboPublicacionRepository from '../repositories/recibo-publicacion-repository';
import { isValidInteger, isValidString, isValidFloat, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CodigoBarrasClienteService from './codigo-barras-cliente-service';
import CodigoBarrasCliente from '../entities/codigo-barras-cliente';

export default class ReciboPublicacionService {

	reciboPublicacionRepository: IReciboPublicacionRepository;
	codigoBarrasClienteService: CodigoBarrasClienteService;

	constructor(reciboPublicacionRepository: IReciboPublicacionRepository, codigoBarrasClienteService: CodigoBarrasClienteService) {
		this.reciboPublicacionRepository = reciboPublicacionRepository;
		this.codigoBarrasClienteService = codigoBarrasClienteService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboPublicacionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByNumeros(codigoDelegacion:string, numerosRecibo:number[]) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboPublicacionRepository.listByNumeros(codigoDelegacion, numerosRecibo);
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
				const result = await this.reciboPublicacionRepository.findById(id);
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

	async findByCuentaPago(idCuentaPago: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.reciboPublicacionRepository.findByCuentaPago(idCuentaPago);
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

	async findByNumero(codigoDelegacion: string, numeroRecibo: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.reciboPublicacionRepository.findByNumero(codigoDelegacion, numeroRecibo);
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

	async findByCodigoBarrasCliente(codigoBarrasCliente: string) {
		return new Promise( async (resolve, reject) => {
			try {
				const codigoBarrasInterno = await this.codigoBarrasClienteService.findByCodigoBarrasCliente(codigoBarrasCliente) as CodigoBarrasCliente;
				const result = await this.reciboPublicacionRepository.findByCodigoBarras(codigoBarrasInterno.codigoBarras);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				if (error instanceof ReferenceError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async add(reciboPublicacion: ReciboPublicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboPublicacion.idReciboPublicacionLote, true) ||
					!isValidInteger(reciboPublicacion.idCuentaPago, true) ||
					!isValidString(reciboPublicacion.codigoTipoTributo, true) ||
					!isValidString(reciboPublicacion.numeroCuenta, true) ||
					!isValidString(reciboPublicacion.codigoDelegacion, true) ||
					!isValidInteger(reciboPublicacion.numeroRecibo, true) ||
					!isValidString(reciboPublicacion.periodo, true) ||
					!isValidInteger(reciboPublicacion.cuota, false) ||
					!isValidFloat(reciboPublicacion.importeVencimiento1, true) ||
					!isValidFloat(reciboPublicacion.importeVencimiento2, true) ||
					!isValidDate(reciboPublicacion.fechaVencimiento1, true) ||
					!isValidDate(reciboPublicacion.fechaVencimiento2, true) ||
					!isValidString(reciboPublicacion.codigoBarras, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				reciboPublicacion.id = null;
				if (reciboPublicacion.idPagoRendicion === 0) reciboPublicacion.idPagoRendicion = null;
				const result = await this.reciboPublicacionRepository.add(reciboPublicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, reciboPublicacion: ReciboPublicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboPublicacion.idReciboPublicacionLote, true) ||
					!isValidInteger(reciboPublicacion.idCuentaPago, true) ||
					!isValidString(reciboPublicacion.codigoTipoTributo, true) ||
					!isValidString(reciboPublicacion.numeroCuenta, true) ||
					!isValidString(reciboPublicacion.codigoDelegacion, true) ||
					!isValidInteger(reciboPublicacion.numeroRecibo, true) ||
					!isValidString(reciboPublicacion.periodo, true) ||
					!isValidInteger(reciboPublicacion.cuota, false) ||
					!isValidFloat(reciboPublicacion.importeVencimiento1, true) ||
					!isValidFloat(reciboPublicacion.importeVencimiento2, true) ||
					!isValidDate(reciboPublicacion.fechaVencimiento1, true) ||
					!isValidDate(reciboPublicacion.fechaVencimiento2, true) ||
					!isValidString(reciboPublicacion.codigoBarras, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (reciboPublicacion.idPagoRendicion === 0) reciboPublicacion.idPagoRendicion = null;
				const result = await this.reciboPublicacionRepository.modify(id, reciboPublicacion);
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
				const result = await this.reciboPublicacionRepository.remove(id);
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
