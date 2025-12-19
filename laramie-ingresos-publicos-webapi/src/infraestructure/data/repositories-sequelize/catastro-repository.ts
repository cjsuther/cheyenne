import ICatastroRepository from '../../../domain/repositories/catastro-repository';
import CatastroModel from './models/catastro-model';
import Catastro from '../../../domain/entities/catastro';
import CatastroState from '../../../domain/dto/catastro-state';

export default class CatastroRepositorySequelize implements ICatastroRepository {

	constructor() {

	}

	async list() {
		const data = await CatastroModel.findAll();
		const result = data.map((row) => new CatastroState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CatastroModel.findOne({ where: { id: id } });
		const result = (data) ? new Catastro(...data.getDataValues()) : null;

		return result;
	}

	async findByPartida(partida:string) {
		const data = await CatastroModel.findOne({ where: { partida: partida } });
		const result = (data) ? new Catastro(...data.getDataValues()) : new Catastro();

		return result;
	}

	async findByNomenclatura(circunscripcion: string, seccion: string, chacra: string, letraChacra: string, quinta: string, letraQuinta: string, fraccion: string, letraFraccion: string, manzana: string, letraManzana: string, parcela: string, letraParcela: string, subparcela: string) {
		const data = await CatastroModel.findOne({ where: {
			circunscripcion: circunscripcion,
			seccion: seccion,
			chacra: chacra,
			letraChacra: letraChacra,
			quinta: quinta,
			letraQuinta: letraQuinta,
			fraccion: fraccion,
			letraFraccion: letraFraccion,
			manzana: manzana,
			letraManzana: letraManzana,
			parcela: parcela,
			letraParcela: letraParcela,
			subparcela: subparcela
		 }});
		 const result = (data) ? new Catastro(...data.getDataValues()) : new Catastro();
		 
		return result;
	}

	async add(row:Catastro) {
		const data = await CatastroModel.create({
			partida: row.partida,
			digitoVerificador: row.digitoVerificador,
			partido: row.partido,
			circunscripcion: row.circunscripcion,
			seccion: row.seccion,
			chacra: row.chacra,
			letraChacra: row.letraChacra,
			quinta: row.quinta,
			letraQuinta: row.letraQuinta,
			fraccion: row.fraccion,
			letraFraccion: row.letraFraccion,
			manzana: row.manzana,
			letraManzana: row.letraManzana,
			parcela: row.parcela,
			letraParcela: row.letraParcela,
			subparcela: row.subparcela,
			destinatario: row.destinatario,
			calle: row.calle,
			altura: row.altura,
			piso: row.piso,
			departamento: row.departamento,
			barrio: row.barrio,
			entreCalle1: row.entreCalle1,
			entreCalle2: row.entreCalle2,
			localidad: row.localidad,
			codigoPostal: row.codigoPostal,
			vigencia: row.vigencia,
			codigoPostalArgentina: row.codigoPostalArgentina,
			superficie: row.superficie,
			caracteristica: row.caracteristica,
			valorTierra: row.valorTierra,
			superficieEdificada: row.superficieEdificada,
			valorEdificado: row.valorEdificado,
			valor1998: row.valor1998,
			valorMejoras: row.valorMejoras,
			edif1997: row.edif1997,
			valorFiscal: row.valorFiscal,
			mejoras1997: row.mejoras1997,
			origen: row.origen,
			motivoMovimiento: row.motivoMovimiento,
			titular: row.titular,
			codigoTitular: row.codigoTitular,
			dominioOrigen: row.dominioOrigen,
			dominioInscripcion: row.dominioInscripcion,
			dominioTipo: row.dominioTipo,
			dominioAnio: row.dominioAnio,
			unidadesFuncionales: row.unidadesFuncionales,
			serie: row.serie
		});
		const result = new Catastro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Catastro) {
		const affectedCount = await CatastroModel.update({
			partida: row.partida,
			digitoVerificador: row.digitoVerificador,
			partido: row.partido,
			circunscripcion: row.circunscripcion,
			seccion: row.seccion,
			chacra: row.chacra,
			letraChacra: row.letraChacra,
			quinta: row.quinta,
			letraQuinta: row.letraQuinta,
			fraccion: row.fraccion,
			letraFraccion: row.letraFraccion,
			manzana: row.manzana,
			letraManzana: row.letraManzana,
			parcela: row.parcela,
			letraParcela: row.letraParcela,
			subparcela: row.subparcela,
			destinatario: row.destinatario,
			calle: row.calle,
			altura: row.altura,
			piso: row.piso,
			departamento: row.departamento,
			barrio: row.barrio,
			entreCalle1: row.entreCalle1,
			entreCalle2: row.entreCalle2,
			localidad: row.localidad,
			codigoPostal: row.codigoPostal,
			vigencia: row.vigencia,
			codigoPostalArgentina: row.codigoPostalArgentina,
			superficie: row.superficie,
			caracteristica: row.caracteristica,
			valorTierra: row.valorTierra,
			superficieEdificada: row.superficieEdificada,
			valorEdificado: row.valorEdificado,
			valor1998: row.valor1998,
			valorMejoras: row.valorMejoras,
			edif1997: row.edif1997,
			valorFiscal: row.valorFiscal,
			mejoras1997: row.mejoras1997,
			origen: row.origen,
			motivoMovimiento: row.motivoMovimiento,
			titular: row.titular,
			codigoTitular: row.codigoTitular,
			dominioOrigen: row.dominioOrigen,
			dominioInscripcion: row.dominioInscripcion,
			dominioTipo: row.dominioTipo,
			dominioAnio: row.dominioAnio,
			unidadesFuncionales: row.unidadesFuncionales,
			serie: row.serie
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CatastroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Catastro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CatastroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
