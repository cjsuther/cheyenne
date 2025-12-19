import ICuentaContableRepository from '../../../domain/repositories/cuenta-contable-repository';
import CuentaContableModel from './models/cuenta-contable-model';
import CuentaContable from '../../../domain/entities/cuenta-contable';

export default class CuentaContableRepositorySequelize implements ICuentaContableRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaContableModel.findAll();
		const result = data.map((row) => new CuentaContable(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuentaContableModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaContable(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaContable) {
		const data = await CuentaContableModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			agrupamiento: row.agrupamiento
		});
		const result = new CuentaContable(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CuentaContable) {
		const affectedCount = await CuentaContableModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			agrupamiento: row.agrupamiento
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaContableModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaContable(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaContableModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
