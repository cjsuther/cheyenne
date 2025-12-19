import ReciboPublicacionLote from '../entities/recibo-publicacion-lote';
import IReciboPublicacionLoteRepository from '../repositories/recibo-publicacion-lote-repository';
import { isValidString, isValidDate, isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ReciboPublicacionService from './recibo-publicacion-service';
import ReciboAperturaService from './recibo-apertura-service';
import ReciboPublicacion from '../entities/recibo-publicacion';
import ReciboApertura from '../entities/recibo-apertura';
import CodigoBarrasCliente from '../entities/codigo-barras-cliente';
import CodigoBarrasClienteService from './codigo-barras-cliente-service';

export default class ReciboPublicacionLoteService {

	reciboPublicacionLoteRepository: IReciboPublicacionLoteRepository;
	reciboPublicacionService: ReciboPublicacionService;
	reciboAperturaService: ReciboAperturaService;
	codigoBarrasClienteService: CodigoBarrasClienteService;

	constructor(reciboPublicacionLoteRepository: IReciboPublicacionLoteRepository,
				reciboPublicacionService: ReciboPublicacionService,
                reciboAperturaService: ReciboAperturaService,
				codigoBarrasClienteService: CodigoBarrasClienteService
	) {
		this.reciboPublicacionLoteRepository = reciboPublicacionLoteRepository;
		this.reciboPublicacionService = reciboPublicacionService;
		this.reciboAperturaService = reciboAperturaService;
		this.codigoBarrasClienteService = codigoBarrasClienteService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboPublicacionLoteRepository.list();
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
				const result = await this.reciboPublicacionLoteRepository.findById(id);
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

	async addLote(reciboPublicacionLote: ReciboPublicacionLote) {
		const resultTransaction = this.reciboPublicacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const {id: idReciboPublicacionLote} = await this.reciboPublicacionLoteRepository.add(reciboPublicacionLote) as ReciboPublicacionLote;
					for (let r=0; r<reciboPublicacionLote.recibosPublicacion.length; r++) {
						const reciboPublicacion = reciboPublicacionLote.recibosPublicacion[r] as ReciboPublicacion;
						reciboPublicacion.idReciboPublicacionLote = idReciboPublicacionLote;
						const {id: idReciboPublicacion} = await this.reciboPublicacionService.add(reciboPublicacion) as ReciboPublicacion;

						for (let a=0; a<reciboPublicacion.recibosApertura.length; a++) {
							const reciboApertura = reciboPublicacion.recibosApertura[a] as ReciboApertura;
							reciboApertura.idReciboPublicacion = idReciboPublicacion;
							await this.reciboAperturaService.add(reciboApertura);
						}

						for (let c=0; c<reciboPublicacion.codigosBarrasCliente.length; c++) {
							const codigoBarrasCliente = reciboPublicacion.codigosBarrasCliente[c] as CodigoBarrasCliente;
							codigoBarrasCliente.codigoBarras = reciboPublicacion.codigoBarras;
							await this.codigoBarrasClienteService.add(codigoBarrasCliente);
						}
					}

					resolve(idReciboPublicacionLote);
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

	async add(reciboPublicacionLote: ReciboPublicacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(reciboPublicacionLote.numeroLote, true) ||
					!isValidDate(reciboPublicacionLote.fechaLote, true) ||
					!isValidInteger(reciboPublicacionLote.casos, true) ||
					!isValidFloat(reciboPublicacionLote.importeTotal1, true) ||
					!isValidFloat(reciboPublicacionLote.importeTotal2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				reciboPublicacionLote.id = null;
				const result = await this.reciboPublicacionLoteRepository.add(reciboPublicacionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, reciboPublicacionLote: ReciboPublicacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(reciboPublicacionLote.numeroLote, true) ||
					!isValidDate(reciboPublicacionLote.fechaLote, true) ||
					!isValidInteger(reciboPublicacionLote.casos, true) ||
					!isValidFloat(reciboPublicacionLote.importeTotal1, true) ||
					!isValidFloat(reciboPublicacionLote.importeTotal2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.reciboPublicacionLoteRepository.modify(id, reciboPublicacionLote);
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
				const result = await this.reciboPublicacionLoteRepository.remove(id);
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
