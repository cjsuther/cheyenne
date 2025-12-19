import IFuncionParametroRepository from '../../../domain/repositories/funcion-parametro-repository';
import FuncionParametroModel from './models/funcion-parametro-model';
import FuncionParametro from '../../../domain/entities/funcion-parametro';

export default class FuncionParametroRepositorySequelize implements IFuncionParametroRepository {

	constructor() {

	}

	async list() {
		const data = await FuncionParametroModel.findAll();
		const result = data.map((row) => new FuncionParametro(...row.getDataValues()));

		return result;
	}

	async listByFuncion(idFuncion:number) {
		const data = await FuncionParametroModel.findAll({ where: { idFuncion: idFuncion } });
		const result = data.map((row) => new FuncionParametro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await FuncionParametroModel.findOne({ where: { id: id } });
		const result = (data) ? new FuncionParametro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:FuncionParametro) {
		const data = await FuncionParametroModel.create({
			idFuncion: row.idFuncion,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		});
		const result = new FuncionParametro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:FuncionParametro) {
		const affectedCount = await FuncionParametroModel.update({
			idFuncion: row.idFuncion,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await FuncionParametroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new FuncionParametro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await FuncionParametroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
