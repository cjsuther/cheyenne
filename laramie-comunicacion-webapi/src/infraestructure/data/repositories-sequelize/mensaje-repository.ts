import IMensajeRepository from '../../../domain/repositories/mensaje-repository';
import MensajeModel from './models/mensaje-model';
import Mensaje from '../../../domain/entities/mensaje';

export default class MensajeRepositorySequelize implements IMensajeRepository {

	constructor() {

	}

	async list() {
		const data = await MensajeModel.findAll();
		const result = data.map((row) => new Mensaje(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MensajeModel.findOne({ where: { id: id } });
		const result = (data) ? new Mensaje(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Mensaje) {
		const data = await MensajeModel.create({
			idTipoMensaje: row.idTipoMensaje,
			idEstadoMensaje: row.idEstadoMensaje,
			idCanal: row.idCanal,
			idPrioridad: row.idPrioridad,
			identificador: row.identificador,
			titulo: row.titulo,
			cuerpo: row.cuerpo,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion,
			fechaRecepcion: row.fechaRecepcion,
			fechaEnvio: row.fechaEnvio
		});
		const result = new Mensaje(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Mensaje) {
		const affectedCount = await MensajeModel.update({
			idTipoMensaje: row.idTipoMensaje,
			idEstadoMensaje: row.idEstadoMensaje,
			idCanal: row.idCanal,
			idPrioridad: row.idPrioridad,
			identificador: row.identificador,
			titulo: row.titulo,
			cuerpo: row.cuerpo,
			idUsuarioCreacion: row.idUsuarioCreacion,
			fechaCreacion: row.fechaCreacion,
			fechaRecepcion: row.fechaRecepcion,
			fechaEnvio: row.fechaEnvio
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MensajeModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Mensaje(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MensajeModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
