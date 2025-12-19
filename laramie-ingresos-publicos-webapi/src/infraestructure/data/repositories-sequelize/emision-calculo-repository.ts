import IEmisionCalculoRepository from '../../../domain/repositories/emision-calculo-repository';
import EmisionCalculoModel from './models/emision-calculo-model';
import EmisionCalculo from '../../../domain/entities/emision-calculo';
import EmisionCalculoState from '../../../domain/dto/emision-calculo-state';

export default class EmisionCalculoRepositorySequelize implements IEmisionCalculoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionCalculoModel.findAll();
		const result = data.map((row) => new EmisionCalculo(...row.getDataValues()));

		return result;
	}

	async listByEmisionDefinicion(idEmisionDefinicion:number) {
		const data = await EmisionCalculoModel.findAll({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = data.map((row) => new EmisionCalculoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionCalculoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionCalculo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionCalculo) {
		const data = await EmisionCalculoModel.create({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTipoEmisionCalculo: row.idTipoEmisionCalculo,
			codigo: row.codigo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			guardaValor: row.guardaValor,
			formula: row.formula,
			orden: row.orden,
			soloLectura: row.soloLectura
		});
		const result = new EmisionCalculo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionCalculo) {
		const affectedCount = await EmisionCalculoModel.update({
			idEmisionDefinicion: row.idEmisionDefinicion,
			idTipoEmisionCalculo: row.idTipoEmisionCalculo,
			codigo: row.codigo,
			nombre: row.nombre,
			descripcion: row.descripcion,
			guardaValor: row.guardaValor,
			formula: row.formula,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionCalculoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionCalculo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionCalculoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionDefinicion(idEmisionDefinicion:number) {
		const affectedCount = await EmisionCalculoModel.destroy({ where: { idEmisionDefinicion: idEmisionDefinicion } });
		const result = (affectedCount > 0) ? {idEmisionDefinicion} : null;
		
		return result;
	}

}
