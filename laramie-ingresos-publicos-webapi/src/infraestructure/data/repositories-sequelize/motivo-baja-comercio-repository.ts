import IMotivoBajaComercioRepository from '../../../domain/repositories/motivo-baja-comercio-repository';
import MotivoBajaComercioModel from './models/motivo-baja-comercio-model';
import MotivoBajaComercio from '../../../domain/entities/motivo-baja-comercio';

export default class MotivoBajaComercioRepositorySequelize implements IMotivoBajaComercioRepository {

	constructor() {

	}

	async list() {
		const data = await MotivoBajaComercioModel.findAll();
		const result = data.map((row) => new MotivoBajaComercio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MotivoBajaComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new MotivoBajaComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MotivoBajaComercio) {
		const data = await MotivoBajaComercioModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			bajaConDeuda: row.bajaConDeuda,
			bajaCancelaDeuda: row.bajaCancelaDeuda
		});
		const result = new MotivoBajaComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MotivoBajaComercio) {
		const affectedCount = await MotivoBajaComercioModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			bajaConDeuda: row.bajaConDeuda,
			bajaCancelaDeuda: row.bajaCancelaDeuda
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MotivoBajaComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MotivoBajaComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MotivoBajaComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
