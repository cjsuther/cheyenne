import ITemaExpedienteRepository from '../../../domain/repositories/tema-expediente-repository';
import TemaExpedienteModel from './models/tema-expediente-model';
import TemaExpediente from '../../../domain/entities/tema-expediente';

export default class TemaExpedienteRepositorySequelize implements ITemaExpedienteRepository {

	constructor() {

	}

	async list() {
		const data = await TemaExpedienteModel.findAll();
		const result = data.map((row) => new TemaExpediente(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TemaExpedienteModel.findOne({ where: { id: id } });
		const result = (data) ? new TemaExpediente(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TemaExpediente) {
		const data = await TemaExpedienteModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			ejercicioOficina: row.ejercicioOficina,
			oficina: row.oficina,
			detalle: row.detalle,
			plazo: row.plazo,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		});
		const result = new TemaExpediente(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TemaExpediente) {
		const affectedCount = await TemaExpedienteModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			ejercicioOficina: row.ejercicioOficina,
			oficina: row.oficina,
			detalle: row.detalle,
			plazo: row.plazo,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TemaExpedienteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TemaExpediente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TemaExpedienteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
