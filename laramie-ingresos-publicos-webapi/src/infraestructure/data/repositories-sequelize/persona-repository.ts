import IPersonaRepository from '../../../domain/repositories/persona-repository';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class PersonaRepositorySequelize implements IPersonaRepository {

	constructor() {

	}

	async findById(id:number) {
		const data = await PersonaModel.findOne({ where: { id: id } });
		const result = (data) ? new Persona(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Persona) {
		const data = await PersonaModel.create({
			id: row.id,
			idTipoPersona: row.idTipoPersona,
			nombrePersona: row.nombrePersona,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento
		});
		const result = new Persona(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Persona) {
		const affectedCount = await PersonaModel.update({
			idTipoPersona: row.idTipoPersona,
			nombrePersona: row.nombrePersona,
			idTipoDocumento: row.idTipoDocumento,
			numeroDocumento: row.numeroDocumento
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PersonaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Persona(...data.getDataValues()) : null;

		return result;
	}

	async checkById(id:number, row:Persona) {
		const data = await PersonaModel.findOne({ where: { id: id } });
		if (data) {
			await this.modify(id, row);
		}
		else {
			await this.add(row);
		}

		return row;
	}

}
