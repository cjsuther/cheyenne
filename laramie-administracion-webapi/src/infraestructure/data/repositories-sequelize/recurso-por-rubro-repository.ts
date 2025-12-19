import IRecursoPorRubroRepository from '../../../domain/repositories/recurso-por-rubro-repository';
import RecursoPorRubroModel from './models/recurso-por-rubro-model';
import RecursoPorRubro from '../../../domain/entities/recurso-por-rubro';

export default class RecursoPorRubroRepositorySequelize implements IRecursoPorRubroRepository {

	constructor() {

	}

	async list() {
		const data = await RecursoPorRubroModel.findAll();
		const result = data.map((row) => new RecursoPorRubro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RecursoPorRubroModel.findOne({ where: { id: id } });
		const result = (data) ? new RecursoPorRubro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RecursoPorRubro) {
		const data = await RecursoPorRubroModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			presupuesto: row.presupuesto,
			agrupamiento: row.agrupamiento,
			procedencia: row.procedencia,
			caracterEconomico: row.caracterEconomico,
			nivel: row.nivel,
			fechaBaja: row.fechaBaja
		});
		const result = new RecursoPorRubro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RecursoPorRubro) {
		const affectedCount = await RecursoPorRubroModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			presupuesto: row.presupuesto,
			agrupamiento: row.agrupamiento,
			procedencia: row.procedencia,
			caracterEconomico: row.caracterEconomico,
			nivel: row.nivel,
			fechaBaja: row.fechaBaja
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RecursoPorRubroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RecursoPorRubro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RecursoPorRubroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
