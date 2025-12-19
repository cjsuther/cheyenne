import IEmisionVariableRepository from '../../../domain/repositories/emision-variable-repository';
import EmisionVariableModel from './models/emision-variable-model';
import EmisionVariable from '../../../domain/entities/emision-variable';
import EmisionVariableState from '../../../domain/dto/emision-variable-state';

export default class EmisionVariableRepositorySequelize implements IEmisionVariableRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionVariableModel.findAll();
		const result = data.map((row) => new EmisionVariable(...row.getDataValues()));

		return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionVariableModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionVariableState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionVariableModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionVariable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionVariable) {
		const data = await EmisionVariableModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idProcedimientoVariable: row.idProcedimientoVariable
		});
		const result = new EmisionVariable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionVariable) {
		const affectedCount = await EmisionVariableModel.update({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idProcedimientoVariable: row.idProcedimientoVariable
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionVariableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionVariable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionVariableModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionDefinicion(idEmisionDefinicion:number) {
		const affectedCount = await EmisionVariableModel.destroy({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = (affectedCount > 0) ? {idEmisionDefinicion} : null;
		
		return result;
	}

}
