import IIncisoVehiculoRepository from '../../../domain/repositories/inciso-vehiculo-repository';
import IncisoVehiculoModel from './models/inciso-vehiculo-model';
import IncisoVehiculo from '../../../domain/entities/inciso-vehiculo';

export default class IncisoVehiculoRepositorySequelize implements IIncisoVehiculoRepository {

	constructor() {

	}

	async list() {
		const data = await IncisoVehiculoModel.findAll();
		const result = data.map((row) => new IncisoVehiculo(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await IncisoVehiculoModel.findOne({ where: { id: id } });
		const result = (data) ? new IncisoVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:IncisoVehiculo) {
		const data = await IncisoVehiculoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			vehiculoMenor: row.vehiculoMenor
		});
		const result = new IncisoVehiculo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:IncisoVehiculo) {
		const affectedCount = await IncisoVehiculoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			vehiculoMenor: row.vehiculoMenor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await IncisoVehiculoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new IncisoVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await IncisoVehiculoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
