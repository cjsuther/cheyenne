import IRubroLiquidacionRepository from '../../../domain/repositories/rubro-liquidacion-repository';
import RubroLiquidacionModel from './models/rubro-liquidacion-model';
import RubroLiquidacion from '../../../domain/entities/rubro-liquidacion';

export default class RubroLiquidacionRepositorySequelize implements IRubroLiquidacionRepository {

	constructor() {

	}

	async list() {
		const data = await RubroLiquidacionModel.findAll();
		const result = data.map((row) => new RubroLiquidacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RubroLiquidacionModel.findOne({ where: { id: id } });
		const result = (data) ? new RubroLiquidacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RubroLiquidacion) {
		const data = await RubroLiquidacionModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			numera: row.numera,
			numero: row.numero,
			reliquida: row.reliquida
		});
		const result = new RubroLiquidacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RubroLiquidacion) {
		const affectedCount = await RubroLiquidacionModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			numera: row.numera,
			numero: row.numero,
			reliquida: row.reliquida
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RubroLiquidacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RubroLiquidacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RubroLiquidacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
