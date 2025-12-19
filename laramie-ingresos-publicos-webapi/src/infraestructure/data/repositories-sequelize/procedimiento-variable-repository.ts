import IProcedimientoVariableRepository from '../../../domain/repositories/procedimiento-variable-repository';
import ProcedimientoVariableModel from './models/procedimiento-variable-model';
import ProcedimientoVariable from '../../../domain/entities/procedimiento-variable';

export default class ProcedimientoVariableRepositorySequelize implements IProcedimientoVariableRepository {

	constructor() {

	}

	async list() {
		const data = await ProcedimientoVariableModel.findAll();
		const result = data.map((row) => new ProcedimientoVariable(...row.getDataValues()));

		return result;
	}

	async listByProcedimiento(idProcedimiento:number) {
		const data = await ProcedimientoVariableModel.findAll({ where: { idProcedimiento: idProcedimiento } });
		const result = data.map((row) => new ProcedimientoVariable(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ProcedimientoVariableModel.findOne({ where: { id: id } });
		const result = (data) ? new ProcedimientoVariable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ProcedimientoVariable) {
		const data = await ProcedimientoVariableModel.create({
			idProcedimiento: row.idProcedimiento,
			idColeccionCampo: row.idColeccionCampo,
			idTipoVariable: row.idTipoVariable,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		});
		const result = new ProcedimientoVariable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ProcedimientoVariable) {
		const affectedCount = await ProcedimientoVariableModel.update({
			idProcedimiento: row.idProcedimiento,
			idColeccionCampo: row.idColeccionCampo,
			idTipoVariable: row.idTipoVariable,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcedimientoVariableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ProcedimientoVariable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcedimientoVariableModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByProcedimiento(idProcedimiento:number) {
		const affectedCount = await ProcedimientoVariableModel.destroy({ where: { idProcedimiento: idProcedimiento } });
		const result = (affectedCount > 0) ? {idProcedimiento} : null;
		
		return result;
	}

}
