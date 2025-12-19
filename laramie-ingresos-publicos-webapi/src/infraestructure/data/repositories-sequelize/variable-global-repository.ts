import IVariableGlobalRepository from '../../../domain/repositories/variable-global-repository';
import VariableGlobalModel from './models/variable-global-model';
import VariableGlobal from '../../../domain/entities/variable-global';

export default class VariableGlobalRepositorySequelize implements IVariableGlobalRepository {

	constructor() {

	}

	async list() {
		const data = await VariableGlobalModel.findAll();
		const result = data.map((row) => new VariableGlobal(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await VariableGlobalModel.findOne({ where: { id: id } });
		const result = (data) ? new VariableGlobal(...data.getDataValues()) : null;

		return result;
	}

	async add(row:VariableGlobal) {
		const data = await VariableGlobalModel.create({
			idVariable: row.idVariable,
			valor: row.valor,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new VariableGlobal(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:VariableGlobal) {
		const affectedCount = await VariableGlobalModel.update({
			idVariable: row.idVariable,
			valor: row.valor,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await VariableGlobalModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new VariableGlobal(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VariableGlobalModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
