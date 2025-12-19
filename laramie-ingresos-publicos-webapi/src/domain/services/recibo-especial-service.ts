import ReciboEspecial from '../entities/recibo-especial';
import IReciboEspecialRepository from '../repositories/recibo-especial-repository';
import { isValidString, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ReciboEspecialDTO from '../dto/recibo-especial-dto';
import ReciboEspecialConcepto from '../entities/recibo-especial-concepto';
import ReciboEspecialConceptoService from './recibo-especial-concepto-service';
import ReciboEspecialConceptoState from '../dto/recibo-especial-concepto-state';

export default class ReciboEspecialService {

	reciboEspecialRepository: IReciboEspecialRepository;
	reciboEspecialConceptoService: ReciboEspecialConceptoService;

	constructor(reciboEspecialRepository: IReciboEspecialRepository,
		reciboEspecialConceptoService: ReciboEspecialConceptoService) {
		this.reciboEspecialRepository = reciboEspecialRepository;
		this.reciboEspecialConceptoService = reciboEspecialConceptoService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboEspecialRepository.list();
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
				let reciboEspecialDTO = new ReciboEspecialDTO();
				reciboEspecialDTO.reciboEspecial = await this.reciboEspecialRepository.findById(id) as ReciboEspecial;
				if (!reciboEspecialDTO.reciboEspecial) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				reciboEspecialDTO.recibosEspecialConcepto = await this.reciboEspecialConceptoService.listByReciboEspecial(id) as Array<ReciboEspecialConceptoState>;

				resolve(reciboEspecialDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(reciboEspecialDTO: ReciboEspecialDTO) {
		const resultTransaction = this.reciboEspecialRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let reciboEspecial = reciboEspecialDTO.reciboEspecial;
					if (
						!isValidString(reciboEspecial.codigo, true) ||
						!isValidString(reciboEspecial.descripcion, true) ||
						!isValidBoolean(reciboEspecial.aplicaValorUF )
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}
					
					reciboEspecial.id = null;

					reciboEspecialDTO.reciboEspecial = await this.reciboEspecialRepository.add(reciboEspecialDTO.reciboEspecial);
					this.findById(reciboEspecialDTO.reciboEspecial.id).then(resolve).catch(reject);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, reciboEspecialDTO: ReciboEspecialDTO) {
		const resultTransaction = this.reciboEspecialRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let reciboEspecial = reciboEspecialDTO.reciboEspecial;
					if (
						!isValidString(reciboEspecial.codigo, true) ||
						!isValidString(reciboEspecial.descripcion, true) ||
						!isValidBoolean(reciboEspecial.aplicaValorUF )
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					reciboEspecialDTO.reciboEspecial = await this.reciboEspecialRepository.modify(id, reciboEspecialDTO.reciboEspecial);
					if (!reciboEspecialDTO) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					                    
					let requests = [];
					
					reciboEspecialDTO.recibosEspecialConcepto.forEach(row => {
                        if (row.state === 'a') {
                            requests.push(this.reciboEspecialConceptoService.add(row as ReciboEspecialConcepto));
                        }
                        else if (row.state === 'm') {
                            requests.push(this.reciboEspecialConceptoService.modify(row.id, row as ReciboEspecialConcepto));
                        }
                        else if (row.state === 'r') {
                            requests.push(this.reciboEspecialConceptoService.remove(row.id));
                        }
                    });

					Promise.all(requests)
					.then(responses => {
						this.findById(reciboEspecialDTO.reciboEspecial.id).then(resolve).catch(reject);
					})
					.catch(reject);
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
        const resultTransaction = this.reciboEspecialRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    const reciboEspecial = await this.reciboEspecialRepository.findById(id) as ReciboEspecial;
                    if (!reciboEspecial) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

					await this.reciboEspecialConceptoService.removeByReciboEspecial(id);

                    const result = await this.reciboEspecialRepository.remove(id);
					resolve(result);
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

}
