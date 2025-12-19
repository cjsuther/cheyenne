import ISesionRepository from '../../../domain/repositories/sesion-repository';
import SesionModel from './models/sesion-model';
import Sesion from '../../../domain/entities/sesion';

export default class SesionRepositorySequelize implements ISesionRepository {

	constructor() {

	}

	async findByToken(token:string) {
		const data = await SesionModel.findOne({ where: { token: token } });
		const result = (data) ? new Sesion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Sesion) {
		const data = await SesionModel.create({
			token: row.token,
			fechaVencimiento: row.fechaVencimiento,
			fechaCreacion: row.fechaCreacion
		});
		const result = new Sesion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Sesion) {
		const affectedCount = await SesionModel.update({
			token: row.token,
			fechaVencimiento: row.fechaVencimiento,
			fechaCreacion: row.fechaCreacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await SesionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Sesion(...data.getDataValues()) : null;

		return result;
	}

}
