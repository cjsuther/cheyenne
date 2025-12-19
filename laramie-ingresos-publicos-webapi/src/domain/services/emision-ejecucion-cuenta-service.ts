import EmisionEjecucionCuenta from '../entities/emision-ejecucion-cuenta';
import EmisionEjecucionCuentaResume from '../dto/emision-ejecucion-cuenta-resume';
import EmisionEjecucion from '../entities/emision-ejecucion';

import Cuenta from '../entities/cuenta';
import EmisionEjecucionCuentaDTO from '../dto/emision-ejecucion-cuenta-dto';
import EmisionCuota from '../entities/emision-cuota';
import EmisionCalculo from '../entities/emision-calculo';
import EmisionConcepto from '../entities/emision-concepto';
import EmisionCuentaCorriente from '../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../entities/emision-imputacion-contable';

import IEmisionEjecucionCuentaRepository from '../repositories/emision-ejecucion-cuenta-repository';
import IEmisionEjecucionRepository from '../repositories/emision-ejecucion-repository';
import ICuentaRepository from '../repositories/cuenta-repository';
import EmisionCuotaService from './emision-cuota-service';
import EmisionCalculoService from './emision-calculo-service';
import EmisionCalculoResultadoService from './emision-calculo-resultado-service';
import EmisionConceptoService from './emision-concepto-service';
import EmisionConceptoResultadoService from './emision-concepto-resultado-service';
import EmisionCuentaCorrienteService from './emision-cuenta-corriente-service';
import EmisionCuentaCorrienteResultadoService from './emision-cuenta-corriente-resultado-service';
import EmisionImputacionContableService from './emision-imputacion-contable-service';
import EmisionImputacionContableResultadoService from './emision-imputacion-contable-resultado-service';
import EmisionEjecucionCuotaService from "./emision-ejecucion-cuota-service";


import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import EmisionEjecucionCuentaPublicacion from '../dto/emision-ejecucion-cuenta-publicacion';


export default class EmisionEjecucionCuentaService {

	emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository;
	emisionEjecucionRepository: IEmisionEjecucionRepository;
	cuentaRepository: ICuentaRepository;
	emisionCuotaService: EmisionCuotaService;
	emisionCalculoService: EmisionCalculoService;
	emisionCalculoResultadoService: EmisionCalculoResultadoService;
	emisionConceptoService: EmisionConceptoService;
	emisionConceptoResultadoService: EmisionConceptoResultadoService;
	emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
	emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService;
	emisionImputacionContableService: EmisionImputacionContableService;
	emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService;
	emisionEjecucionCuotaService: EmisionEjecucionCuotaService;


	constructor(emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository,
				emisionEjecucionRepository: IEmisionEjecucionRepository,
				cuentaRepository: ICuentaRepository,
				emisionCuotaService: EmisionCuotaService,
				emisionCalculoService: EmisionCalculoService,
				emisionCalculoResultadoService: EmisionCalculoResultadoService,
				emisionConceptoService: EmisionConceptoService,
				emisionConceptoResultadoService: EmisionConceptoResultadoService,
				emisionCuentaCorrienteService: EmisionCuentaCorrienteService,
				emisionCuentaCorrienteResultadoService: EmisionCuentaCorrienteResultadoService,
				emisionImputacionContableService: EmisionImputacionContableService,
				emisionImputacionContableResultadoService: EmisionImputacionContableResultadoService,
				emisionEjecucionCuotaService: EmisionEjecucionCuotaService)
	{
		this.emisionEjecucionRepository = emisionEjecucionRepository;
		this.emisionEjecucionCuentaRepository = emisionEjecucionCuentaRepository;
		this.cuentaRepository = cuentaRepository;
		this.emisionCuotaService = emisionCuotaService;
		this.emisionCalculoResultadoService = emisionCalculoResultadoService;
		this.emisionCalculoService = emisionCalculoService;
		this.emisionConceptoService = emisionConceptoService;
		this.emisionConceptoResultadoService = emisionConceptoResultadoService;
		this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
		this.emisionCuentaCorrienteResultadoService = emisionCuentaCorrienteResultadoService;
		this.emisionImputacionContableService = emisionImputacionContableService;
		this.emisionImputacionContableResultadoService = emisionImputacionContableResultadoService;
		this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
	}

	async listResume(idEmisionEjecucion: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.emisionEjecucionCuentaRepository.listResume(idEmisionEjecucion) as Array<EmisionEjecucionCuentaResume>);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listPublicacion(idEmisionEjecucion: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.emisionEjecucionCuentaRepository.listPublicacion(idEmisionEjecucion) as Array<EmisionEjecucionCuentaPublicacion>);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuentaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuentaRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionEjecucionCuentaRepository.findById(id);
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

