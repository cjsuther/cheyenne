import ReciboApertura from '../entities/recibo-apertura';
import IReciboAperturaRepository from '../repositories/recibo-apertura-repository';
import { isValidInteger, isValidString, isValidFloat, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ReciboAperturaAgrupado from '../dto/recibo-apertura-agrupado';
import TasaService from './tasa-service';
import TipoMovimiento from '../entities/tipo-movimiento';

export default class ReciboAperturaService {

	reciboAperturaRepository: IReciboAperturaRepository;
	tasaService: TasaService;

	constructor(reciboAperturaRepository: IReciboAperturaRepository, tasaService: TasaService) {
		this.reciboAperturaRepository = reciboAperturaRepository;
		this.tasaService = tasaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboAperturaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByReciboPublicacion(idReciboPublicacion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboAperturaRepository.listByReciboPublicacion(idReciboPublicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByReciboPublicacionAgrupado(token: string, idReciboPublicacion: number, corteCuota: boolean) {
		return new Promise( async (resolve, reject) => {
			try {
				const aperturas = await this.reciboAperturaRepository.listByReciboPublicacion(idReciboPublicacion) as ReciboApertura[];
				const aperturasImpCont = aperturas.filter(f => f.importeImputacionContable > 0);
				const tipoMovimientos = await this.tasaService.listTipoMovimiento(token) as TipoMovimiento[];
				const codigoTipoMovimientoHaber = tipoMovimientos.filter(f => ['H','F'].includes(f.imputacion)).map(x => x.codigo);
				const sortApertura = (a:ReciboApertura,b:ReciboApertura) => 
					(a.periodo !== b.periodo) ? a.periodo.localeCompare(b.periodo) :
						(corteCuota && a.cuota !== b.cuota) ? a.cuota - b.cuota :
							(a.codigoTasa !== b.codigoTasa) ? a.codigoTasa.localeCompare(b.codigoTasa) :
								(a.codigoSubTasa !== b.codigoSubTasa) ? a.codigoSubTasa.localeCompare(b.codigoSubTasa) :
									a.codigoTipoMovimiento.localeCompare(b.codigoTipoMovimiento);
				aperturasImpCont.sort(sortApertura);

				let importe1 = 0;
				let importe2 = 0;
				const aperturasAgrupado:ReciboAperturaAgrupado[] = [];
				for (let i=0; i<aperturasImpCont.length; i++) {
					const apertura = aperturasImpCont[i];
					const importe = (codigoTipoMovimientoHaber.includes(apertura.codigoTipoMovimiento)) ? (-1)*apertura.importeImputacionContable : apertura.importeImputacionContable;
					if ([0,1].includes(apertura.vencimiento)) importe1 += importe;
					if ([0,2].includes(apertura.vencimiento)) importe2 += importe;
					
					if (i === (aperturasImpCont.length - 1) || //ultimo
						aperturasImpCont[i].periodo !== aperturasImpCont[i+1].periodo ||
						corteCuota && aperturasImpCont[i].cuota !== aperturasImpCont[i+1].cuota ||
						aperturasImpCont[i].codigoTasa !== aperturasImpCont[i+1].codigoTasa ||
						aperturasImpCont[i].codigoSubTasa !== aperturasImpCont[i+1].codigoSubTasa)
					{
						const aperturaAgrupado = new ReciboAperturaAgrupado();
						aperturaAgrupado.idReciboPublicacion = apertura.idReciboPublicacion;
						aperturaAgrupado.codigoTasa = apertura.codigoTasa;
						aperturaAgrupado.codigoSubTasa = apertura.codigoSubTasa;
						aperturaAgrupado.periodo = apertura.periodo;
						aperturaAgrupado.cuota = corteCuota ? apertura.cuota : 0;
						aperturaAgrupado.importe1 = importe1;
						aperturaAgrupado.importe2 = importe2;
						aperturasAgrupado.push(aperturaAgrupado);
						importe1 = 0;
						importe2 = 0;
					}
				}

				resolve(aperturasAgrupado);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.reciboAperturaRepository.findById(id);
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

	async add(reciboApertura: ReciboApertura) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboApertura.idReciboPublicacion, true) ||
					!isValidString(reciboApertura.codigoRubro, false) ||
					!isValidString(reciboApertura.codigoTasa, true) ||
					!isValidString(reciboApertura.codigoSubTasa, true) ||
					!isValidString(reciboApertura.codigoTipoMovimiento, true) ||
					!isValidString(reciboApertura.periodo, true) ||
					!isValidInteger(reciboApertura.cuota, false) ||
					!isValidFloat(reciboApertura.importeCancelar, false) ||
					!isValidFloat(reciboApertura.importeImputacionContable, false) ||
					!isValidString(reciboApertura.numeroCertificadoApremio, false) ||
					!isValidInteger(reciboApertura.vencimiento, false) ||
					!isValidDate(reciboApertura.fechaVencimiento, true) ||
					!isValidString(reciboApertura.numeroEmision, false) ||
					!isValidString(reciboApertura.tipoNovedad, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (reciboApertura.importeCancelar === 0 && reciboApertura.importeImputacionContable === 0) {
					reject(new ValidationError('La apertura debe tener un importe mayor a cero'));
					return;
				}

				reciboApertura.id = null;
				const result = await this.reciboAperturaRepository.add(reciboApertura);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, reciboApertura: ReciboApertura) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(reciboApertura.idReciboPublicacion, true) ||
					!isValidString(reciboApertura.codigoRubro, false) ||
					!isValidString(reciboApertura.codigoTasa, true) ||
					!isValidString(reciboApertura.codigoSubTasa, true) ||
					!isValidString(reciboApertura.codigoTipoMovimiento, true) ||
					!isValidString(reciboApertura.periodo, true) ||
					!isValidInteger(reciboApertura.cuota, false) ||
					!isValidFloat(reciboApertura.importeCancelar, false) ||
					!isValidFloat(reciboApertura.importeImputacionContable, false) ||
					!isValidString(reciboApertura.numeroCertificadoApremio, false) ||
					!isValidInteger(reciboApertura.vencimiento, false) ||
					!isValidDate(reciboApertura.fechaVencimiento, true) ||
					!isValidString(reciboApertura.numeroEmision, false) ||
					!isValidString(reciboApertura.tipoNovedad, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (reciboApertura.importeCancelar === 0 && reciboApertura.importeImputacionContable === 0) {
					reject(new ValidationError('La apertura debe tener un importe mayor a cero'));
					return;
				}

				const result = await this.reciboAperturaRepository.modify(id, reciboApertura);
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
				const result = await this.reciboAperturaRepository.remove(id);
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
