import IVerificacionRepository from '../../../domain/repositories/verificacion-repository';
import VerificacionModel from './models/verificacion-model';
import Verificacion from '../../../domain/entities/verificacion';

export default class VerificacionRepositorySequelize implements IVerificacionRepository {

	constructor() {

	}

	async listByInhumado(idInhumado: number) {
		const data = await VerificacionModel.findAll({ where: { idInhumado: idInhumado } });
		const result = data.map((row) => new Verificacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await VerificacionModel.findOne({ where: { id: id } });
		const result = (data) ? new Verificacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Verificacion) {
		const data = await VerificacionModel.create({
			idInhumado: row.idInhumado,
			fecha: row.fecha,
			motivoVerificacion: row.motivoVerificacion,
			idTipoDocumentoVerificador: row.idTipoDocumentoVerificador,
			numeroDocumentoVerificador: row.numeroDocumentoVerificador,
			apellidoVerificador: row.apellidoVerificador,
			nombreVerificador: row.nombreVerificador,
			idResultadoVerificacion: row.idResultadoVerificacion
		});
		const result = new Verificacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Verificacion) {
		const affectedCount = await VerificacionModel.update({
			idInhumado: row.idInhumado,
			fecha: row.fecha,
			motivoVerificacion: row.motivoVerificacion,
			idTipoDocumentoVerificador: row.idTipoDocumentoVerificador,
			numeroDocumentoVerificador: row.numeroDocumentoVerificador,
			apellidoVerificador: row.apellidoVerificador,
			nombreVerificador: row.nombreVerificador,
			idResultadoVerificacion: row.idResultadoVerificacion
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

	async removeByInhumado(idInhumado: number) {
		const affectedCount = await VerificacionModel.destroy({ where: { idInhumado: idInhumado } });
		const result = (affectedCount > 0) ? {idInhumado} : null;
		
		return result;
	}

}
