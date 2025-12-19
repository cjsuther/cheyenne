import IEdesurClienteRepository from '../../../domain/repositories/edesur-cliente-repository';
import IPersonaRepository from '../../../domain/repositories/persona-repository';
import EdesurClienteModel from './models/edesur-cliente-model';
import EdesurCliente from '../../../domain/entities/edesur-cliente';
import PersonaModel from './models/persona-model';
import Persona from '../../../domain/entities/persona';

export default class EdesurClienteRepositorySequelize implements IEdesurClienteRepository {

	personaRepository: IPersonaRepository;

	constructor(personaRepository: IPersonaRepository) {
		this.personaRepository = personaRepository;

	}

	async listByEdesur(idEdesur:number) {
		const data = await EdesurClienteModel.findAll({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { idEdesur: idEdesur }
		});
		const result = data.map((row) => this.ObjectToClass(row));

		return result;
	}

	async findById(id:number) {
		const data = await EdesurClienteModel.findOne({
			include: [
				{ model: PersonaModel, as: 'persona' }
			],
			where: { id: id }
		});
		const result = (data) ? this.ObjectToClass(data) : null;

		return result;
	}

	async add(row:EdesurCliente) {
		const data = await EdesurClienteModel.create({
			idEdesur: row.idEdesur,
			idPersona: row.idPersona,
			codigoCliente: row.codigoCliente,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new EdesurCliente(...data.getDataValues());

		if (row.idPersona) {
			const persona = new Persona(
				row.idPersona,
				row.idTipoPersona,
				row.nombrePersona,
				row.idTipoDocumento,
				row.numeroDocumento
			);
			await this.personaRepository.checkById(row.idPersona, persona);
		}

		return result;
	}

	async modify(id:number, row:EdesurCliente) {
		const rowOriginal = await this.findById(id);

		const affectedCount = await EdesurClienteModel.update({
			idEdesur: row.idEdesur,
			idPersona: row.idPersona,
			codigoCliente: row.codigoCliente,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		let result = null;
		if (rowOriginal && affectedCount[0] > 0) {

			if (row.idPersona && row.idPersona !== rowOriginal.idPersona) {
				const persona = new Persona(
					row.idPersona,
					row.idTipoPersona,
					row.nombrePersona,
					row.idTipoDocumento,
					row.numeroDocumento
				);
				await this.personaRepository.checkById(row.idPersona, persona);
			}
		}

		const data =  await EdesurClienteModel.findOne({ where: { id: id } });
		result = (data) ? new EdesurCliente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EdesurClienteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEdesur(idEdesur: number) {
		const affectedCount = await EdesurClienteModel.destroy({ where: { idEdesur: idEdesur } });
		const result = (affectedCount > 0) ? {idEdesur} : null;
		
		return result;
	}

	ObjectToClass(row:any) {
		const persona = row["persona"];

		let edesurCliente = new EdesurCliente(...row.getDataValues());
		if (persona) {
			edesurCliente.idTipoPersona = parseInt(persona.idTipoPersona);
			edesurCliente.nombrePersona = persona.nombrePersona;
			edesurCliente.idTipoDocumento = parseInt(persona.idTipoDocumento);
			edesurCliente.numeroDocumento = persona.numeroDocumento;
		}

		return edesurCliente;
	}

}
