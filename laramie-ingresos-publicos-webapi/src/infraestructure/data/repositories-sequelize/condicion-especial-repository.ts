import ICondicionEspecialRepository from '../../../domain/repositories/condicion-especial-repository';
import CondicionEspecialModel from './models/condicion-especial-model';
import CondicionEspecial from '../../../domain/entities/condicion-especial';
import CondicionEspecialState from '../../../domain/dto/condicion-especial-state';

export default class CondicionEspecialRepositorySequelize implements ICondicionEspecialRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await CondicionEspecialModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new CondicionEspecialState(...row.getDataValues()));

		return result;
	}

	async listByTipoCondicionEspecial(idTipoCondicionEspecial: number) {
		const data = await CondicionEspecialModel.findAll({where: { idTipoCondicionEspecial: idTipoCondicionEspecial }});
		const result = data.map((row) => new CondicionEspecialState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CondicionEspecialModel.findOne({ where: { id: id } });
		const result = (data) ? new CondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CondicionEspecial) {
		const data = await CondicionEspecialModel.create({
			idCuenta: row.idCuenta,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new CondicionEspecial(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CondicionEspecial) {
		const affectedCount = await CondicionEspecialModel.update({
			idCuenta: row.idCuenta,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CondicionEspecialModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CondicionEspecialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount = await CondicionEspecialModel.destroy({ where: { idCuenta: idCuenta } });
		const result = (affectedCount > 0) ? {idCuenta} : null;
		
		return result;
	}

}