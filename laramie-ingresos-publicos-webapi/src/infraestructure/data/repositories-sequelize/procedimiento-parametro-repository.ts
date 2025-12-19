import IProcedimientoParametroRepository from '../../../domain/repositories/procedimiento-parametro-repository';
import ProcedimientoParametroModel from './models/procedimiento-parametro-model';
import ProcedimientoParametro from '../../../domain/entities/procedimiento-parametro';

export default class ProcedimientoParametroRepositorySequelize implements IProcedimientoParametroRepository {

	constructor() {

	}

	async list() {
		const data = await ProcedimientoParametroModel.findAll();
		const result = data.map((row) => new ProcedimientoParametro(...row.getDataValues()));

		return result;
	}

	async listByProcedimiento(idProcedimiento:number) {
		const data = await ProcedimientoParametroModel.findAll({ where: { idProcedimiento: idProcedimiento } });
		const result = data.map((row) => new ProcedimientoParametro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ProcedimientoParametroModel.findOne({ where: { id: id } });
		const result = (data) ? new ProcedimientoParametro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ProcedimientoParametro) {
		const data = await ProcedimientoParametroModel.create({
			idProcedimiento: row.idProcedimiento,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		});
		const result = new ProcedimientoParametro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ProcedimientoParametro) {
		const affectedCount = await ProcedimientoParametroModel.update({
			idProcedimiento: row.idProcedimiento,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcedimientoParametroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ProcedimientoParametro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcedimientoParametroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByProcedimiento(idProcedimiento:number) {
		const affectedCount = await ProcedimientoParametroModel.destroy({ where: { idProcedimiento: idProcedimiento } });
		const result = (affectedCount > 0) ? {idProcedimiento} : null;
		
		return result;
	}

}
