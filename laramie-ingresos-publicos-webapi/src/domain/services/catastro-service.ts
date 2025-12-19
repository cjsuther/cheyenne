import Catastro from '../entities/catastro';
import ICatastroRepository from '../repositories/catastro-repository';
import { isValidString, isValidDate, isValidNumber,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CatastroState from '../dto/catastro-state';

export default class CatastroService {

	catastroRepository: ICatastroRepository;

	constructor(catastroRepository: ICatastroRepository) {
		this.catastroRepository = catastroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.catastroRepository.list() as Array<CatastroState>).sort((a, b) => a.id - b.id);
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
				const result = await this.catastroRepository.findById(id);
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

	async findByPartida(partida: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.catastroRepository.findByPartida(partida);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByNomenclatura(circunscripcion: string, seccion: string, chacra: string, letraChacra: string, quinta: string, letraQuinta: string, fraccion: string, letraFraccion: string, manzana: string, letraManzana: string, parcela: string, letraParcela: string, subparcela: string){
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.catastroRepository.findByNomenclatura(circunscripcion, seccion, chacra, letraChacra, quinta, letraQuinta, fraccion, letraFraccion, manzana, letraManzana, parcela, letraParcela, subparcela);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(catastro: Catastro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(catastro.partida, true) ||
					!isValidString(catastro.digitoVerificador, true) ||
					!isValidString(catastro.partido, true) ||
					!isValidString(catastro.circunscripcion, true) ||
					!isValidString(catastro.seccion, true) ||
					!isValidString(catastro.chacra, true) ||
					!isValidString(catastro.letraChacra, true) ||
					!isValidString(catastro.quinta, true) ||
					!isValidString(catastro.letraQuinta, true) ||
					!isValidString(catastro.fraccion, true) ||
					!isValidString(catastro.letraFraccion, true) ||
					!isValidString(catastro.manzana, true) ||
					!isValidString(catastro.letraManzana, true) ||
					!isValidString(catastro.parcela, true) ||
					!isValidString(catastro.letraParcela, true) ||
					!isValidString(catastro.subparcela, true) ||
					!isValidString(catastro.destinatario, true) ||
					!isValidString(catastro.calle, true) ||
					!isValidString(catastro.altura, true) ||
					!isValidString(catastro.piso, true) ||
					!isValidString(catastro.departamento, true) ||
					!isValidString(catastro.barrio, true) ||
					!isValidString(catastro.entreCalle1, true) ||
					!isValidString(catastro.entreCalle2, true) ||
					!isValidString(catastro.localidad, true) ||
					!isValidString(catastro.codigoPostal, true) ||
					!isValidDate(catastro.vigencia, false) ||
					!isValidString(catastro.codigoPostalArgentina, true) ||
					!isValidNumber(catastro.superficie, true) ||
					!isValidString(catastro.caracteristica, true) ||
					!isValidNumber(catastro.valorTierra, true) ||
					!isValidNumber(catastro.superficieEdificada, true) ||
					!isValidNumber(catastro.valorEdificado, true) ||
					!isValidNumber(catastro.valor1998, true) ||
					!isValidNumber(catastro.valorMejoras, true) ||
					!isValidNumber(catastro.edif1997, true) ||
					!isValidNumber(catastro.valorFiscal, true) ||
					!isValidNumber(catastro.mejoras1997, true) ||
					!isValidString(catastro.origen, true) ||
					!isValidString(catastro.motivoMovimiento, true) ||
					!isValidString(catastro.titular, true) ||
					!isValidString(catastro.codigoTitular, true) ||
					!isValidString(catastro.dominioOrigen, true) ||
					!isValidString(catastro.dominioInscripcion, true) ||
					!isValidString(catastro.dominioTipo, true) ||
					!isValidString(catastro.dominioAnio, true) ||
					!isValidString(catastro.unidadesFuncionales, true) ||
					!isValidString(catastro.serie, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				catastro.id = null;
				const result = await this.catastroRepository.add(catastro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, catastro: Catastro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(catastro.partida, true) ||
					!isValidString(catastro.digitoVerificador, true) ||
					!isValidString(catastro.partido, true) ||
					!isValidString(catastro.circunscripcion, true) ||
					!isValidString(catastro.seccion, true) ||
					!isValidString(catastro.chacra, true) ||
					!isValidString(catastro.letraChacra, true) ||
					!isValidString(catastro.quinta, true) ||
					!isValidString(catastro.letraQuinta, true) ||
					!isValidString(catastro.fraccion, true) ||
					!isValidString(catastro.letraFraccion, true) ||
					!isValidString(catastro.manzana, true) ||
					!isValidString(catastro.letraManzana, true) ||
					!isValidString(catastro.parcela, true) ||
					!isValidString(catastro.letraParcela, true) ||
					!isValidString(catastro.subparcela, true) ||
					!isValidString(catastro.destinatario, true) ||
					!isValidString(catastro.calle, true) ||
					!isValidString(catastro.altura, true) ||
					!isValidString(catastro.piso, true) ||
					!isValidString(catastro.departamento, true) ||
					!isValidString(catastro.barrio, true) ||
					!isValidString(catastro.entreCalle1, true) ||
					!isValidString(catastro.entreCalle2, true) ||
					!isValidString(catastro.localidad, true) ||
					!isValidString(catastro.codigoPostal, true) ||
					!isValidDate(catastro.vigencia, false) ||
					!isValidString(catastro.codigoPostalArgentina, true) ||
					!isValidNumber(catastro.superficie, true) ||
					!isValidString(catastro.caracteristica, true) ||
					!isValidNumber(catastro.valorTierra, true) ||
					!isValidNumber(catastro.superficieEdificada, true) ||
					!isValidNumber(catastro.valorEdificado, true) ||
					!isValidNumber(catastro.valor1998, true) ||
					!isValidNumber(catastro.valorMejoras, true) ||
					!isValidNumber(catastro.edif1997, true) ||
					!isValidNumber(catastro.valorFiscal, true) ||
					!isValidNumber(catastro.mejoras1997, true) ||
					!isValidString(catastro.origen, true) ||
					!isValidString(catastro.motivoMovimiento, true) ||
					!isValidString(catastro.titular, true) ||
					!isValidString(catastro.codigoTitular, true) ||
					!isValidString(catastro.dominioOrigen, true) ||
					!isValidString(catastro.dominioInscripcion, true) ||
					!isValidString(catastro.dominioTipo, true) ||
					!isValidString(catastro.dominioAnio, true) ||
					!isValidString(catastro.unidadesFuncionales, true) ||
					!isValidString(catastro.serie, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.catastroRepository.modify(id, catastro);
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
				const result = await this.catastroRepository.remove(id);
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
