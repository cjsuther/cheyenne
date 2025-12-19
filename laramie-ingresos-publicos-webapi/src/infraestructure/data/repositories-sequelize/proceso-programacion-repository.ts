import IProcesoProgramacionRepository from '../../../domain/repositories/proceso-programacion-repository';
import ProcesoProgramacionModel from './models/proceso-programacion-model';
import ProcesoProgramacion from '../../../domain/entities/proceso-programacion';

export default class ProcesoProgramacionRepositorySequelize implements IProcesoProgramacionRepository {

	constructor() {

	}

	async list() {
		const data = await ProcesoProgramacionModel.findAll();
		const result = data.map((row) => new ProcesoProgramacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ProcesoProgramacionModel.findOne({ where: { id: id } });
		const result = (data) ? new ProcesoProgramacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ProcesoProgramacion) {
		const data = await ProcesoProgramacionModel.create({
			entidad: row.entidad,
			descripcion: row.descripcion,
			urlEjecucion: row.urlEjecucion,
			idTipoProgramacion: row.idTipoProgramacion,
			diasProgramacion: row.diasProgramacion,
			fechaUltimaProgramacion: row.fechaUltimaProgramacion,
			activa: row.activa
		});
		const result = new ProcesoProgramacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ProcesoProgramacion) {
		const affectedCount = await ProcesoProgramacionModel.update({
			entidad: row.entidad,
			descripcion: row.descripcion,
			urlEjecucion: row.urlEjecucion,
			idTipoProgramacion: row.idTipoProgramacion,
			diasProgramacion: row.diasProgramacion,
			fechaUltimaProgramacion: row.fechaUltimaProgramacion,
			activa: row.activa
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProcesoProgramacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ProcesoProgramacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProcesoProgramacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
