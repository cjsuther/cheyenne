import IVerificacionRepository from '../../../domain/repositories/verificacion-repository';
import VerificacionModel from './models/verificacion-model';
import Verificacion from '../../../domain/entities/verificacion';

export default class VerificacionRepositorySequelize implements IVerificacionRepository {

	constructor() {

	}

	async list() {
		const data = await VerificacionModel.findAll();
		const result = data.map((row) => new Verificacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await VerificacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Verificacion(...data.getDataValues()) : null;

		return result;
	}

	async findByToken(token:string) {
		const data = await VerificacionModel.findOne({ where: { token: token }})
		return (data) ? new Verificacion(...data.getDataValues()) : null
	}

	async add(row:Verificacion) {
		const data = await VerificacionModel.create({
			id: row.id,
			idTipoVerificacion: row.idTipoVerificacion,
			idEstadoVerificacion: row.idEstadoVerificacion,
			idUsuario: row.idUsuario,
			codigo: row.codigo,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			token: row.token,
			detalle: row.detalle
		});
		const result = new Verificacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Verificacion) {
		const affectedCount = await VerificacionModel.update({
			id: row.id,
			idTipoVerificacion: row.idTipoVerificacion,
			idEstadoVerificacion: row.idEstadoVerificacion,
			idUsuario: row.idUsuario,
			codigo: row.codigo,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			token: row.token,
			detalle: row.detalle
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await VerificacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Verificacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await VerificacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
