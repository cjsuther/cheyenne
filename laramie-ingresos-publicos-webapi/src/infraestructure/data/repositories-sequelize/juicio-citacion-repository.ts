import IJuicioCitacionRepository from '../../../domain/repositories/juicio-citacion-repository';
import JuicioCitacionModel from './models/juicio-citacion-model';
import JuicioCitacion from '../../../domain/entities/juicio-citacion';
import JuicioCitacionState from '../../../domain/dto/juicio-citacion-state';

export default class JuicioCitacionRepositorySequelize implements IJuicioCitacionRepository {

	constructor() {

	}

	async listByApremio(idApremio: number) {
		const data = await JuicioCitacionModel.findAll({where: { idApremio: idApremio }});
		const result = data.map((row) => new JuicioCitacionState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await JuicioCitacionModel.findOne({ where: { id: id } });
		const result = (data) ? new JuicioCitacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:JuicioCitacion) {
		const data = await JuicioCitacionModel.create({
			idApremio: row.idApremio,
			fechaCitacion: row.fechaCitacion,
			idTipoCitacion: row.idTipoCitacion,
			observacion: row.observacion
		});
		const result = new JuicioCitacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:JuicioCitacion) {
		const affectedCount = await JuicioCitacionModel.update({
			idTipoCitacion: row.idTipoCitacion,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await JuicioCitacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new JuicioCitacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await JuicioCitacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByApremio(idApremio: number) {
		const affectedCount = await JuicioCitacionModel.destroy({ where: { idApremio: idApremio } });
		const result = (affectedCount > 0) ? {idApremio} : null;

		return result;
	}

}