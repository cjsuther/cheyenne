import IEmisionCuentaCorrienteRepository from '../../../domain/repositories/emision-cuenta-corriente-repository';
import EmisionCuentaCorrienteModel from './models/emision-cuenta-corriente-model';
import EmisionCuentaCorriente from '../../../domain/entities/emision-cuenta-corriente';
import EmisionCuentaCorrienteState from '../../../domain/dto/emision-cuenta-corriente-state';

export default class EmisionCuentaCorrienteRepositorySequelize implements IEmisionCuentaCorrienteRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionCuentaCorrienteModel.findAll();
		const result = data.map((row) => new EmisionCuentaCorriente(...row.getDataValues()));

		return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionCuentaCorrienteModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionCuentaCorrienteState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionCuentaCorrienteModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionCuentaCorriente(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionCuentaCorriente) {
		const data = await EmisionCuentaCorrienteModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			tasaCabecera: row.tasaCabecera,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaDebe: row.formulaDebe,
			formulaHaber: row.formulaHaber,
			vencimiento: row.vencimiento,
			orden: row.orden,
			soloLectura: row.soloLectura
		});
		const result = new EmisionCuentaCorriente(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionCuentaCorriente) {
		const affectedCount = await EmisionCuentaCorrienteModel.update({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			tasaCabecera: row.tasaCabecera,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaDebe: row.formulaDebe,
			formulaHaber: row.formulaHaber,
			vencimiento: row.vencimiento,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionCuentaCorrienteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionCuentaCorriente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionCuentaCorrienteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionDefinicion(idEmisionDefinicion:number) {
		const affectedCount = await EmisionCuentaCorrienteModel.destroy({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = (affectedCount > 0) ? {idEmisionDefinicion} : null;
		
		return result;
	}

}
