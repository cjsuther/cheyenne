import ITipoConstruccionFunerariaRepository from '../../../domain/repositories/tipo-construccion-funeraria-repository';
import TipoConstruccionFunerariaModel from './models/tipo-construccion-funeraria-model';
import TipoConstruccionFuneraria from '../../../domain/entities/tipo-construccion-funeraria';

export default class TipoConstruccionFunerariaRepositorySequelize implements ITipoConstruccionFunerariaRepository {

	constructor() {

	}

	async list() {
		const data = await TipoConstruccionFunerariaModel.findAll();
		const result = data.map((row) => new TipoConstruccionFuneraria(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoConstruccionFunerariaModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoConstruccionFuneraria(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoConstruccionFuneraria) {
		const data = await TipoConstruccionFunerariaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			conVencimiento: row.conVencimiento,
			plazoMaxConcesion: row.plazoMaxConcesion,
			terminoConcesion1: row.terminoConcesion1,
			terminoConcesion2: row.terminoConcesion2,
			plazoMaxRenovacion: row.plazoMaxRenovacion,
			terminoRenovacion1: row.terminoRenovacion1,
			terminoRenovacion2: row.terminoRenovacion2
		});
		const result = new TipoConstruccionFuneraria(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoConstruccionFuneraria) {
		const affectedCount = await TipoConstruccionFunerariaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			conVencimiento: row.conVencimiento,
			plazoMaxConcesion: row.plazoMaxConcesion,
			terminoConcesion1: row.terminoConcesion1,
			terminoConcesion2: row.terminoConcesion2,
			plazoMaxRenovacion: row.plazoMaxRenovacion,
			terminoRenovacion1: row.terminoRenovacion1,
			terminoRenovacion2: row.terminoRenovacion2
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoConstruccionFunerariaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoConstruccionFuneraria(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoConstruccionFunerariaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
