import ICategoriaVehiculoRepository from '../../../domain/repositories/categoria-vehiculo-repository';
import CategoriaVehiculoModel from './models/categoria-vehiculo-model';
import CategoriaVehiculo from '../../../domain/entities/categoria-vehiculo';

export default class CategoriaVehiculoRepositorySequelize implements ICategoriaVehiculoRepository {

	constructor() {

	}

	async list() {
		const data = await CategoriaVehiculoModel.findAll();
		const result = data.map((row) => new CategoriaVehiculo(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CategoriaVehiculoModel.findOne({ where: { id: id } });
		const result = (data) ? new CategoriaVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CategoriaVehiculo) {
		const data = await CategoriaVehiculoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idIncisoVehiculo: row.idIncisoVehiculo,
			limiteInferior: row.limiteInferior,
			limiteSuperior: row.limiteSuperior
		});
		const result = new CategoriaVehiculo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CategoriaVehiculo) {
		const affectedCount = await CategoriaVehiculoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idIncisoVehiculo: row.idIncisoVehiculo,
			limiteInferior: row.limiteInferior,
			limiteSuperior: row.limiteSuperior
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CategoriaVehiculoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CategoriaVehiculo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CategoriaVehiculoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
