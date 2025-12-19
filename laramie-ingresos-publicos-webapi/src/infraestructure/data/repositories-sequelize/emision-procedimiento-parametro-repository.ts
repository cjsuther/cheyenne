import IEmisionProcedimientoParametroRepository from '../../../domain/repositories/emision-procedimiento-parametro-repository';
import EmisionProcedimientoParametroModel from './models/emision-procedimiento-parametro-model';
import EmisionProcedimientoParametro from '../../../domain/entities/emision-procedimiento-parametro';
import EmisionProcedimientoParametroState from '../../../domain/dto/emision-procedimiento-parametro-state';

export default class EmisionProcedimientoParametroRepositorySequelize implements IEmisionProcedimientoParametroRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionProcedimientoParametroModel.findAll();
		const result = data.map((row) => new EmisionProcedimientoParametro(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionProcedimientoParametroModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = data.map((row) => new EmisionProcedimientoParametroState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionProcedimientoParametroModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionProcedimientoParametro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionProcedimientoParametro) {
		const data = await EmisionProcedimientoParametroModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idProcedimientoParametro: row.idProcedimientoParametro,
			valor: row.valor
		});
		const result = new EmisionProcedimientoParametro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionProcedimientoParametro) {
		const affectedCount = await EmisionProcedimientoParametroModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idProcedimientoParametro: row.idProcedimientoParametro,
			valor: row.valor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionProcedimientoParametroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionProcedimientoParametro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionProcedimientoParametroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionProcedimientoParametroModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

}
