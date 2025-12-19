import ITipoVehiculoRepository from '../../../domain/repositories/tipo-vehiculo-repository';
import TipoVehiculoModel from './models/tipo-vehiculo-model';
import TipoVehiculo from '../../../domain/entities/tipo-vehiculo';

export default class TipoVehiculoRepositorySequelize implements ITipoVehiculoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoVehiculoModel.findAll();
		const result = data.map((row) => new TipoVehiculo(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoVehiculoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoVehiculo) {
		const data = await TipoVehiculoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idIncisoVehiculo: row.idIncisoVehiculo
		});
		const result = new TipoVehiculo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoVehiculo) {
		const affectedCount = await TipoVehiculoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idIncisoVehiculo: row.idIncisoVehiculo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoVehiculoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoVehiculoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
