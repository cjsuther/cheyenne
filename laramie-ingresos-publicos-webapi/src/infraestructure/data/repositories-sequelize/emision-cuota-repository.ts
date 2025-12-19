import IEmisionCuotaRepository from '../../../domain/repositories/emision-cuota-repository';
import EmisionCuotaModel from './models/emision-cuota-model';
import EmisionCuota from '../../../domain/entities/emision-cuota';
import EmisionCuotaState from '../../../domain/dto/emision-cuota-state';

export default class EmisionCuotaRepositorySequelize implements IEmisionCuotaRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionCuotaModel.findAll();
		const result = data.map((row) => new EmisionCuota(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionCuotaModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = data.map((row) => new EmisionCuotaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionCuotaModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionCuota(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionCuota) {
		const data = await EmisionCuotaModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			cuota: row.cuota,
			mes: row.mes,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			anioDDJJ: row.anioDDJJ,
			mesDDJJ: row.mesDDJJ,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			orden: row.orden
		});
		const result = new EmisionCuota(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionCuota) {
		const affectedCount = await EmisionCuotaModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			cuota: row.cuota,
			mes: row.mes,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			anioDDJJ: row.anioDDJJ,
			mesDDJJ: row.mesDDJJ,
			fechaVencimiento1: row.fechaVencimiento1,
			fechaVencimiento2: row.fechaVencimiento2,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionCuotaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionCuota(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionCuotaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionCuotaModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion } });
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

}
