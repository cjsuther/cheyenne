import IEmisionImputacionContableRepository from '../../../domain/repositories/emision-imputacion-contable-repository';
import EmisionImputacionContableModel from './models/emision-imputacion-contable-model';
import EmisionImputacionContable from '../../../domain/entities/emision-imputacion-contable';
import EmisionImputacionContableState from '../../../domain/dto/emision-imputacion-contable-state';

export default class EmisionImputacionContableRepositorySequelize implements IEmisionImputacionContableRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionImputacionContableModel.findAll();
		const result = data.map((row) => new EmisionImputacionContable(...row.getDataValues()));

		return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionImputacionContableModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionImputacionContableState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionImputacionContableModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionImputacionContable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionImputacionContable) {
		const data = await EmisionImputacionContableModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaPorcentaje: row.formulaPorcentaje,
			idTasaPorcentaje: row.idTasaPorcentaje,
			idSubTasaPorcentaje: row.idSubTasaPorcentaje,
			orden: row.orden,
			soloLectura: row.soloLectura
		});
		const result = new EmisionImputacionContable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionImputacionContable) {
		const affectedCount = await EmisionImputacionContableModel.update({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idTipoMovimiento: row.idTipoMovimiento,
			descripcion: row.descripcion,
			formulaCondicion: row.formulaCondicion,
			formulaPorcentaje: row.formulaPorcentaje,
			idTasaPorcentaje: row.idTasaPorcentaje,
			idSubTasaPorcentaje: row.idSubTasaPorcentaje,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionImputacionContableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionImputacionContable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionImputacionContableModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionDefinicion(idEmisionDefinicion:number) {
		const affectedCount = await EmisionImputacionContableModel.destroy({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = (affectedCount > 0) ? {idEmisionDefinicion} : null;
		
		return result;
	}

}