	async findByNumero(idEmisionEjecucion: number, numero: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let emisionEjecucionCuentaDTO = new EmisionEjecucionCuentaDTO();
				let emisionEjecucionCuenta = await this.emisionEjecucionCuentaRepository.findByNumero(idEmisionEjecucion, numero) as EmisionEjecucionCuenta;
				if (emisionEjecucionCuenta) {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(emisionEjecucionCuenta.idEmisionEjecucion) as EmisionEjecucion;
					emisionEjecucionCuentaDTO.emisionEjecucionCuenta = emisionEjecucionCuenta;
					emisionEjecucionCuentaDTO.cuenta = await this.cuentaRepository.findById(emisionEjecucionCuentaDTO.emisionEjecucionCuenta.idCuenta) as Cuenta;
					emisionEjecucionCuentaDTO.emisionCuotas = await this.emisionCuotaService.listByEmisionEjecucion(emisionEjecucion.id) as Array<EmisionCuota>;
					emisionEjecucionCuentaDTO.emisionCalculos = await this.emisionCalculoService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCalculo>;
					emisionEjecucionCuentaDTO.emisionConceptos = await this.emisionConceptoService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionConcepto>;
					emisionEjecucionCuentaDTO.emisionCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCuentaCorriente>;
					emisionEjecucionCuentaDTO.emisionImputacionesContables = await this.emisionImputacionContableService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionImputacionContable>;
				}
				resolve(emisionEjecucionCuentaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByCuenta(idEmisionEjecucion: number, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let emisionEjecucionCuentaDTO = new EmisionEjecucionCuentaDTO();
				let emisionEjecucionCuenta = await this.emisionEjecucionCuentaRepository.findByCuenta(idEmisionEjecucion, idCuenta) as EmisionEjecucionCuenta;
				if (emisionEjecucionCuenta) {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(emisionEjecucionCuenta.idEmisionEjecucion) as EmisionEjecucion;
					emisionEjecucionCuentaDTO.emisionEjecucionCuenta = emisionEjecucionCuenta;
					emisionEjecucionCuentaDTO.cuenta = await this.cuentaRepository.findById(emisionEjecucionCuentaDTO.emisionEjecucionCuenta.idCuenta) as Cuenta;
					emisionEjecucionCuentaDTO.emisionCuotas = await this.emisionCuotaService.listByEmisionEjecucion(emisionEjecucion.id) as Array<EmisionCuota>;
					emisionEjecucionCuentaDTO.emisionCalculos = await this.emisionCalculoService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCalculo>;
					emisionEjecucionCuentaDTO.emisionConceptos = await this.emisionConceptoService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionConcepto>;
					emisionEjecucionCuentaDTO.emisionCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCuentaCorriente>;
					emisionEjecucionCuentaDTO.emisionImputacionesContables = await this.emisionImputacionContableService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionImputacionContable>;
				}
				resolve(emisionEjecucionCuentaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(emisionEjecucionCuenta: EmisionEjecucionCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionEjecucionCuenta.idEmisionEjecucion, true) ||
					!isValidInteger(emisionEjecucionCuenta.idCuenta, true) ||
					!isValidInteger(emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionEjecucionCuenta.numero, true) ||
					!isValidInteger(emisionEjecucionCuenta.numeroBloque, true) ||
					!isValidString(emisionEjecucionCuenta.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionEjecucionCuenta.id = null;
				const result = await this.emisionEjecucionCuentaRepository.add(emisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByBloque(numeroBloque:number, emisionEjecucionCuentas: Array<EmisionEjecucionCuenta>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuentaRepository.addByBloque(numeroBloque, emisionEjecucionCuentas);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionEjecucionCuenta: EmisionEjecucionCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionEjecucionCuenta.idEmisionEjecucion, true) ||
					!isValidInteger(emisionEjecucionCuenta.idCuenta, true) ||
					!isValidInteger(emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionEjecucionCuenta.numero, true) ||
					!isValidInteger(emisionEjecucionCuenta.numeroBloque, true) ||
					!isValidString(emisionEjecucionCuenta.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionEjecucionCuentaRepository.modify(id, emisionEjecucionCuenta);
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

	async modifyByEmisionEjecucion(updates:Array<any>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuentaRepository.modifyByEmisionEjecucion(updates);
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
				await this.emisionCalculoResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionConceptoResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionCuentaCorrienteResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionImputacionContableResultadoService.removeByEmisionEjecucionCuenta(id);
				const result = await this.emisionEjecucionCuentaRepository.remove(id);
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

	async removeChildren(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				await this.emisionCalculoResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionConceptoResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionCuentaCorrienteResultadoService.removeByEmisionEjecucionCuenta(id);
				await this.emisionImputacionContableResultadoService.removeByEmisionEjecucionCuenta(id);
				const result = await this.emisionEjecucionCuentaRepository.findById(id);
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

	async removeByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				await this.emisionCalculoResultadoService.removeByEmisionEjecucion(idEmisionEjecucion);
				await this.emisionConceptoResultadoService.removeByEmisionEjecucion(idEmisionEjecucion);
				await this.emisionCuentaCorrienteResultadoService.removeByEmisionEjecucion(idEmisionEjecucion);
				await this.emisionImputacionContableResultadoService.removeByEmisionEjecucion(idEmisionEjecucion);
				await this.emisionEjecucionCuotaService.removeByEmisionEjecucion(idEmisionEjecucion);
				await this.emisionEjecucionCuentaRepository.removeByEmisionEjecucion(idEmisionEjecucion);
				resolve(idEmisionEjecucion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
