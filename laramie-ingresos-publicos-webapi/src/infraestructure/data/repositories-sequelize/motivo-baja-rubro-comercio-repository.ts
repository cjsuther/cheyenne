import IMotivoBajaRubroComercioRepository from '../../../domain/repositories/motivo-baja-rubro-comercio-repository';
import MotivoBajaRubroComercioModel from './models/motivo-baja-rubro-comercio-model';
import MotivoBajaRubroComercio from '../../../domain/entities/motivo-baja-rubro-comercio';

export default class MotivoBajaRubroComercioRepositorySequelize implements IMotivoBajaRubroComercioRepository {

	constructor() {

	}

	async list() {
		const data = await MotivoBajaRubroComercioModel.findAll();
		const result = data.map((row) => new MotivoBajaRubroComercio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MotivoBajaRubroComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new MotivoBajaRubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MotivoBajaRubroComercio) {
		const data = await MotivoBajaRubroComercioModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			bajaConDeuda: row.bajaConDeuda,
			bajaCancelaDeuda: row.bajaCancelaDeuda
		});
		const result = new MotivoBajaRubroComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MotivoBajaRubroComercio) {
		const affectedCount = await MotivoBajaRubroComercioModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			bajaConDeuda: row.bajaConDeuda,
			bajaCancelaDeuda: row.bajaCancelaDeuda
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MotivoBajaRubroComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MotivoBajaRubroComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MotivoBajaRubroComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
