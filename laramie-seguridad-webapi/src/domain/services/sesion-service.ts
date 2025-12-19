import Sesion from '../entities/sesion';
import ISesionRepository from '../repositories/sesion-repository';
import { isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import Config from '../../server/configuration/config';



export default class SesionService {

	sesionRepository: ISesionRepository;

	constructor(sesionRepository: ISesionRepository) {
		this.sesionRepository = sesionRepository;
	}

	async findByToken(token: string) {
		return new Promise( async (resolve, reject) => {
			try {				
				const sesion = await this.sesionRepository.findByToken(token) as Sesion;
				if (!sesion) {
					reject(new UnauthorizedError("Sesión inexistente"));
					return;
				}

				var now = new Date();
                var sesionFechaVencimiento = new Date(sesion.fechaVencimiento);

				if (sesionFechaVencimiento.getTime() > now.getTime()){
                    var sesionAddMsSeconds = Config.SESION_TIME;
					var delayTime = Config.DELAY_UPDATE_SESION;
					var newVencimiento = new Date(now.getTime() + sesionAddMsSeconds);
                    sesion.fechaVencimiento = newVencimiento;

                    if ((sesionFechaVencimiento.getTime() - now.getTime()) < (sesionAddMsSeconds - delayTime)){					
						const updateSesion = new Sesion(sesion.id, sesion.token, newVencimiento, sesion.fechaCreacion);
                        this.modify(sesion.id, updateSesion).catch(error => {
                            reject(error);
                        });
					}

					resolve(sesion);
				} else {
					reject(new UnauthorizedError("Sesión vencida"));
				}

			} catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(sesion: Sesion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(sesion.token, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				let now = new Date();
				var sesionTime = Config.SESION_TIME;
                var expirationDate = new Date(now.getTime() + sesionTime);

				sesion.id = null;
				sesion.fechaCreacion = now;
				sesion.fechaVencimiento = expirationDate
				const result = await this.sesionRepository.add(sesion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, sesion: Sesion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(sesion.token, true) ||
					!isValidDate(sesion.fechaVencimiento, true) ||
					!isValidDate(sesion.fechaCreacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.sesionRepository.modify(id, sesion);
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

	async expirateSesion(token: string) {
		return new Promise( async (resolve, reject) => {
			try {				
				const sesion = await this.sesionRepository.findByToken(token);
				if (!sesion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const expirationDate = new Date();

				const updateSesion = new Sesion(sesion.id, sesion.token, expirationDate, sesion.fechaCreacion);
				this.modify(sesion.id, updateSesion).catch(error => {
					reject(error);
				});

				resolve(sesion);
			} catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
