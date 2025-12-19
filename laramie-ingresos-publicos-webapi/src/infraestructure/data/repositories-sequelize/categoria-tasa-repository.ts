import ICategoriaTasaRepository from '../../../domain/repositories/categoria-tasa-repository';
import CategoriaTasaModel from './models/categoria-tasa-model';
import CategoriaTasa from '../../../domain/entities/categoria-tasa';

export default class CategoriaTasaRepositorySequelize implements ICategoriaTasaRepository {

	constructor() {

	}

	async list() {
		const data = await CategoriaTasaModel.findAll();
		const result = data.map((row) => new CategoriaTasa(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CategoriaTasaModel.findOne({ where: { id: id } });
		const result = (data) ? new CategoriaTasa(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CategoriaTasa) {
		const data = await CategoriaTasaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			esPlan: row.esPlan,
			esDerechoEspontaneo: row.esDerechoEspontaneo
		});
		const result = new CategoriaTasa(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CategoriaTasa) {
		const affectedCount = await CategoriaTasaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			esPlan: row.esPlan,
			esDerechoEspontaneo: row.esDerechoEspontaneo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CategoriaTasaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CategoriaTasa(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CategoriaTasaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
