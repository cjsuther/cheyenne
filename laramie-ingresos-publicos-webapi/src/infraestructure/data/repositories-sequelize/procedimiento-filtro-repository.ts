import IProcedimientoFiltroRepository from '../../../domain/repositories/procedimiento-filtro-repository';
import ProcedimientoFiltroModel from './models/procedimiento-filtro-model';
import ProcedimientoFiltro from '../../../domain/entities/procedimiento-filtro';
import ProcedimientoFiltroState from '../../../domain/dto/procedimiento-filtro-state';

export default class ProcedimientoFiltroRepositorySequelize implements IProcedimientoFiltroRepository {

	constructor() {

	}

	async list() {
		const data = await ProcedimientoFiltroModel.findAll();
		const result = data.map((row) => new ProcedimientoFiltro(...row.getDataValues()));

		return result;
	}

	async listByProcedimiento(idProcedimiento:number) {
		const data = await ProcedimientoFiltroModel.findAll({ where: { idProcedimiento: idProcedimiento } });
		const result = data.map((row) => new ProcedimientoFiltroState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ProcedimientoFiltroModel.findOne({ where: { id: id } });
		const result = (data) ? new ProcedimientoFiltro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ProcedimientoFiltro) {
		const data = await ProcedimientoFiltroModel.create({
			idProcedimiento: row.idProcedimiento,
			idFiltro: row.idFiltro
		});
		const result = new ProcedimientoFiltro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ProcedimientoFiltro) {
		const affectedCount = await ProcedimientoFiltroModel.update({
			idProcedimiento: row.idProcedimiento,
			idFiltro: row.idFiltro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcedimientoFiltroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ProcedimientoFiltro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcedimientoFiltroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	
	async removeByProcedimiento(idProcedimiento:number) {
		const affectedCount = await ProcedimientoFiltroModel.destroy({ where: { idProcedimiento: idProcedimiento } });
		const result = (affectedCount > 0) ? {idProcedimiento} : null;
		
		return result;
	}

}
